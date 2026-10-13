const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : "*" }));
app.use(express.json());

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
  {
    id: "body_frame",
    prompt: "Body frame",
    options: [
      { dosha: "vata", label: "Thin, lean, hard to gain weight" },
      { dosha: "pitta", label: "Medium, muscular, well-proportioned" },
      { dosha: "kapha", label: "Large, sturdy, gains weight easily" },
    ],
  },
  {
    id: "weight_pattern",
    prompt: "Weight pattern",
    options: [
      { dosha: "vata", label: "Light — fluctuates easily" },
      { dosha: "pitta", label: "Moderate — stable with effort" },
      { dosha: "kapha", label: "Heavy — gains quickly, loses slowly" },
    ],
  },
  {
    id: "skin",
    prompt: "Skin",
    options: [
      { dosha: "vata", label: "Dry, rough, cool, thin" },
      { dosha: "pitta", label: "Warm, reddish, sensitive, freckles/moles" },
      { dosha: "kapha", label: "Soft, oily, thick, pale, smooth" },
    ],
  },
  {
    id: "hair",
    prompt: "Hair",
    options: [
      { dosha: "vata", label: "Dry, frizzy, brittle, thin" },
      { dosha: "pitta", label: "Fine, soft, early graying or balding" },
      { dosha: "kapha", label: "Thick, oily, wavy, lustrous" },
    ],
  },
  {
    id: "eyes",
    prompt: "Eyes",
    options: [
      { dosha: "vata", label: "Small, dry, active, dark" },
      { dosha: "pitta", label: "Medium, sharp, penetrating" },
      { dosha: "kapha", label: "Large, calm, moist, attractive" },
    ],
  },
  {
    id: "teeth",
    prompt: "Teeth",
    options: [
      { dosha: "vata", label: "Uneven, gums recede, often sensitive" },
      { dosha: "pitta", label: "Medium-sized, yellowish, prone to bleeding gums" },
      { dosha: "kapha", label: "Large, white, strong, well-formed" },
    ],
  },
  {
    id: "appetite",
    prompt: "Appetite",
    options: [
      { dosha: "vata", label: "Irregular — sometimes hungry, sometimes not" },
      { dosha: "pitta", label: "Strong — intense hunger, gets irritable if skipped" },
      { dosha: "kapha", label: "Slow but steady — can easily skip meals" },
    ],
  },
  {
    id: "thirst",
    prompt: "Thirst",
    options: [
      { dosha: "vata", label: "Variable" },
      { dosha: "pitta", label: "High — always reaching for water" },
      { dosha: "kapha", label: "Low — rarely thirsty" },
    ],
  },
  {
    id: "digestion",
    prompt: "Digestion",
    options: [
      { dosha: "vata", label: "Irregular, gas, bloating" },
      { dosha: "pitta", label: "Strong, quick, occasional heartburn" },
      { dosha: "kapha", label: "Slow, heavy after meals" },
    ],
  },
  {
    id: "sleep",
    prompt: "Sleep",
    options: [
      { dosha: "vata", label: "Light, interrupted, 5–6 hours" },
      { dosha: "pitta", label: "Moderate, sound, 6–8 hours" },
      { dosha: "kapha", label: "Deep, heavy, 8+ hours, hard to wake" },
    ],
  },
  {
    id: "energy",
    prompt: "Energy pattern",
    options: [
      { dosha: "vata", label: "Bursts of energy then fatigue" },
      { dosha: "pitta", label: "Moderate, focused, goal-driven" },
      { dosha: "kapha", label: "Steady, strong, enduring" },
    ],
  },
  {
    id: "speed",
    prompt: "Speed of action",
    options: [
      { dosha: "vata", label: "Fast, restless, hurried" },
      { dosha: "pitta", label: "Medium, purposeful, sharp" },
      { dosha: "kapha", label: "Slow, methodical, graceful" },
    ],
  },
  {
    id: "memory",
    prompt: "Memory",
    options: [
      { dosha: "vata", label: "Learns quickly, forgets quickly" },
      { dosha: "pitta", label: "Sharp and accurate" },
      { dosha: "kapha", label: "Slow to learn, excellent long-term recall" },
    ],
  },
  {
    id: "stress_response",
    prompt: "Under stress I feel",
    options: [
      { dosha: "vata", label: "Anxious, worried, scattered" },
      { dosha: "pitta", label: "Angry, irritable, critical" },
      { dosha: "kapha", label: "Withdrawn, quiet, calm" },
    ],
  },
  {
    id: "mind",
    prompt: "Mind",
    options: [
      { dosha: "vata", label: "Creative, imaginative, restless" },
      { dosha: "pitta", label: "Intelligent, analytical, decisive" },
      { dosha: "kapha", label: "Steady, grounded, thoughtful" },
    ],
  },
  {
    id: "sweat",
    prompt: "Sweat",
    options: [
      { dosha: "vata", label: "Minimal, even in heat" },
      { dosha: "pitta", label: "Profuse, often with strong odor" },
      { dosha: "kapha", label: "Moderate, pleasant" },
    ],
  },
  {
    id: "voice",
    prompt: "Voice / speech",
    options: [
      { dosha: "vata", label: "Fast, variable, talkative" },
      { dosha: "pitta", label: "Sharp, clear, convincing" },
      { dosha: "kapha", label: "Deep, slow, melodious" },
    ],
  },
  {
    id: "body_temperature",
    prompt: "Body temperature",
    options: [
      { dosha: "vata", label: "Usually cold — cold hands and feet" },
      { dosha: "pitta", label: "Usually warm — seeks cool places" },
      { dosha: "kapha", label: "Cool and moist — adapts well" },
    ],
  },
  {
    id: "decisions",
    prompt: "Decision making",
    options: [
      { dosha: "vata", label: "Changes mind often, indecisive" },
      { dosha: "pitta", label: "Decisive, quick, firm" },
      { dosha: "kapha", label: "Reflective, slow, thorough" },
    ],
  },
  {
    id: "money",
    prompt: "Money habits",
    options: [
      { dosha: "vata", label: "Spends impulsively, on small things" },
      { dosha: "pitta", label: "Spends on luxury and quality" },
      { dosha: "kapha", label: "Saves carefully, resists spending" },
    ],
  },
];

