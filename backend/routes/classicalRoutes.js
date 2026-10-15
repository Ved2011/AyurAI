/**
 * ============================================================================
 * Classical Ayurveda Express Routes (शास्त्रोक्त आयुर्वेद परिप्रेक्ष्य)
 * ============================================================================
 * Endpoints for:
 * - 1. Ritucharya (Seasonal Living & Dietetics)
 * - 2. Dravya Guna (Herbal Materia Medica)
 * - 3. Agni & Ama Pariksha (Metabolism & Toxin Diagnostic)
 * - 4. Nidra Vidhi (Circadian Sleep & Ojas Protocol)
 * - 5. Pathya & Gharelu Upachar (Classical Home Remedies)
 */

const express = require("express");
const {
  RITUS,
  getCurrentRitu,
  CANONICAL_HERBS,
  AGNI_AMA_QUIZ_QUESTIONS,
  evaluateAgniAma,
  NIDRA_CHRONO_CYCLES,
  DOSHA_NIDRA_PROTOCOLS,
  HOME_REMEDIES,
} = require("../services/ayurClassicalFeatures");

const router = express.Router();

// ----------------------------------------------------------------------------
// 1. Ritucharya Endpoints
// ----------------------------------------------------------------------------
router.get("/ritucharya/current", (req, res) => {
  const current = getCurrentRitu();
  res.json({
    current_season: current,
    system_date: new Date().toISOString(),
    scientific_grounding: "Charaka Samhita Sutrasthana 6 (Tasyashiteeya Adhyaya)",
  });
});

router.get("/ritucharya/all", (req, res) => {
  const current = getCurrentRitu();
  res.json({
    current_id: current.id,
    seasons: RITUS,
  });
});

router.get("/ritucharya/:seasonId", (req, res) => {
  const season = RITUS.find((r) => r.id.toLowerCase() === req.params.seasonId.toLowerCase());
  if (!season) {
    return res.status(404).json({ error: `Season '${req.params.seasonId}' not found.` });
  }
  res.json(season);
});

// ----------------------------------------------------------------------------
// 2. Dravya Guna (Pharmacopeia) Endpoints
// ----------------------------------------------------------------------------
router.get("/dravya-guna", (req, res) => {
  const { search, dosha, rasa } = req.query;
  let results = [...CANONICAL_HERBS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (h) =>
        h.name_sanskrit.toLowerCase().includes(q) ||
        h.botanical_name.toLowerCase().includes(q) ||
        h.common_names.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q)
    );
  }

  if (dosha) {
    const d = dosha.toLowerCase();
    results = results.filter((h) => h.doshakarma.toLowerCase().includes(d));
  }

  if (rasa) {
    const r = rasa.toLowerCase();
    results = results.filter((h) => h.rasa.some((taste) => taste.toLowerCase().includes(r)));
  }

  res.json({
    total: results.length,
    herbs: results,
    scientific_grounding: "Bhavaprakasha Nighantu & Charaka Samhita Sutrasthana 27",
  });
});

router.get("/dravya-guna/:id", (req, res) => {
  const herb = CANONICAL_HERBS.find((h) => h.id.toLowerCase() === req.params.id.toLowerCase());
  if (!herb) {
    return res.status(404).json({ error: `Herb '${req.params.id}' not found in canonical catalog.` });
  }
  res.json(herb);
});

// ----------------------------------------------------------------------------
// 3. Agni & Ama Pariksha Endpoints
// ----------------------------------------------------------------------------
router.get("/agni-ama/quiz", (req, res) => {
  res.json({
    total_questions: AGNI_AMA_QUIZ_QUESTIONS.length,
    questions: AGNI_AMA_QUIZ_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((opt, idx) => ({
        index: idx,
        text: opt.text,
      })),
    })),
    classical_grounding: "Charaka Samhita Vimanasthana 6:12 & Astanga Hridaya Nidanasthana 12:1",
  });
});

