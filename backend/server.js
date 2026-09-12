const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "ayurai";
let db;

MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB:", dbName);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ---------- Dosha Rule Engine ----------
const SYMPTOM_MAP = {
  stress: "vata",
  cold: "vata",
  insomnia: "vata",
  anxiety: "vata",
  joint_pain: "vata",
  fatigue: "kapha",
  weight_gain: "kapha",
  congestion: "kapha",
  digestion_issues: "pitta",
  headaches: "pitta",
  skin_issues: "pitta",
  irritability: "pitta",
};

const LIFESTYLE_MAP = {
  active: "pitta",
  moderate: "vata",
  sedentary: "kapha",
};

const DOSHA_INFO = {
  vata: {
    name: "Vata",
    element: "Air & Ether",
    tagline: "The energy of movement.",
    description:
      "Vata governs breath, circulation and the nervous system. When imbalanced you may feel dry, restless, anxious, or scattered. Balance is restored through warmth, routine and grounding.",
    herbs: [
      { name: "Ashwagandha", benefit: "Calms the nervous system & builds stamina" },
      { name: "Brahmi", benefit: "Soothes the mind and supports sleep" },
      { name: "Triphala", benefit: "Gentle digestive and elimination support" },
      { name: "Licorice (Yashtimadhu)", benefit: "Lubricates tissues & eases dryness" },
    ],
    lifestyle_advice: [
      "Follow a consistent daily routine — regular meals and bedtime.",
      "Favor warm, cooked, slightly oily foods; avoid cold salads and raw snacks.",
      "Practice slow yoga, gentle walks and 10-minute abhyanga (warm oil self-massage).",
      "Sip warm ginger or cinnamon tea; reduce caffeine.",
      "Sleep by 10 PM — Vata thrives on rest and rhythm.",
    ],
  },
  pitta: {
    name: "Pitta",
    element: "Fire & Water",
    tagline: "The energy of transformation.",
    description:
      "Pitta governs digestion, metabolism and intellect. When imbalanced you may feel overheated, irritable, inflamed or overly intense. Balance is restored through cooling, moderation and compassion.",
    herbs: [
      { name: "Amla (Amalaki)", benefit: "Cools the system & supports liver" },
      { name: "Shatavari", benefit: "Soothes inflammation and hormonal heat" },
      { name: "Neem", benefit: "Purifies the skin and blood" },
      { name: "Coriander", benefit: "Cools digestion gently" },
    ],
    lifestyle_advice: [
      "Eat cooling foods — cucumbers, coconut, sweet fruits, leafy greens.",
      "Avoid spicy, fried, sour and excessively salty foods.",
      "Exercise in the morning or evening; avoid midday sun.",
      "Make time for laughter, moonlight walks and non-competitive hobbies.",
      "Practice cooling pranayama (Sheetali breath) for 5 minutes daily.",
    ],
  },
  kapha: {
    name: "Kapha",
    element: "Earth & Water",
    tagline: "The energy of structure.",
    description:
      "Kapha governs stability, immunity and lubrication. When imbalanced you may feel heavy, sluggish, congested or emotionally stuck. Balance is restored through movement, warmth and stimulation.",
    herbs: [
      { name: "Trikatu", benefit: "Ignites digestive fire (ginger + pepper + pippali)" },
      { name: "Tulsi (Holy Basil)", benefit: "Clears congestion and uplifts mood" },
      { name: "Guggulu", benefit: "Supports metabolism & healthy weight" },
      { name: "Turmeric", benefit: "Reduces dampness & inflammation" },
    ],
    lifestyle_advice: [
      "Rise early (before 6 AM) and move your body vigorously each day.",
      "Favor light, warm, spicy foods; reduce dairy, sweets and heavy oils.",
      "Try dry brushing (garshana) before bathing to stimulate circulation.",
      "Seek variety — change routines, try new routes, stay curious.",
      "Sip warm water with lemon, ginger and honey through the day.",
    ],
  },
};

