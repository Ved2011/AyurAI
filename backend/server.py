from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="AyurAI")
api_router = APIRouter(prefix="/api")


# ---------- Dosha Rule Engine ----------
# Each symptom contributes points to one of three doshas.
SYMPTOM_MAP: Dict[str, str] = {
    "stress": "vata",
    "cold": "vata",
    "insomnia": "vata",
    "anxiety": "vata",
    "joint_pain": "vata",
    "fatigue": "kapha",
    "weight_gain": "kapha",
    "congestion": "kapha",
    "digestion_issues": "pitta",
    "headaches": "pitta",
    "skin_issues": "pitta",
    "irritability": "pitta",
}

LIFESTYLE_MAP: Dict[str, str] = {
    "active": "pitta",
    "moderate": "vata",
    "sedentary": "kapha",
}

# Dosha-specific recommendation bundles (static Ayurvedic knowledge)
DOSHA_INFO: Dict[str, Dict] = {
    "vata": {
        "name": "Vata",
        "element": "Air & Ether",
        "tagline": "The energy of movement.",
        "description": "Vata governs breath, circulation and the nervous system. When imbalanced you may feel dry, restless, anxious, or scattered. Balance is restored through warmth, routine and grounding.",
        "herbs": [
            {"name": "Ashwagandha", "benefit": "Calms the nervous system & builds stamina"},
            {"name": "Brahmi", "benefit": "Soothes the mind and supports sleep"},
            {"name": "Triphala", "benefit": "Gentle digestive and elimination support"},
            {"name": "Licorice (Yashtimadhu)", "benefit": "Lubricates tissues & eases dryness"},
        ],
        "lifestyle_advice": [
            "Follow a consistent daily routine — regular meals and bedtime.",
            "Favor warm, cooked, slightly oily foods; avoid cold salads and raw snacks.",
            "Practice slow yoga, gentle walks and 10-minute abhyanga (warm oil self-massage).",
            "Sip warm ginger or cinnamon tea; reduce caffeine.",
            "Sleep by 10 PM — Vata thrives on rest and rhythm.",
        ],
    },
    "pitta": {
        "name": "Pitta",
        "element": "Fire & Water",
        "tagline": "The energy of transformation.",
        "description": "Pitta governs digestion, metabolism and intellect. When imbalanced you may feel overheated, irritable, inflamed or overly intense. Balance is restored through cooling, moderation and compassion.",
        "herbs": [
            {"name": "Amla (Amalaki)", "benefit": "Cools the system & supports liver"},
            {"name": "Shatavari", "benefit": "Soothes inflammation and hormonal heat"},
            {"name": "Neem", "benefit": "Purifies the skin and blood"},
            {"name": "Coriander", "benefit": "Cools digestion gently"},
        ],
        "lifestyle_advice": [
            "Eat cooling foods — cucumbers, coconut, sweet fruits, leafy greens.",
            "Avoid spicy, fried, sour and excessively salty foods.",
            "Exercise in the morning or evening; avoid midday sun.",
            "Make time for laughter, moonlight walks and non-competitive hobbies.",
            "Practice cooling pranayama (Sheetali breath) for 5 minutes daily.",
        ],
    },
    "kapha": {
        "name": "Kapha",
        "element": "Earth & Water",
        "tagline": "The energy of structure.",
        "description": "Kapha governs stability, immunity and lubrication. When imbalanced you may feel heavy, sluggish, congested or emotionally stuck. Balance is restored through movement, warmth and stimulation.",
        "herbs": [
            {"name": "Trikatu", "benefit": "Ignites digestive fire (ginger + pepper + pippali)"},
            {"name": "Tulsi (Holy Basil)", "benefit": "Clears congestion and uplifts mood"},
            {"name": "Guggulu", "benefit": "Supports metabolism & healthy weight"},
            {"name": "Turmeric", "benefit": "Reduces dampness & inflammation"},
        ],
        "lifestyle_advice": [
            "Rise early (before 6 AM) and move your body vigorously each day.",
            "Favor light, warm, spicy foods; reduce dairy, sweets and heavy oils.",
            "Try dry brushing (garshana) before bathing to stimulate circulation.",
            "Seek variety — change routines, try new routes, stay curious.",
            "Sip warm water with lemon, ginger and honey through the day.",
        ],
    },
}