const PRAKRITI_IDS = new Set(PRAKRITI_QUESTIONS.map((q) => q.id));

function getDominantDosha(scores) {
  const doshaOrder = ["vata", "pitta", "kapha"];
  let dominant = "vata";
  let maxScore = -1;
  for (const d of doshaOrder) {
    if (scores[d] > maxScore) {
      maxScore = scores[d];
      dominant = d;
    }
  }
  return dominant;
}

function analyzeDosha(age, symptoms = [], lifestyle = "moderate") {
  const scores = { vata: 0, pitta: 0, kapha: 0 };

  // Age-stage contribution
  if (age < 25) {
    scores.kapha += 1;
  } else if (age <= 55) {
    scores.pitta += 1;
  } else {
    scores.vata += 1;
  }

  // Symptom contribution (2 points each)
  for (const s of symptoms) {
    const dosha = SYMPTOM_MAP[s];
    if (dosha) scores[dosha] += 2;
  }

  // Lifestyle contribution
  const lifestyleDosha = LIFESTYLE_MAP[lifestyle];
  if (lifestyleDosha) {
    scores[lifestyleDosha] += 1;
  }

  const dominant = getDominantDosha(scores);
  const info = DOSHA_INFO[dominant];
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  return {
    dosha: dominant,
    dosha_name: info.name,
    element: info.element,
    tagline: info.tagline,
    description: info.description,
    herbs: info.herbs,
    lifestyle_advice: info.lifestyle_advice,
    scores,
    percentages,
  };
}

