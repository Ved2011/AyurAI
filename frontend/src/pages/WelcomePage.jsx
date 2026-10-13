import { useState, useEffect } from "react";
import {
  Sparkles, Clock, Utensils, ArrowRight, Leaf,
  Activity, LogIn, UserPlus, BookOpen, ShieldCheck, ChevronDown
} from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    accent: "#3E6B4A",
    bg: "rgba(62,107,74,0.08)",
    tag: "Constitution",
    title: "Prakriti & Vikriti Evaluation",
    desc: "Differentiates your lifelong genetic baseline (Prakriti) from acute active imbalances (Vikriti) with multi-dosha percentages.",
  },
  {
    icon: Clock,
    accent: "#3E6B4A",
    bg: "rgba(62,107,74,0.08)",
    tag: "Daily Rhythm",
    title: "Dinacharya Daily Planner",
    desc: "Hour-by-hour daily schedules personalized to align your body clock with natural dosha cycles for optimal Agni.",
  },
  {
    icon: Utensils,
    accent: "#C05540",
    bg: "rgba(192,85,64,0.08)",
    tag: "Food Intelligence",
    title: "Viruddha Ahara Checker",
    desc: "Classical rule engine for incompatible food combinations to prevent digestive toxin buildup (Ama).",
  },
];

const DOSHAS = [
  { name: "Vata", elements: "Air & Ether", color: "#C8A96A", desc: "Governs movement, creativity, and flow" },
  { name: "Pitta", elements: "Fire & Water", color: "#C05540", desc: "Governs transformation, digestion, and insight" },
  { name: "Kapha", elements: "Earth & Water", color: "#3E6B4A", desc: "Governs structure, stability, and nourishment" },
];

