const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "ayurai_secret_jwt_key_2026";

app.use(cors());
app.use(express.json());

// ---------- PostgreSQL Connection & Table Auto-Creation ----------
const pgPool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Hello@123",
  database: process.env.PGDATABASE || "ayurai",
});

let pgConnected = false;

// Initialize PostgreSQL Database & Create Tables
async function initPgDatabase() {
  try {
    const client = await pgPool.connect();
    pgConnected = true;
    console.log(`Connected to PostgreSQL Database: ${process.env.PGDATABASE || "ayurai"}`);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create analyses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        mode VARCHAR(32),
        age INT,
        dosha VARCHAR(32),
        profile_key VARCHAR(64),
        dosha_name VARCHAR(64),
        element VARCHAR(255),
        tagline TEXT,
        description TEXT,
        data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
  } catch (err) {
    console.warn("PostgreSQL connection error (falling back to Mongo/in-memory):", err.message);
    pgConnected = false;
  }
}

initPgDatabase();

// Legacy MongoDB fallback connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "ayurai";
let db;

MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB:", dbName);
  })
  .catch((err) => {
    // Silent fail if PostgreSQL is active
  });

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
};

app.use(authenticateToken);

// ---------- Classical Ayurvedic Knowledge Base ----------
const DOSHA_INFO = {
  vata: {
    name: "Vata",
    element: "Air & Ether (Vayu & Akasha)",
    subdoshas: ["Prana Vata", "Udana Vata", "Samana Vata", "Vyana Vata", "Apana Vata"],
    tagline: "The principle of movement, communication & enthusiasm.",
    description:
      "Vata governs all bodily movements, breathing, nerve impulses, and circulation. When balanced, it promotes creativity, agility, and joy. When imbalanced, it manifests as dryness, anxiety, bloating, insomnia, and erratic energy.",
    herbs: [
      { name: "Ashwagandha", benefit: "Calms the nervous system & builds Ojas (vitality)" },
      { name: "Brahmi (Gotu Kola)", benefit: "Soothes mental restlessness & enhances focus" },
      { name: "Triphala", benefit: "Gentle digestive elimination without irritating dryness" },
      { name: "Yashtimadhu (Licorice)", benefit: "Lubricates dry tissues & supports adrenal health" },
      { name: "Shatavari", benefit: "Nourishes reproductive tissues & grounds Vata heat" },
    ],
    lifestyle_advice: [
      "Follow a consistent daily rhythm (Dinacharya) — fixed meal times and sleep by 10 PM.",
      "Prioritize warm, cooked, grounding foods with healthy fats (ghee, sesame oil). Avoid cold, raw salads.",
      "Practice daily 15-minute warm sesame oil self-massage (Abhyanga) before bathing.",
      "Sip warm ginger, cinnamon, or cardamom tea throughout the day; limit caffeine.",
      "Engage in gentle, slow-paced yoga, grounding pranayama (Nadi Shodhana), and warm baths.",
    ],
  },
  pitta: {
    name: "Pitta",
    element: "Fire & Water (Agni & Jala)",
    subdoshas: ["Pachaka Pitta", "Ranjaka Pitta", "Sadhaka Pitta", "Alochaka Pitta", "Bhrajaka Pitta"],
    tagline: "The principle of transformation, metabolism & intelligence.",
    description:
      "Pitta governs digestion, body temperature, liver metabolism, visual perception, and intellect. When balanced, it yields sharp focus, courage, and clear digestion. When imbalanced, it causes acid reflux, skin inflammation, irritability, and overheating.",
    herbs: [
      { name: "Amalaki (Amla)", benefit: "Potent cooling antioxidant; cleanses liver & pacifies Pitta" },
      { name: "Shatavari", benefit: "Cools internal heat & protects stomach mucosal lining" },
      { name: "Neem", benefit: "Purifies blood & clears inflammatory skin flare-ups" },
      { name: "Dhanyaka (Coriander)", benefit: "Gently cools digestive fire without quenching Agni" },
      { name: "Guduchi (Giloy)", benefit: "Rebalances immunity & relieves chronic heat" },
    ],
    lifestyle_advice: [
      "Enjoy cooling, fresh foods like cucumber, coconut water, sweet juicy fruits, and leafy greens.",
      "Strictly avoid excessively spicy, pungent, fermented, fried, or over-salted meals.",
      "Exercise during cooler morning or evening hours; avoid intense sun exposure between 10 AM - 2 PM.",
      "Incorporate calming moonlight walks, relaxing music, and non-competitive recreation.",
      "Practice cooling Sheetali/Sheetkari pranayama for 5-10 minutes daily.",
    ],
  },
  kapha: {
    name: "Kapha",
    element: "Earth & Water (Prithvi & Jala)",
    subdoshas: ["Kledaka Kapha", "Avalambaka Kapha", "Bodhaka Kapha", "Tarpaka Kapha", "Sleshaka Kapha"],
    tagline: "The principle of structure, stamina, immunity & cohesion.",
    description:
      "Kapha governs physical structure, joint lubrication, fluid balance, and emotional stability. When balanced, it endows deep stamina, calm compassion, and strong immunity. When imbalanced, it leads to lethargy, weight gain, sinus congestion, and attachment.",
    herbs: [
      { name: "Trikatu (Ginger, Black Pepper, Pippali)", benefit: "Ignites digestive Agni & burns sluggish Ama" },
      { name: "Tulsi (Holy Basil)", benefit: "Clears respiratory congestion & uplifts mood" },
      { name: "Guggulu", benefit: "Promotes healthy lipid metabolism & joint mobility" },
      { name: "Punarnava", benefit: "Supports fluid balance & eliminates excess water retention" },
      { name: "Vacha (Sweet Flag)", benefit: "Clears mental sluggishness & sharpens expression" },
    ],
    lifestyle_advice: [
      "Wake up early (by 6 AM) and engage in vigorous daily exercise (sun salutations, running).",
      "Favor warm, light, spicy, bitter, and astringent foods; minimize dairy, heavy oils, and sweets.",
      "Practice dry body brushing (Garshana) before bathing to stimulate lymphatic drainage.",
      "Sip warm water or spicy herbal teas (ginger, black pepper, cinnamon) throughout the day.",
      "Avoid daytime napping and maintain an active, stimulating routine.",
    ],
  },
};