const PRAKRITI_QUESTIONS = [
  { id: "body_frame", prompt: "Body frame", options: [{ dosha: "vata", label: "Thin, lean, hard to gain weight" }, { dosha: "pitta", label: "Medium, muscular, well-proportioned" }, { dosha: "kapha", label: "Large, sturdy, gains weight easily" }] },
  { id: "weight_pattern", prompt: "Weight pattern", options: [{ dosha: "vata", label: "Light — fluctuates easily" }, { dosha: "pitta", label: "Moderate — stable with effort" }, { dosha: "kapha", label: "Heavy — gains quickly, loses slowly" }] },
  { id: "skin", prompt: "Skin", options: [{ dosha: "vata", label: "Dry, rough, cool, thin" }, { dosha: "pitta", label: "Warm, reddish, sensitive, freckles/moles" }, { dosha: "kapha", label: "Soft, oily, thick, pale, smooth" }] },
  { id: "hair", prompt: "Hair", options: [{ dosha: "vata", label: "Dry, frizzy, brittle, thin" }, { dosha: "pitta", label: "Fine, soft, early graying or balding" }, { dosha: "kapha", label: "Thick, oily, wavy, lustrous" }] },
  { id: "eyes", prompt: "Eyes", options: [{ dosha: "vata", label: "Small, dry, active, dark" }, { dosha: "pitta", label: "Medium, sharp, penetrating" }, { dosha: "kapha", label: "Large, calm, moist, attractive" }] },
  { id: "teeth", prompt: "Teeth", options: [{ dosha: "vata", label: "Uneven, gums recede, often sensitive" }, { dosha: "pitta", label: "Medium-sized, yellowish, prone to bleeding gums" }, { dosha: "kapha", label: "Large, white, strong, well-formed" }] },
  { id: "appetite", prompt: "Appetite", options: [{ dosha: "vata", label: "Irregular — sometimes hungry, sometimes not" }, { dosha: "pitta", label: "Strong — intense hunger, gets irritable if skipped" }, { dosha: "kapha", label: "Slow but steady — can easily skip meals" }] },
  { id: "thirst", prompt: "Thirst", options: [{ dosha: "vata", label: "Variable" }, { dosha: "pitta", label: "High — always reaching for water" }, { dosha: "kapha", label: "Low — rarely thirsty" }] },
  { id: "digestion", prompt: "Digestion", options: [{ dosha: "vata", label: "Irregular, gas, bloating" }, { dosha: "pitta", label: "Strong, quick, occasional heartburn" }, { dosha: "kapha", label: "Slow, heavy after meals" }] },
  { id: "sleep", prompt: "Sleep", options: [{ dosha: "vata", label: "Light, interrupted, 5–6 hours" }, { dosha: "pitta", label: "Moderate, sound, 6–8 hours" }, { dosha: "kapha", label: "Deep, heavy, 8+ hours, hard to wake" }] },
  { id: "energy", prompt: "Energy pattern", options: [{ dosha: "vata", label: "Bursts of energy then fatigue" }, { dosha: "pitta", label: "Moderate, focused, goal-driven" }, { dosha: "kapha", label: "Steady, strong, enduring" }] },
  { id: "speed", prompt: "Speed of action", options: [{ dosha: "vata", label: "Fast, restless, hurried" }, { dosha: "pitta", label: "Medium, purposeful, sharp" }, { dosha: "kapha", label: "Slow, methodical, graceful" }] },
  { id: "memory", prompt: "Memory", options: [{ dosha: "vata", label: "Learns quickly, forgets quickly" }, { dosha: "pitta", label: "Sharp and accurate" }, { dosha: "kapha", label: "Slow to learn, excellent long-term recall" }] },
  { id: "stress_response", prompt: "Under stress I feel", options: [{ dosha: "vata", label: "Anxious, worried, scattered" }, { dosha: "pitta", label: "Angry, irritable, critical" }, { dosha: "kapha", label: "Withdrawn, quiet, calm" }] },
  { id: "mind", prompt: "Mind", options: [{ dosha: "vata", label: "Creative, imaginative, restless" }, { dosha: "pitta", label: "Intelligent, analytical, decisive" }, { dosha: "kapha", label: "Steady, grounded, thoughtful" }] },
  { id: "sweat", prompt: "Sweat", options: [{ dosha: "vata", label: "Minimal, even in heat" }, { dosha: "pitta", label: "Profuse, often with strong odor" }, { dosha: "kapha", label: "Moderate, pleasant" }] },
  { id: "voice", prompt: "Voice / speech", options: [{ dosha: "vata", label: "Fast, variable, talkative" }, { dosha: "pitta", label: "Sharp, clear, convincing" }, { dosha: "kapha", label: "Deep, slow, melodious" }] },
  { id: "body_temperature", prompt: "Body temperature", options: [{ dosha: "vata", label: "Usually cold — cold hands and feet" }, { dosha: "pitta", label: "Usually warm — seeks cool places" }, { dosha: "kapha", label: "Cool and moist — adapts well" }] },
  { id: "decisions", prompt: "Decision making", options: [{ dosha: "vata", label: "Changes mind often, indecisive" }, { dosha: "pitta", label: "Decisive, quick, firm" }, { dosha: "kapha", label: "Reflective, slow, thorough" }] },
  { id: "money", prompt: "Money habits", options: [{ dosha: "vata", label: "Spends impulsively, on small things" }, { dosha: "pitta", label: "Spends on luxury and quality" }, { dosha: "kapha", label: "Saves carefully, resists spending" }] },
];