export default function WelcomePage({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#1E2B21] overflow-x-hidden">

      {/* ── Navigation ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#F8F5EF]/92 backdrop-blur-xl shadow-sm border-b border-[#DFE1DB]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#3E6B4A] flex items-center justify-center text-white shadow-md">
              <Leaf className="w-4.5 h-4.5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-[26px] text-[#1E2B21] leading-none">
              Ayur<span className="italic font-normal text-[#3E6B4A]">AI</span>
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DFE1DB] bg-white hover:border-[#3E6B4A] text-[#1E2B21] text-xs font-semibold transition-all shadow-sm hover:shadow"
            >
              <LogIn className="w-3.5 h-3.5 text-[#3E6B4A]" />
              Log In
            </button>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-px"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Join</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background radial gradient */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(62,107,74,0.11) 0%, transparent 70%)",
          }}
        />

        {/* Decorative floating leaf */}
        <div aria-hidden className="absolute top-16 right-8 md:right-20 opacity-[0.07] floaty pointer-events-none">
          <svg viewBox="0 0 200 200" width="320" height="320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10 C140 10, 190 60, 190 100 C190 140, 140 190, 100 190 C60 190, 10 140, 10 100 C10 60, 60 10, 100 10Z" fill="#3E6B4A"/>
            <path d="M100 30 C100 30, 100 170, 100 170" stroke="#F8F5EF" strokeWidth="2" strokeLinecap="round"/>
            <path d="M100 80 C80 60, 45 75, 40 95" stroke="#F8F5EF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M100 110 C120 90, 155 105, 160 125" stroke="#F8F5EF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M100 60 C80 40, 50 50, 45 70" stroke="#F8F5EF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          {/* Badge */}
          <span className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3E6B4A]/9 border border-[#3E6B4A]/15 text-[#3E6B4A] text-[11px] font-semibold uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3" />
            Classical Ayurvedic Science × Artificial Intelligence
          </span>

          {/* Headline */}
          <h1 className="fade-up-2 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-[#1E2B21] tracking-tight">
            Holistic Ayurvedic<br />
            <span className="italic text-[#3E6B4A]">Diagnostics</span> &amp; Doshic Balance
          </h1>

          {/* Sub */}
          <p className="fade-up-3 mt-6 text-base md:text-lg text-[#5A6960] max-w-2xl mx-auto leading-relaxed">
            An authentic digital wellness suite grounded in classical Ayurvedic literature —
            <em> Charaka Samhita</em> &amp; <em>Sushruta Samhita</em>. Evaluate your innate Prakriti,
            active Vikriti imbalances, digestive fire (<em>Agni</em>), and herbal remedies.
          </p>

          {/* CTAs */}
          <div className="fade-up-4 mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="group px-8 py-4 rounded-full bg-[#1E2B21] hover:bg-[#141d17] text-white font-semibold text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-3"
            >
              <UserPlus className="w-4 h-4 text-[#7DB88A]" />
              Create Profile to Begin
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpenAuth}
              className="px-8 py-4 rounded-full bg-white border border-[#DFE1DB] hover:border-[#3E6B4A] text-[#1E2B21] font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#3E6B4A]" />
              Log In to Existing Account
            </button>
          </div>

          {/* Scroll hint */}
          <div className="fade-up-5 mt-14 flex justify-center">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="flex flex-col items-center gap-1.5 text-[#5A6960] hover:text-[#1E2B21] transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest font-semibold">Explore Features</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 md:px-12 py-16 border-t border-[#DFE1DB]">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#5A6960] font-semibold">Platform Overview</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#1E2B21] mt-2">
            What You Can Explore Inside
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, accent, bg, tag, title, desc }) => (
            <div
              key={title}
              className="group p-8 rounded-3xl bg-white border border-[#DFE1DB] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
                style={{ background: bg, color: accent }}
              >
                <Icon className="w-6 h-6" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-2 block" style={{ color: accent }}>
                {tag}
              </span>
              <h3 className="font-display text-2xl mb-2.5 text-[#1E2B21]">{title}</h3>
              <p className="text-xs text-[#5A6960] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dosha Overview ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 border-t border-[#DFE1DB]">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#5A6960] font-semibold">The Three Doshas</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#1E2B21] mt-2">Tridosha — Your Body's Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DOSHAS.map(({ name, elements, color, desc }) => (
            <div
              key={name}
              className="p-8 rounded-3xl border border-[#DFE1DB] hover:shadow-md transition-all"
              style={{ background: `${color}08` }}
            >
              <div
                className="w-10 h-10 rounded-full mb-5 flex items-center justify-center font-display text-lg text-white shadow-md"
                style={{ background: color }}
              >
                {name[0]}
              </div>
              <h3 className="font-display text-2xl text-[#1E2B21] mb-1">{name}</h3>
              <span className="text-[10px] uppercase tracking-widest font-semibold mb-3 block" style={{ color }}>
                {elements}
              </span>
              <p className="text-xs text-[#5A6960] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark CTA section ── */}
      <section className="bg-[#1A2620] text-white py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#7DB88A] font-semibold">Classical Foundation</span>
          <h2 className="font-display text-3xl md:text-5xl mt-3 mb-5 leading-tight">
            Grounded in Ancient<br />Ayurvedic Medical Texts
          </h2>
          <p className="text-sm opacity-70 max-w-xl mx-auto leading-relaxed mb-10">
            Ayurveda views health as dynamic equilibrium between Vata (Air/Ether), Pitta (Fire/Water), and Kapha (Earth/Water).
            AyurAI translates classical diagnostic models into personalized digital wellness intelligence.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: ShieldCheck, text: "Charaka Samhita Standards" },
              { icon: BookOpen, text: "Sushruta Samhita Methods" },
              { icon: Sparkles, text: "AI-Assisted Analysis" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-xs text-white/70">
                <Icon className="w-3.5 h-3.5 text-[#7DB88A]" />
                {text}
              </div>
            ))}
          </div>

          <button
            onClick={onOpenAuth}
            className="group px-10 py-4 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] text-white text-sm font-semibold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-3 mx-auto"
          >
            Create Your Profile Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#DFE1DB] py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6960]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#3E6B4A] flex items-center justify-center text-white">
              <Leaf className="w-3 h-3" />
            </span>
            <span className="font-display text-base text-[#1E2B21]">
              Ayur<span className="italic text-[#3E6B4A]">AI</span>
            </span>
          </div>
          <span className="opacity-60">For educational purposes only — not medical advice.</span>
        </div>
      </footer>
    </div>
  );
}