const SYMPTOM_MAP = {
  stress: { dosha: "vata", weight: 3 },
  cold: { dosha: "vata", weight: 2 },
  fatigue: { dosha: "kapha", weight: 2 },
  digestion_issues: { dosha: "pitta", weight: 3 },
  insomnia: { dosha: "vata", weight: 3 },
  anxiety: { dosha: "vata", weight: 3 },
  headaches: { dosha: "pitta", weight: 2 },
  skin_issues: { dosha: "pitta", weight: 3 },
  joint_pain: { dosha: "vata", weight: 2 },
  weight_gain: { dosha: "kapha", weight: 3 },
  congestion: { dosha: "kapha", weight: 3 },
  irritability: { dosha: "pitta", weight: 2 },
};

const LIFESTYLE_MAP = {
  active: "pitta",
  moderate: "vata",
  sedentary: "kapha",
};

const PRAKRITI_QUESTIONS = [
  { id: "body_frame", prompt: "Body Frame & Bone Structure", options: [{ dosha: "vata", label: "Slender, narrow shoulders/hips, prominent joints" }, { dosha: "pitta", label: "Medium build, muscular, athletic proportion" }, { dosha: "kapha", label: "Broad chest, sturdy frame, large boned" }] },
  { id: "weight_pattern", prompt: "Lifelong Weight Tendency", options: [{ dosha: "vata", label: "Hard to gain weight; remains lean easily" }, { dosha: "pitta", label: "Gains or loses easily with conscious effort" }, { dosha: "kapha", label: "Gains weight easily, very hard to lose" }] },
  { id: "skin", prompt: "Skin Texture & Temperature", options: [{ dosha: "vata", label: "Dry, cool to touch, thin, prone to chapping" }, { dosha: "pitta", label: "Warm, sensitive, prone to redness/freckles" }, { dosha: "kapha", label: "Smooth, soft, moist, thick, pale" }] },
  { id: "hair", prompt: "Hair Type & Quality", options: [{ dosha: "vata", label: "Dry, frizzy, brittle, coarse" }, { dosha: "pitta", label: "Fine, soft, early graying or thinning" }, { dosha: "kapha", label: "Thick, lustrous, wavy, strong roots" }] },
  { id: "eyes", prompt: "Eyes & Gaze", options: [{ dosha: "vata", label: "Small, active, dark, dry lids" }, { dosha: "pitta", label: "Medium, sharp, bright, sensitive to light" }, { dosha: "kapha", label: "Large, serene, clear whites, long lashes" }] },
  { id: "appetite", prompt: "Appetite & Hunger Pattern (Agni)", options: [{ dosha: "vata", label: "Irregular — sometimes starving, sometimes skip effortlessly" }, { dosha: "pitta", label: "Sharp & intense — irritable if meals are delayed" }, { dosha: "kapha", label: "Steady but low — can comfortably skip meals" }] },
  { id: "digestion", prompt: "Elimination & Bowel Tendencies (Koshtha)", options: [{ dosha: "vata", label: "Dry, hard stools, tendency towards constipation/gas" }, { dosha: "pitta", label: "Loose or frequent stools, yellow, occasional burning" }, { dosha: "kapha", label: "Heavy, sluggish, regular, well-formed stools" }] },
  { id: "sleep", prompt: "Sleep Depth & Duration", options: [{ dosha: "vata", label: "Light, easily awakened, 5-6 hours, restless" }, { dosha: "pitta", label: "Moderate, sound, 6-7 hours, can wake up quickly" }, { dosha: "kapha", label: "Deep, heavy, 8+ hours, difficulty waking up" }] },
  { id: "energy", prompt: "Energy & Endurance Pattern", options: [{ dosha: "vata", label: "Quick bursts of energy, fatigues suddenly" }, { dosha: "pitta", label: "Strong, goal-driven stamina, high intensity" }, { dosha: "kapha", label: "Slow start, but immense long-lasting endurance" }] },
  { id: "stress_response", prompt: "Emotional Stress Reaction", options: [{ dosha: "vata", label: "Anxiety, fear, worry, mind racing" }, { dosha: "pitta", label: "Anger, impatience, frustration, criticism" }, { dosha: "kapha", label: "Stubbornness, withdrawal, calm resistance" }] },
  { id: "mind", prompt: "Learning & Memory Style", options: [{ dosha: "vata", label: "Grasps quickly, forgets quickly" }, { dosha: "pitta", label: "Sharp comprehension, clear recall" }, { dosha: "kapha", label: "Slow to learn, never forgets (retentive)" }] },
  { id: "climate", prompt: "Weather Preference", options: [{ dosha: "vata", label: "Dislikes cold, wind & dryness; loves warmth" }, { dosha: "pitta", label: "Dislikes heat, humidity & bright sun; loves shade" }, { dosha: "kapha", label: "Dislikes cold & damp; thrives in warm dry weather" }] }
];