function analyzeDosha(age, symptoms = [], lifestyle = "") {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  if (age < 25) scores.kapha += 1;
  else if (age <= 55) scores.pitta += 1;
  else scores.vata += 1;

  for (const s of symptoms) {
    const dosha = SYMPTOM_MAP[s];
    if (dosha) scores[dosha] += 2;
  }

  const lifestyleDosha = LIFESTYLE_MAP[lifestyle];
  if (lifestyleDosha) scores[lifestyleDosha] += 1;

  const order = ["vata", "pitta", "kapha"];
  let dominant = "vata";
  let maxScore = -1;
  for (const d of order) {
    if (scores[d] > maxScore) {
      maxScore = scores[d];
      dominant = d;
    }
  }

  const info = DOSHA_INFO[dominant];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  return { dosha: dominant, dosha_name: info.name, element: info.element, tagline: info.tagline, description: info.description, herbs: info.herbs, lifestyle_advice: info.lifestyle_advice, scores, percentages };
}

function analyzePrakriti(answers = {}, age = 30) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  const validIds = new Set(PRAKRITI_QUESTIONS.map((q) => q.id));

  for (const [qid, dosha] of Object.entries(answers)) {
    if (validIds.has(qid) && scores[dosha] !== undefined) {
      scores[dosha] += 1;
    }
  }

  if (age < 25) scores.kapha += 1;
  else if (age <= 55) scores.pitta += 1;
  else scores.vata += 1;

  const order = ["vata", "pitta", "kapha"];
  let dominant = "vata";
  let maxScore = -1;
  for (const d of order) {
    if (scores[d] > maxScore) {
      maxScore = scores[d];
      dominant = d;
    }
  }

  const info = DOSHA_INFO[dominant];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  return { dosha: dominant, dosha_name: info.name, element: info.element, tagline: info.tagline, description: info.description, herbs: info.herbs, lifestyle_advice: info.lifestyle_advice, scores, percentages };
}

// ---------- API Routes ----------
app.get("/api", (req, res) => {
  res.json({ message: "AyurAI API is running", version: "1.0" });
});

app.get("/api/options", (req, res) => {
  const symptoms = [
    { id: "stress", label: "Stress" },
    { id: "cold", label: "Cold hands/feet" },
    { id: "fatigue", label: "Fatigue" },
    { id: "digestion_issues", label: "Digestion issues" },
    { id: "insomnia", label: "Insomnia" },
    { id: "anxiety", label: "Anxiety" },
    { id: "headaches", label: "Headaches" },
    { id: "skin_issues", label: "Skin issues" },
    { id: "joint_pain", label: "Joint pain" },
    { id: "weight_gain", label: "Weight gain" },
    { id: "congestion", label: "Congestion" },
    { id: "irritability", label: "Irritability" },
  ];
  const lifestyles = [
    { id: "active", label: "Active" },
    { id: "moderate", label: "Moderate" },
    { id: "sedentary", label: "Sedentary" },
  ];
  res.json({ symptoms, lifestyles });
});

app.get("/api/quiz", (req, res) => {
  res.json({ questions: PRAKRITI_QUESTIONS });
});

app.post("/api/analyze", async (req, res) => {
  const { age, symptoms = [], lifestyle } = req.body;
  if (!age || age < 1 || age > 120 || !LIFESTYLE_MAP[lifestyle]) {
    return res.status(400).json({ detail: "Invalid age or lifestyle value" });
  }

  const result = analyzeDosha(age, symptoms, lifestyle);
  const record = {
    id: uuidv4(),
    mode: "quick",
    age,
    symptoms,
    lifestyle,
    ...result,
    created_at: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.collection("analyses").insertOne({ ...record });
    } catch (err) {
      console.error("Error inserting record:", err);
    }
  }
  res.json(record);
});

app.post("/api/quiz/analyze", async (req, res) => {
  const { age = 30, answers = {} } = req.body;
  const result = analyzePrakriti(answers, age);
  const record = {
    id: uuidv4(),
    mode: "quiz",
    age,
    symptoms: Object.keys(answers),
    lifestyle: "quiz",
    ...result,
    created_at: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.collection("analyses").insertOne({ ...record });
    } catch (err) {
      console.error("Error inserting record:", err);
    }
  }
  res.json(record);
});

app.get("/api/history", async (req, res) => {
  if (!db) return res.json([]);
  try {
    const items = await db.collection("analyses").find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(50).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ detail: "Database query error" });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  if (!db) return res.json({ deleted: req.params.id });
  try {
    const result = await db.collection("analyses").deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: "Record not found" });
    }
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ detail: "Database delete error" });
  }
});

// Serve static React build files in production
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AyurAI Node Server running on http://0.0.0.0:${PORT}`);
});