def analyze_dosha(age: int, symptoms: List[str], lifestyle: str) -> Dict:
    """Pure rule-based dosha analysis — returns scores, dominant dosha + recommendations."""
    scores = {"vata": 0, "pitta": 0, "kapha": 0}

    # Age-stage contribution (Ayurvedic life cycles)
    if age < 25:
        scores["kapha"] += 1
    elif age <= 55:
        scores["pitta"] += 1
    else:
        scores["vata"] += 1

    # Symptom contribution (2 points each — primary signal)
    for s in symptoms:
        dosha = SYMPTOM_MAP.get(s)
        if dosha:
            scores[dosha] += 2

    # Lifestyle contribution
    lifestyle_dosha = LIFESTYLE_MAP.get(lifestyle)
    if lifestyle_dosha:
        scores[lifestyle_dosha] += 1

    # Tie-breaker: default to Vata (most common imbalance in modern life)
    dominant = max(scores, key=lambda k: (scores[k], -["vata", "pitta", "kapha"].index(k)))
    info = DOSHA_INFO[dominant]

    total = sum(scores.values()) or 1
    percentages = {k: round((v / total) * 100) for k, v in scores.items()}

    return {
        "dosha": dominant,
        "dosha_name": info["name"],
        "element": info["element"],
        "tagline": info["tagline"],
        "description": info["description"],
        "herbs": info["herbs"],
        "lifestyle_advice": info["lifestyle_advice"],
        "scores": scores,
        "percentages": percentages,
    }


# ---------- Models ----------
class AnalyzeRequest(BaseModel):
    age: int = Field(ge=1, le=120)
    symptoms: List[str] = Field(default_factory=list)
    lifestyle: str


class AnalysisRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    age: int
    symptoms: List[str]
    lifestyle: str
    dosha: str
    dosha_name: str
    element: str
    tagline: str
    description: str
    herbs: List[Dict]
    lifestyle_advice: List[str]
    scores: Dict[str, int]
    percentages: Dict[str, int]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "AyurAI API is running", "version": "1.0"}


@api_router.post("/analyze", response_model=AnalysisRecord)
async def analyze(payload: AnalyzeRequest):
    if payload.lifestyle not in LIFESTYLE_MAP:
        raise HTTPException(status_code=400, detail="Invalid lifestyle value")

    result = analyze_dosha(payload.age, payload.symptoms, payload.lifestyle)

    record = AnalysisRecord(
        age=payload.age,
        symptoms=payload.symptoms,
        lifestyle=payload.lifestyle,
        **result,
    )

    doc = record.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.analyses.insert_one(doc)
    return record


@api_router.get("/history", response_model=List[AnalysisRecord])
async def history():
    cursor = db.analyses.find({}, {"_id": 0}).sort("created_at", -1).limit(50)
    items = await cursor.to_list(50)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


@api_router.delete("/history/{record_id}")
async def delete_history(record_id: str):
    res = await db.analyses.delete_one({"id": record_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"deleted": record_id}


@api_router.get("/options")
async def options():
    """Returns the list of symptoms + lifestyles the frontend should render."""
    symptoms = [
        {"id": "stress", "label": "Stress"},
        {"id": "cold", "label": "Cold hands/feet"},
        {"id": "fatigue", "label": "Fatigue"},
        {"id": "digestion_issues", "label": "Digestion issues"},
        {"id": "insomnia", "label": "Insomnia"},
        {"id": "anxiety", "label": "Anxiety"},
        {"id": "headaches", "label": "Headaches"},
        {"id": "skin_issues", "label": "Skin issues"},
        {"id": "joint_pain", "label": "Joint pain"},
        {"id": "weight_gain", "label": "Weight gain"},
        {"id": "congestion", "label": "Congestion"},
        {"id": "irritability", "label": "Irritability"},
    ]
    lifestyles = [
        {"id": "active", "label": "Active"},
        {"id": "moderate", "label": "Moderate"},
        {"id": "sedentary", "label": "Sedentary"},
    ]
    return {"symptoms": symptoms, "lifestyles": lifestyles}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
