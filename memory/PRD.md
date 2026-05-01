# AyurAI – Product Requirements Document

## Original Problem Statement
Create "AyurAI – Personalized Ayurvedic Recommendation System" — a web app that takes user input (age, multi-select symptoms, lifestyle) and returns rule-based Ayurvedic dosha recommendations (Vata, Pitta, Kapha) with recommended herbs and lifestyle advice. Must include clean homepage UI, input form, Analyze button, result display, About Ayurveda section, Disclaimer ("not medical advice"), Reset button, and small animations.

## User Choices
- Stack: React + FastAPI + MongoDB (save history)
- Symptoms: expanded list (12 options)
- Design: earthy/Ayurvedic palette (green, beige, terracotta) — "Organic & Earthy" archetype per design_agent

## Architecture
- **Backend** (`/app/backend/server.py`): FastAPI with deterministic rule-engine `analyze_dosha(age, symptoms, lifestyle)`. Routes: `GET /api/`, `GET /api/options`, `POST /api/analyze`, `GET /api/history`, `DELETE /api/history/{id}`. MongoDB collection `analyses`.
- **Frontend** (`/app/frontend/src`): React 19 single-page (`pages/AyurAI.jsx`) composed of `Hero`, `DoshaForm`, `ResultsCard`, `AboutAyurveda`, `History`, `Disclaimer`. Shadcn tokens + Tailwind + lucide-react. Fonts: Cormorant Garamond (display) + Manrope (body).

## Rule Engine
- Age-stage: <25 → Kapha, 25–55 → Pitta, >55 → Vata (+1)
- Symptom: +2 to mapped dosha (Vata=stress/cold/insomnia/anxiety/joint_pain; Pitta=digestion_issues/headaches/skin_issues/irritability; Kapha=fatigue/weight_gain/congestion)
- Lifestyle: active→Pitta, moderate→Vata, sedentary→Kapha (+1)
- Dominant = max(scores); returns dosha-specific herbs (4) and lifestyle advice (5)

## What's Been Implemented (Feb 2026)
- Full homepage with hero, header CTAs, stat strip, organic imagery (Unsplash)
- Dosha Analyzer form: age input, 12 symptom pill toggles, 3 lifestyle segmented tiles
- Analyze → animated bento results card (dominant dosha banner + herbs + numbered lifestyle advice + percentage bars)
- Reset button clears form
- Persisted History section with delete-per-entry
- About Ayurveda (Vata/Pitta/Kapha cards with Lucide icons)
- Disclaimer footer
- Full `data-testid` coverage; earthy palette; grain overlay; fade-up + floaty animations
- Sonner toasts for validation/success

## Testing Status
- Backend: 10/10 pytest passed (rule engine, validation, history sort, delete 404)
- Frontend: Playwright end-to-end passed (form, results, history, delete, reset, disclaimer)

## Backlog / Next Items
- **P1**: "Share my dosha" link → generates shareable result card (great for growth/virality)
- **P1**: Dosha quiz v2 — expand to the classic 20-question Prakriti test
- **P2**: Seasonal recommendations (Ritucharya) based on month
- **P2**: Email the result (Resend integration)
- **P2**: Printable PDF of reading
- **P3**: User accounts so history persists across devices
