"""Backend tests for AyurAI API"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://ayur-recommendations.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Root
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# Options endpoint
def test_options(client):
    r = client.get(f"{API}/options")
    assert r.status_code == 200
    data = r.json()
    assert len(data["symptoms"]) == 12
    assert len(data["lifestyles"]) == 3
    ids = [s["id"] for s in data["symptoms"]]
    for expected in ["stress", "insomnia", "anxiety", "digestion_issues", "headaches",
                     "skin_issues", "irritability", "fatigue", "weight_gain", "congestion"]:
        assert expected in ids


# Analyze valid payload
def test_analyze_valid(client):
    payload = {"age": 32, "symptoms": ["stress", "insomnia"], "lifestyle": "moderate"}
    r = client.post(f"{API}/analyze", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["dosha"] in ["vata", "pitta", "kapha"]
    assert len(d["herbs"]) == 4
    assert len(d["lifestyle_advice"]) == 5
    assert "scores" in d and "percentages" in d
    assert set(d["scores"].keys()) == {"vata", "pitta", "kapha"}


# Rule engine correctness - vata
def test_analyze_vata_dominant(client):
    r = client.post(f"{API}/analyze", json={
        "age": 32, "symptoms": ["stress", "insomnia", "anxiety"], "lifestyle": "moderate"
    })
    assert r.status_code == 200
    assert r.json()["dosha"] == "vata"


# Rule engine correctness - pitta
def test_analyze_pitta_dominant(client):
    r = client.post(f"{API}/analyze", json={
        "age": 40, "symptoms": ["digestion_issues", "headaches", "skin_issues", "irritability"],
        "lifestyle": "active"
    })
    assert r.status_code == 200
    assert r.json()["dosha"] == "pitta"


# Rule engine correctness - kapha
def test_analyze_kapha_dominant(client):
    r = client.post(f"{API}/analyze", json={
        "age": 22, "symptoms": ["fatigue", "weight_gain", "congestion"], "lifestyle": "sedentary"
    })
    assert r.status_code == 200
    assert r.json()["dosha"] == "kapha"


# Invalid lifestyle -> 400
def test_analyze_invalid_lifestyle(client):
    r = client.post(f"{API}/analyze", json={"age": 30, "symptoms": [], "lifestyle": "hyperactive"})
    assert r.status_code == 400


# Invalid age -> 422
def test_analyze_age_zero(client):
    r = client.post(f"{API}/analyze", json={"age": 0, "symptoms": [], "lifestyle": "moderate"})
    assert r.status_code == 422


def test_analyze_age_150(client):
    r = client.post(f"{API}/analyze", json={"age": 150, "symptoms": [], "lifestyle": "moderate"})
    assert r.status_code == 422


# History returns sorted list with no _id leak
def test_history_and_delete(client):
    # create a record
    r = client.post(f"{API}/analyze", json={"age": 28, "symptoms": ["stress"], "lifestyle": "moderate"})
    assert r.status_code == 200
    rec_id = r.json()["id"]

    # fetch history
    h = client.get(f"{API}/history")
    assert h.status_code == 200
    items = h.json()
    assert isinstance(items, list)
    assert any(it["id"] == rec_id for it in items)
    # no _id leak
    for it in items:
        assert "_id" not in it
    # sorted newest first
    if len(items) >= 2:
        assert items[0]["created_at"] >= items[1]["created_at"]

    # delete
    d = client.delete(f"{API}/history/{rec_id}")
    assert d.status_code == 200
    assert d.json().get("deleted") == rec_id

    # delete non-existent -> 404
    d2 = client.delete(f"{API}/history/does-not-exist-xyz")
    assert d2.status_code == 404