function calculateAyurvedicProfile(age, symptoms = [], lifestyle = "", quizAnswers = {}) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };

  for (const [qid, dosha] of Object.entries(quizAnswers)) {
    if (scores[dosha] !== undefined) scores[dosha] += 3;
  }
  for (const s of symptoms) {
    const item = SYMPTOM_MAP[s];
    if (item && scores[item.dosha] !== undefined) scores[item.dosha] += item.weight;
  }
  const lifestyleDosha = LIFESTYLE_MAP[lifestyle];
  if (lifestyleDosha && scores[lifestyleDosha] !== undefined) scores[lifestyleDosha] += 2;

  if (age < 20) scores.kapha += 2;
  else if (age <= 55) scores.pitta += 2;
  else scores.vata += 2;

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const primary = sorted[0];
  const secondary = sorted[1];

  let profileKey = primary;
  if (percentages[primary] - percentages[secondary] <= 12) {
    const dualPair = [primary, secondary].sort().join("-");
    if (DOSHA_INFO[dualPair]) profileKey = dualPair;
  }

  const info = DOSHA_INFO[profileKey] || DOSHA_INFO[primary];

  let agniType = "Sama Agni (Balanced)";
  let agniDesc = "Balanced metabolic fire ensuring optimal assimilation and energy.";
  if (scores.vata > scores.pitta && scores.vata > scores.kapha) {
    agniType = "Vishama Agni (Erratic)";
    agniDesc = "Variable digestive strength leading to gas, bloating, and irregular appetite.";
  } else if (scores.pitta > scores.vata && scores.pitta > scores.kapha) {
    agniType = "Tikshna Agni (Hyper-active)";
    agniDesc = "Intense, rapid digestion prone to hyperacidity, burning, and loose bowel movements.";
  } else if (scores.kapha > scores.vata && scores.kapha > scores.pitta) {
    agniType = "Manda Agni (Sluggish)";
    agniDesc = "Slow digestion causing heaviness, coated tongue, and fatigue after meals.";
  }

  return {
    dosha: primary,
    profile_key: profileKey,
    dosha_name: info.name,
    element: info.element,
    subdoshas: info.subdoshas || [],
    tagline: info.tagline,
    description: info.description,
    herbs: info.herbs,
    lifestyle_advice: info.lifestyle_advice,
    agni: { type: agniType, description: agniDesc },
    scores,
    percentages,
  };
}

