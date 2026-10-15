import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { getNidraPlan, calculateNidraSynergy } from "@/lib/classicalAyur";
import {
  Moon,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Bed,
  Sun,
  ShieldCheck,
} from "lucide-react";

export default function NidraPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedDosha, setSelectedDosha] = useState("vata");
  const [bedtime, setBedtime] = useState("22:00");
  const [waketime, setWaketime] = useState("06:00");
  const [protocol, setProtocol] = useState(null);
  const [synergyReport, setSynergyReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    getNidraPlan(selectedDosha).then((data) => {
      setProtocol(data.dosha_protocol);
    });

    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDosha]);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const report = await calculateNidraSynergy({ bedtime, waketime, dosha: selectedDosha });
    setSynergyReport(report);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5EF] text-[#1E2B21]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3E6B4A] mb-1">
            <Moon className="w-4 h-4" />
            <span>Trayopasthambha (Classical Three Pillars of Life)</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2620] font-bold">
            Nidra Vidhi (निद्रा विधि) — Sleep & Ojas Planner
          </h1>
          <p className="text-sm text-[#5A6960] mt-1.5 max-w-2xl">
            In <em>Charaka Samhita Sutrasthana 21</em>, sleep is exalted as the preserver of life, strength, and immunity (Ojas). Synchronize your sleep cycle with the 4-hour Ayurvedic biological clocks.
          </p>
        </header>

        {/* Dosha Selector Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A6960]">Your Constitution:</span>
          {["vata", "pitta", "kapha"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDosha(d)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize border transition-all ${
                selectedDosha === d
                  ? "bg-[#1A2620] text-white border-[#1A2620] shadow-sm"
                  : "bg-white text-[#5A6960] border-[#DFE1DB] hover:bg-[#EAF2EC]"
              }`}
            >
              {d} Protocol
            </button>
          ))}
        </div>

        {/* Circadian Clocks & Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Sleep Calculator (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#DFE1DB] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A2620]">
              <Clock className="w-4.5 h-4.5 text-[#3E6B4A]" />
              <span>Circadian Synchronization Calculator</span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-semibold text-[#5A6960] block mb-1.5">
                  Target Bedtime (शयन काल):
                </label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFE1DB] bg-[#F8F5EF] text-sm font-medium focus:outline-none focus:border-[#3E6B4A]"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-[#5A6960] block mb-1.5">
                  Target Wake-Up Time (जागरण काल):
                </label>
                <input
                  type="time"
                  value={waketime}
                  onChange={(e) => setWaketime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFE1DB] bg-[#F8F5EF] text-sm font-medium focus:outline-none focus:border-[#3E6B4A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A2620] hover:bg-[#2C362F] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                {loading ? "Calculating Synergy..." : "Analyze Sleep Synchrony"}
              </button>
            </form>

            {synergyReport && (
              <div className="pt-4 border-t border-[#DFE1DB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A6960]">Total Sleep Duration:</span>
                  <span className="font-bold text-sm text-[#1A2620]">{synergyReport.duration_hours} hours</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A6960]">Ojas Conservation Score:</span>
                  <span className="font-bold text-sm text-[#3E6B4A]">{synergyReport.ojas_conservation_score}/100</span>
                </div>

                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    synergyReport.is_kapha_kaala_bedtime
                      ? "bg-[#EAF2EC] border-[#3E6B4A]/30 text-[#2F5238]"
                      : "bg-[#C05540]/10 border-[#C05540]/30 text-[#C05540]"
                  }`}
                >
                  <p>{synergyReport.recommendation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Biological Kaala Chronometer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-sm text-[#1A2620] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              The Nighttime Biological Dosha Cycles (काल विभाजन)
            </h3>

            <div className="space-y-3">
              <div className="bg-white p-4.5 rounded-2xl border border-[#3E6B4A]/30 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#3E6B4A]">
                    06:00 PM – 10:00 PM: Kapha Kaala (The Gateway to Deep Rest)
                  </span>
                  <span className="text-[10px] bg-[#EAF2EC] text-[#3E6B4A] px-2 py-0.5 rounded-full font-semibold">
                    Ideal Bedtime
                  </span>
                </div>
                <p className="text-xs text-[#5A6960] leading-relaxed">
                  Nature fills with heavy, stabilizing, cooling energy. Sleeping between 9:30 PM and 10:00 PM taps directly into this biological drowsiness, replenishing cellular Ojas effortlessly.
                </p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#C05540]/30 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#C05540]">
                    10:00 PM – 02:00 AM: Pitta Kaala (Internal Metabolic Cleansing)
                  </span>
                  <span className="text-[10px] bg-[#C05540]/10 text-[#C05540] px-2 py-0.5 rounded-full font-semibold">
                    Internal Digestion
                  </span>
                </div>
                <p className="text-xs text-[#5A6960] leading-relaxed">
                  The liver and subtle metabolic enzymes cleanse bodily tissues. If you remain awake past 10:30 PM, this heat fires up mental activity ("second wind"), stimulating late-night cravings and insomnia.
                </p>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-[#C8A96A]/30 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#C8A96A]">
                    02:00 AM – 06:00 AM: Vata Kaala (Brahma Muhurta Awakening)
                  </span>
                  <span className="text-[10px] bg-[#C8A96A]/10 text-[#C8A96A] px-2 py-0.5 rounded-full font-semibold">
                    Spiritual Clarity
                  </span>
                </div>
                <p className="text-xs text-[#5A6960] leading-relaxed">
                  Atmospheric energy becomes light, crisp, and expansive. Waking during Brahma Muhurta (~4:30 AM – 5:30 AM) imparts mental clarity, intuitive perception, and effortless elimination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Dosha Protocol Section */}
        {protocol && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DFE1DB] shadow-xs space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold text-[#3E6B4A] tracking-wider block mb-1">
                Customized Protocol
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A2620]">{protocol.dosha}</h2>
              <p className="text-xs sm:text-sm text-[#5A6960] mt-1">{protocol.sleep_archetype}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                <h4 className="text-xs uppercase font-bold text-[#1E2B21] mb-1">Classical External Therapy</h4>
                <p className="text-xs text-[#5A6960] leading-relaxed">{protocol.classical_therapy}</p>
              </div>

              <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                <h4 className="text-xs uppercase font-bold text-[#1E2B21] mb-1">Herbal Bedtime Elixir</h4>
                <p className="text-xs text-[#5A6960] leading-relaxed">{protocol.herbal_tonic}</p>
              </div>

              <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                <h4 className="text-xs uppercase font-bold text-[#1E2B21] mb-1">Bedroom Sensory Tuning</h4>
                <p className="text-xs text-[#5A6960] leading-relaxed">{protocol.bedroom_tuning}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
