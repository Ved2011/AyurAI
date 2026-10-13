import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import {
  Sparkles, Clock, Utensils, History,
  ArrowRight, Activity, TrendingUp, CalendarDays,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

const QUICK_LINKS = [
  {
    to: "/analyze",
    accent: "#1A2620",
    textAccent: "#7DB88A",
    tag: "Full Diagnostic",
    title: "Start Prakriti Quiz",
    desc: "20 classical questions for in-depth constitutional breakdown.",
    icon: Sparkles,
    dark: true,
  },
  {
    to: "/food-checker",
    accent: "#C05540",
    textAccent: "#C05540",
    tag: "Food Compatibility",
    title: "Viruddha Ahara Tool",
    desc: "Check conflicting ingredient pairings before eating.",
    icon: Utensils,
    dark: false,
  },
  {
    to: "/routine",
    accent: "#3E6B4A",
    textAccent: "#3E6B4A",
    tag: "Daily Rhythm",
    title: "Dinacharya Planner",
    desc: "Build your Ayurvedic daily schedule aligned to dosha cycles.",
    icon: Clock,
    dark: false,
  },
  {
    to: "/history",
    accent: "#C8A96A",
    textAccent: "#C8A96A",
    tag: "Timeline",
    title: "Health History",
    desc: "Review all your saved Prakriti and Vikriti assessments.",
    icon: History,
    dark: false,
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch (e) {} }

    axios.get(apiUrl("/history"))
      .then(({ data }) => {
        setHistoryCount(data.length);
        if (data.length > 0) setLatestResult(data[0]);
      })
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const STATS = [
    {
      icon: Activity,
      label: "Primary Dosha Baseline",
      value: latestResult ? latestResult.dosha_name : "—",
      sub: latestResult ? latestResult.tagline : "Take your first assessment.",
      accent: "#3E6B4A",
    },
    {
      icon: TrendingUp,
      label: "Digestive Agni State",
      value: latestResult?.agni ? latestResult.agni.type.split(" ")[0] : "Pending",
      sub: latestResult?.agni ? latestResult.agni.description : "Calculated during dosha diagnosis.",
      accent: "#C05540",
    },
    {
      icon: CalendarDays,
      label: "Assessments Saved",
      value: historyCount,
      sub: "Total saved diagnostic records.",
      accent: "#C8A96A",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F5EF]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">

          {/* ── Header ── */}
          <header className="flex flex-wrap items-start justify-between gap-4 mb-10 fade-up">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#3E6B4A] font-semibold mb-1">
                Ayurvedic Dashboard
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-[#1E2B21] leading-tight">
                {user ? `Namaste, ${user.name.split(" ")[0]}` : "Your Health Centre"}
              </h1>
              <p className="text-xs text-[#5A6960] mt-2">
                Personalized Ayurvedic Diagnostics &amp; Wellness Tracking Suite
              </p>
            </div>
            <Link
              to="/analyze"
              className="group shrink-0 px-5 py-3 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-px flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              New Analysis
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </header>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {STATS.map(({ icon: Icon, label, value, sub, accent }, i) => (
              <div
                key={label}
                className="p-6 rounded-3xl bg-white border border-[#DFE1DB] shadow-sm hover:shadow-md transition-all fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#5A6960] font-semibold">{label}</span>
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${accent}12`, color: accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <div
                  className="font-display text-3xl md:text-4xl leading-none mb-2"
                  style={{ color: value === "—" || value === "Pending" ? "#5A6960" : "#1E2B21" }}
                >
                  {value}
                </div>
                <p className="text-xs text-[#5A6960] leading-snug">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Quick links grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_LINKS.map(({ to, accent, textAccent, tag, title, desc, icon: Icon, dark }, i) => (
              <Link
                key={to}
                to={to}
                className="group p-7 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl duration-300 flex justify-between items-end fade-up"
                style={{
                  animationDelay: `${0.18 + i * 0.06}s`,
                  background: dark ? "#1A2620" : "white",
                  borderColor: dark ? "transparent" : "#DFE1DB",
                  color: dark ? "white" : "#1E2B21",
                }}
              >
                <div>
                  <span
                    className="text-[9px] uppercase tracking-[0.18em] font-semibold block mb-1.5"
                    style={{ color: textAccent, opacity: dark ? 1 : 1 }}
                  >
                    {tag}
                  </span>
                  <h3
                    className="font-display text-2xl md:text-3xl mb-2"
                    style={{ color: dark ? "white" : "#1E2B21" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-xs max-w-[240px] leading-relaxed"
                    style={{ color: dark ? "rgba(255,255,255,0.55)" : "#5A6960" }}
                  >
                    {desc}
                  </p>
                </div>
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center ml-4 shrink-0 transition-all group-hover:scale-110 duration-200"
                  style={{
                    background: dark ? "rgba(255,255,255,0.10)" : `${accent}12`,
                    color: dark ? "white" : accent,
                  }}
                >
                  <Icon className="w-4.5 h-4.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