// In-memory OTP store: { email: { otp: "123456", name, hashedPassword, expiresAt: timestamp } }
const pendingRegistrations = new Map();

// Configure nodemailer SMTP transporter
let transporter;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
} else {
  nodemailer.createTestAccount().then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }).catch(() => {});
}

const sendOtpEmail = async (email, otp) => {
  const fromEmail = process.env.SMTP_FROM || "'AyurAI Verification' <donotreply.ayurai@gmail.com>";
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: `${otp} is your AyurAI Email Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
        <h2 style="color: #3E6B4A; text-align: center;">AyurAI Verification Code</h2>
        <p style="font-size: 14px; color: #4a4a4a;">Namaste,</p>
        <p style="font-size: 14px; color: #4a4a4a;">Thank you for registering with AyurAI. Please use the following 6-digit OTP to verify your email address:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1E2B21; background: #F0F7F2; padding: 12px 24px; border-radius: 8px; border: 1px solid #3E6B4A;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #888; text-align: center;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Verification OTP email sent to ${email}`);
    } catch (err) {
      console.error(`[EMAIL SERVICE] Error sending email:`, err.message);
    }
  }
};

const fallbackUsers = [];

// ---------- PostgreSQL / DB User Helpers ----------
async function findUserByEmail(email) {
  const cleanEmail = email.toLowerCase();
  if (pgConnected) {
    const res = await pgPool.query("SELECT * FROM users WHERE email = $1", [cleanEmail]);
    return res.rows[0] || null;
  }
  if (db) {
    return await db.collection("users").findOne({ email: cleanEmail });
  }
  return fallbackUsers.find((u) => u.email === cleanEmail) || null;
}

async function createUser(newUser) {
  if (pgConnected) {
    await pgPool.query(
      "INSERT INTO users (id, name, email, password, verified, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.verified || true, newUser.created_at]
    );
    return newUser;
  }
  if (db) {
    await db.collection("users").insertOne(newUser);
    return newUser;
  }
  fallbackUsers.push(newUser);
  return newUser;
}

