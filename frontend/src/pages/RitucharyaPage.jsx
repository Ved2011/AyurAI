import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { getRitucharyaData } from "@/lib/classicalAyur";
import {
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Flower2,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

export default function RitucharyaPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    getRitucharyaData().then((data) => {
      setSeasons(data.seasons || []);
      const current = (data.seasons || []).find((s) => s.id === data.current_id) || data.seasons?.[0];
      setActiveSeason(current);
      setLoading(false);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const getRituIcon = (id) => {
    switch (id) {
      case "shishira":
      case "hemanta":
        return Snowflake;
      case "vasanta":
        return Flower2;
      case "grishma":
        return Sun;
      case "varsha":
        return CloudRain;
      case "sharad":
        return Wind;
      default:
        return Sun;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5EF] text-[#1E2B21]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3E6B4A] mb-1">
            <Calendar className="w-4 h-4" />
            <span>Classical Ayurvedic Chronobiology</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2620] font-bold">
            Ritucharya (ऋतुचर्या) — Seasonal Living
          </h1>
          <p className="text-sm text-[#5A6960] mt-1.5 max-w-2xl">
            Align your digestive Agni, diet (Ahara), and lifestyle (Vihara) with the 6 classical seasons prescribed in <em>Charaka Samhita Sutrasthana Chapter 6</em>.
          </p>
        </header>

        {/* Season Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {seasons.map((s) => {
            const Icon = getRituIcon(s.id);
            const isSelected = activeSeason?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSeason(s)}
                className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-[#1A2620] text-white border-[#1A2620] shadow-md scale-[1.02]"
                    : "bg-white hover:bg-[#EAF2EC] text-[#1E2B21] border-[#DFE1DB]"
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? "bg-[#3E6B4A] text-white" : "bg-[#F8F5EF] text-[#3E6B4A]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span className="font-bold text-xs leading-tight mb-0.5">{s.name_sanskrit.split(" ")[0]}</span>
                <span className={`text-[11px] ${isSelected ? "text-white/70" : "text-[#5A6960]"}`}>
                  {s.name_english.split("/")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Season Detail View */}
        {activeSeason && (
          <div className="space-y-6">
            {/* Hero Card with Shloka */}
            <div className="bg-gradient-to-br from-[#1A2620] to-[#263D30] text-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#3E6B4A]/30">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#3E6B4A]/80 text-white mb-2">
                    {activeSeason.ayana}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{activeSeason.name_sanskrit}</h2>
                  <p className="text-sm text-white/80">{activeSeason.months_gregorian} ({activeSeason.months_hindu})</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 block">Digestive Agni</span>
                  <span className="font-bold text-sm text-[#E9D8A6]">{activeSeason.agni_status}</span>
                </div>
              </div>

              {/* Classical Sanskrit Shloka */}
              <div className="mt-4 pt-4 border-t border-white/15">
                <div className="flex items-center gap-1.5 text-xs text-[#E9D8A6] font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sanskrit Shloka Citation — {activeSeason.classical_citation}</span>
                </div>
                <blockquote className="font-display text-lg md:text-xl italic text-white/95 leading-relaxed">
                  "{activeSeason.sanskrit_shloka}"
                </blockquote>
              </div>
            </div>

            {/* Dosha Dynamics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#DFE1DB] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#C8A96A]">Vata State</span>
                  <Wind className="w-4 h-4 text-[#C8A96A]" />
                </div>
                <p className="text-sm font-medium text-[#1E2B21]">{activeSeason.dosha_dynamics.vata}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DFE1DB] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#C05540]">Pitta State</span>
                  <Sun className="w-4 h-4 text-[#C05540]" />
                </div>
                <p className="text-sm font-medium text-[#1E2B21]">{activeSeason.dosha_dynamics.pitta}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#DFE1DB] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#3E6B4A]">Kapha State</span>
                  <CloudRain className="w-4 h-4 text-[#3E6B4A]" />
                </div>
                <p className="text-sm font-medium text-[#1E2B21]">{activeSeason.dosha_dynamics.kapha}</p>
              </div>
            </div>

            {/* Dietary & Lifestyle Protocols (Pathya vs Apathya) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pathya (Beneficial) */}
              <div className="bg-white p-6 rounded-3xl border border-[#3E6B4A]/30 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-[#3E6B4A]">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-bold text-base">Pathya Ahara & Vihara (Recommended)</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-[#5A6960] tracking-wider mb-2">Dietary Staples (Ahara):</h4>
                    <ul className="space-y-1.5 text-xs text-[#1E2B21]">
                      {activeSeason.pathya_ahara.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E6B4A] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#DFE1DB]">
                    <h4 className="text-xs uppercase font-semibold text-[#5A6960] tracking-wider mb-2">Daily Habits (Vihara):</h4>
                    <ul className="space-y-1.5 text-xs text-[#1E2B21]">
                      {activeSeason.pathya_vihara.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E6B4A] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Apathya (To Avoid) & Seasonal Cleansing */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-[#C05540]/30 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 text-[#C05540]">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold text-base">Apathya Ahara (Prohibited & Dangerous)</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-[#1E2B21]">
                    {activeSeason.apathya_ahara.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C05540] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seasonal Panchakarma */}
                {activeSeason.seasonal_panchakarma && (
                  <div className="bg-[#EAF2EC] p-5 rounded-2xl border border-[#3E6B4A]/20 flex items-start gap-3">
                    <HeartPulse className="w-5 h-5 text-[#3E6B4A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#3E6B4A] mb-1">
                        Classical Seasonal Purification (Shodhana)
                      </h4>
                      <p className="text-xs text-[#1E2B21] leading-relaxed">
                        {activeSeason.seasonal_panchakarma}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