function analyzePrakriti(answers = {}, age = 30) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  for (const [qid, dosha] of Object.entries(answers)) {
    if (PRAKRITI_IDS.has(qid) && scores[dosha] !== undefined) {
      scores[dosha] += 1;
    }
  }

  if (age < 25) {
    scores.kapha += 1;
  } else if (age <= 55) {
    scores.pitta += 1;
  } else {
    scores.vata += 1;
  }

  const dominant = getDominantDosha(scores);
  const info = DOSHA_INFO[dominant];
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  return {
    dosha: dominant,
    dosha_name: info.name,
    element: info.element,
    tagline: info.tagline,
    description: info.description,
    herbs: info.herbs,
    lifestyle_advice: info.lifestyle_advice,
    scores,
    percentages,
  };
}

// In-memory analysis storage
let analyses = [];

// ---------- API Router ----------
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "AyurAI API is running", version: "1.0" });
});

apiRouter.get("/options", (req, res) => {
  res.json({
    symptoms: [
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
    ],
    lifestyles: [
      { id: "active", label: "Active" },
      { id: "moderate", label: "Moderate" },
      { id: "sedentary", label: "Sedentary" },
    ],
  });
});

apiRouter.post("/analyze", (req, res) => {
  const { age, symptoms = [], lifestyle } = req.body || {};
  const numAge = Number(age);

  if (isNaN(numAge) || numAge < 1 || numAge > 120) {
    return res.status(400).json({ detail: "Age must be between 1 and 120" });
  }

  if (!lifestyle || !LIFESTYLE_MAP[lifestyle]) {
    return res.status(400).json({ detail: "Invalid lifestyle value" });
  }

  const result = analyzeDosha(numAge, symptoms, lifestyle);
  const record = {
    id: crypto.randomUUID(),
    mode: "quick",
    age: numAge,
    symptoms: Array.isArray(symptoms) ? symptoms : [],
    lifestyle,
    ...result,
    created_at: new Date().toISOString(),
  };

  analyses.unshift(record);
  if (analyses.length > 50) analyses.pop();

  res.json(record);
});

apiRouter.get("/history", (req, res) => {
  res.json(analyses.slice(0, 50));
});

apiRouter.delete("/history/:record_id", (req, res) => {
  const { record_id } = req.params;
  const initialLen = analyses.length;
  analyses = analyses.filter((item) => item.id !== record_id);
  if (analyses.length === initialLen) {
    return res.status(404).json({ detail: "Record not found" });
  }
  res.json({ deleted: record_id });
});

apiRouter.get("/quiz", (req, res) => {
  res.json({
    questions: PRAKRITI_QUESTIONS.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options.map((opt) => ({ dosha: opt.dosha, label: opt.label })),
    })),
  });
});

apiRouter.post("/quiz/analyze", (req, res) => {
  const { answers = {}, age = 30 } = req.body || {};
  const numAge = Number(age);

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ detail: "Invalid or incomplete answers" });
  }

  for (const [qid, dosha] of Object.entries(answers)) {
    if (!PRAKRITI_IDS.has(qid)) {
      return res.status(400).json({ detail: `Invalid question id: ${qid}` });
    }
    if (!["vata", "pitta", "kapha"].includes(dosha)) {
      return res.status(400).json({ detail: `Invalid dosha value: ${dosha}` });
    }
  }

  const result = analyzePrakriti(answers, isNaN(numAge) ? 30 : numAge);
  const record = {
    id: crypto.randomUUID(),
    mode: "quiz",
    age: isNaN(numAge) ? 30 : numAge,
    symptoms: Object.keys(answers),
    lifestyle: "quiz",
    ...result,
    created_at: new Date().toISOString(),
  };

  analyses.unshift(record);
  if (analyses.length > 50) analyses.pop();

  res.json(record);
});

app.use("/api", apiRouter);

// ---------- Static Frontend Hosting & SPA Fallback ----------
const buildPath = path.join(__dirname, "frontend", "build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>AyurAI - Setup</title></head>
        <body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; background: #0f172a; color: #f8fafc;">
          <h2>AyurAI Backend is running on port ${PORT}!</h2>
          <p>Frontend production build was not found at <code>frontend/build</code>.</p>
          <p>Run <code>cd frontend && npm run build</code> to compile the frontend, then restart or refresh.</p>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AyurAI unified server running on http://0.0.0.0:${PORT}`);
});