// ---------- Auth Routes ----------
app.post("/api/auth/send-otp", async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ detail: "Name, email, and password are required" });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ detail: "Email is already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    pendingRegistrations.set(email.toLowerCase(), {
      otp,
      name,
      hashedPassword,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "Verification OTP sent to email", email: email.toLowerCase() });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ detail: "Failed to send verification OTP" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ detail: "Email and OTP are required" });
  }

  const pending = pendingRegistrations.get(email.toLowerCase());
  if (!pending) {
    return res.status(400).json({ detail: "No pending registration found for this email. Please request a new code." });
  }

  if (Date.now() > pending.expiresAt) {
    pendingRegistrations.delete(email.toLowerCase());
    return res.status(400).json({ detail: "OTP has expired. Please request a new verification code." });
  }

  if (pending.otp !== otp.trim()) {
    return res.status(400).json({ detail: "Invalid OTP code. Please check and try again." });
  }

  try {
    const userId = uuidv4();
    const newUser = {
      id: userId,
      name: pending.name,
      email: email.toLowerCase(),
      password: pending.hashedPassword,
      verified: true,
      created_at: new Date().toISOString(),
    };

    await createUser(newUser);
    pendingRegistrations.delete(email.toLowerCase());

    const token = jwt.sign({ id: userId, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token, user: { id: userId, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error("Error creating user after OTP:", err);
    res.status(500).json({ detail: "Failed to complete registration" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, otp } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ detail: "Name, email, and password required" });
  }

  if (!otp) {
    return res.status(400).json({ detail: "OTP verification required for registration" });
  }

  try {
    const pending = pendingRegistrations.get(email.toLowerCase());
    if (!pending || pending.otp !== otp.trim()) {
      return res.status(400).json({ detail: "Invalid or expired OTP code" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ detail: "Email already registered" });
    }

    const userId = uuidv4();
    const newUser = { id: userId, name, email: email.toLowerCase(), password: pending.hashedPassword, verified: true, created_at: new Date().toISOString() };

    await createUser(newUser);
    pendingRegistrations.delete(email.toLowerCase());

    const token = jwt.sign({ id: userId, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token, user: { id: userId, name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ detail: "Server error during registration" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: "Email and password required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ detail: "Server error during login" });
  }
});

app.get("/api/auth/me", (req, res) => {
  if (!req.user) return res.status(401).json({ detail: "Not authenticated" });
  res.json({ user: req.user });
});

// ---------- Main API Routes ----------
app.get("/api", (req, res) => {
  res.json({ message: "AyurAI Classical Engine API is running", version: "2.0" });
});

app.get("/api/options", (req, res) => {
  const symptoms = [
    { id: "stress", label: "Stress & Nervous Tension" },
    { id: "cold", label: "Cold Extremities (Hands/Feet)" },
    { id: "fatigue", label: "Chronic Fatigue & Heaviness" },
    { id: "digestion_issues", label: "Acid Reflux / Heartburn" },
    { id: "insomnia", label: "Light / Interrupted Sleep" },
    { id: "anxiety", label: "Anxiety & Racing Mind" },
    { id: "headaches", label: "Frequent Headaches / Migraines" },
    { id: "skin_issues", label: "Skin Inflammation / Rashes" },
    { id: "joint_pain", label: "Joint Stiffness & Cracking" },
    { id: "weight_gain", label: "Water Retention & Sluggish Weight" },
    { id: "congestion", label: "Sinus / Respiratory Congestion" },
    { id: "irritability", label: "Short Temper & Irritability" },
  ];
  const lifestyles = [
    { id: "active", label: "Active", desc: "High movement, regular sports or manual effort" },
    { id: "moderate", label: "Moderate", desc: "Balanced desk work with light evening walks" },
    { id: "sedentary", label: "Sedentary", desc: "Prolonged sitting, minimal daily physical movement" },
  ];
  res.json({ symptoms, lifestyles });
});

app.get("/api/quiz", (req, res) => {
  res.json({ questions: PRAKRITI_QUESTIONS });
});

async function saveAnalysisRecord(record) {
  if (pgConnected) {
    await pgPool.query(
      "INSERT INTO analyses (id, user_id, mode, age, dosha, profile_key, dosha_name, element, tagline, description, data, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      [
        record.id,
        record.user_id,
        record.mode,
        record.age,
        record.dosha,
        record.profile_key,
        record.dosha_name,
        record.element,
        record.tagline,
        record.description,
        JSON.stringify(record),
        record.created_at,
      ]
    );
  } else if (db) {
    await db.collection("analyses").insertOne({ ...record });
  }
}

app.post("/api/analyze", async (req, res) => {
  const { age, symptoms = [], lifestyle } = req.body;
  if (!age || age < 1 || age > 120 || !LIFESTYLE_MAP[lifestyle]) {
    return res.status(400).json({ detail: "Invalid age or lifestyle input" });
  }

  const result = calculateAyurvedicProfile(age, symptoms, lifestyle);
  const record = {
    id: uuidv4(),
    user_id: req.user ? req.user.id : null,
    mode: "quick",
    age,
    symptoms,
    lifestyle,
    ...result,
    created_at: new Date().toISOString(),
  };

  try {
    await saveAnalysisRecord(record);
  } catch (err) {
    console.error("Error inserting analysis:", err.message);
  }

  res.json(record);
});

app.post("/api/quiz/analyze", async (req, res) => {
  const { age = 30, answers = {} } = req.body;
  const result = calculateAyurvedicProfile(age, [], "moderate", answers);

  const record = {
    id: uuidv4(),
    user_id: req.user ? req.user.id : null,
    mode: "quiz",
    age,
    symptoms: Object.keys(answers),
    lifestyle: "quiz",
    ...result,
    created_at: new Date().toISOString(),
  };

  try {
    await saveAnalysisRecord(record);
  } catch (err) {
    console.error("Error inserting quiz analysis:", err.message);
  }

  res.json(record);
});

app.get("/api/history", async (req, res) => {
  try {
    if (pgConnected) {
      let queryText = "SELECT data FROM analyses ORDER BY created_at DESC LIMIT 50";
      let queryParams = [];
      if (req.user) {
        queryText = "SELECT data FROM analyses WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at DESC LIMIT 50";
        queryParams = [req.user.id];
      }
      const result = await pgPool.query(queryText, queryParams);
      return res.json(result.rows.map((row) => row.data));
    }
    if (db) {
      const query = req.user ? { $or: [{ user_id: req.user.id }, { user_id: null }] } : {};
      const items = await db.collection("analyses").find(query, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(50).toArray();
      return res.json(items);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ detail: "Database query error" });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  try {
    if (pgConnected) {
      await pgPool.query("DELETE FROM analyses WHERE id = $1", [req.params.id]);
      return res.json({ deleted: req.params.id });
    }
    if (db) {
      await db.collection("analyses").deleteOne({ id: req.params.id });
      return res.json({ deleted: req.params.id });
    }
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ detail: "Database delete error" });
  }
});

// ---------- Feature 11: Incompatible Food (Viruddha Ahara) Checker ----------
app.post("/api/viruddha-check", (req, res) => {
  const { foodA = "", foodB = "" } = req.body;
  const pairs = [
    { a: "milk", b: "fish", reason: "Opposing thermal energies — milk is cooling, fish is heating. Creates toxic Ama in blood." },
    { a: "milk", b: "banana", reason: "Changes intestinal flora, produces toxins and causes cold/cough congestion." },
    { a: "honey", b: "hot water", reason: "Heating honey alters its molecular structure, making it sticky and toxic (Ama) to channels." },
    { a: "milk", b: "citrus", reason: "Acidic fruits curdle milk in stomach, halting digestive enzymes." },
    { a: "ghee", b: "honey", reason: "Equal parts ghee and honey create incompatible metabolic reaction." },
  ];

  const fa = foodA.toLowerCase().trim();
  const fb = foodB.toLowerCase().trim();

  const found = pairs.find(
    (p) => (fa.includes(p.a) && fb.includes(p.b)) || (fa.includes(p.b) && fb.includes(p.a))
  );

  if (found) {
    res.json({ compatible: false, warning: `Viruddha Ahara Incompatibility! ${found.reason}` });
  } else {
    res.json({ compatible: true, message: "These foods are generally compatible under classical Ayurvedic rules." });
  }
});

// ---------- Serve Frontend Static Files & React SPA Fallback ----------
const reactBuildPath = path.join(__dirname, "../frontend/build");
const publicPath = path.join(__dirname, "public");

const fs = require("fs");
if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
  });
} else {
  app.use(express.static(publicPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`AyurAI Unified Node Engine running on http://0.0.0.0:${PORT}`);
});