router.post("/agni-ama/evaluate", (req, res) => {
  const { answers = {} } = req.body;
  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ error: "Answers object with question responses is required." });
  }

  const result = evaluateAgniAma(answers);
  res.json({
    evaluated_at: new Date().toISOString(),
    ...result,
  });
});

// ----------------------------------------------------------------------------
// 4. Nidra Vidhi Endpoints
// ----------------------------------------------------------------------------
router.get("/nidra/plan", (req, res) => {
  const { dosha = "vata" } = req.query;
  const normalizedDosha = ["vata", "pitta", "kapha"].includes(dosha.toLowerCase())
    ? dosha.toLowerCase()
    : "vata";

  res.json({
    chrono_cycles: NIDRA_CHRONO_CYCLES,
    dosha_protocol: DOSHA_NIDRA_PROTOCOLS[normalizedDosha],
    all_protocols: DOSHA_NIDRA_PROTOCOLS,
    classical_grounding: "Charaka Samhita Sutrasthana 21:35-49 (Trayopasthambha Vidhi)",
  });
});

router.post("/nidra/calculate", (req, res) => {
  const { bedtime = "22:00", waketime = "06:00", dosha = "vata" } = req.body;

  // Calculate duration in hours
  const [bH, bM] = bedtime.split(":").map(Number);
  const [wH, wM] = waketime.split(":").map(Number);

  let bedMinutes = bH * 60 + (bM || 0);
  let wakeMinutes = wH * 60 + (wM || 0);
  if (wakeMinutes < bedMinutes) wakeMinutes += 24 * 60; // Next day

  const durationHours = parseFloat(((wakeMinutes - bedMinutes) / 60).toFixed(1));

  // Determine Kapha Kaala alignment (ideal bedtime: between 21:00 and 22:30)
  const isKaphaKaalaBedtime = (bH === 21) || (bH === 22 && bM <= 30);
  const isBrahmaMuhurtaWake = (wH === 4 && wM >= 30) || (wH === 5 && wM <= 30);

  let ojasScore = 70;
  if (isKaphaKaalaBedtime) ojasScore += 15;
  if (isBrahmaMuhurtaWake) ojasScore += 15;
  if (durationHours >= 7 && durationHours <= 8.5) ojasScore = Math.min(100, ojasScore + 5);

  const normalizedDosha = ["vata", "pitta", "kapha"].includes(dosha.toLowerCase())
    ? dosha.toLowerCase()
    : "vata";

  res.json({
    bedtime,
    waketime,
    duration_hours: durationHours,
    is_kapha_kaala_bedtime: isKaphaKaalaBedtime,
    is_brahma_muhurta_wake: isBrahmaMuhurtaWake,
    ojas_conservation_score: ojasScore,
    dosha_protocol: DOSHA_NIDRA_PROTOCOLS[normalizedDosha],
    recommendation: isKaphaKaalaBedtime
      ? "Excellent! Falling asleep during Kapha Kaala ensures deep REM synchronization and Ojas replenishment."
      : "Caution: Sleeping past 10:30 PM enters Pitta Kaala, exciting the liver and triggering midnight racing thoughts.",
  });
});

// ----------------------------------------------------------------------------
// 5. Pathya & Home Remedies Endpoints
// ----------------------------------------------------------------------------
router.get("/remedies", (req, res) => {
  const { search } = req.query;
  let results = [...HOME_REMEDIES];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.ailment_sanskrit.toLowerCase().includes(q) ||
        r.ailment_english.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  res.json({
    total: results.length,
    remedies: results,
    scientific_grounding: "Bhaishajya Ratnavali, Sharangadhara Samhita & Chakradatta",
  });
});

router.get("/remedies/:id", (req, res) => {
  const remedy = HOME_REMEDIES.find((r) => r.id.toLowerCase() === req.params.id.toLowerCase());
  if (!remedy) {
    return res.status(404).json({ error: `Remedy for '${req.params.id}' not found.` });
  }
  res.json(remedy);
});

module.exports = router;
