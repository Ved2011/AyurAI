import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { getHomeRemedies } from "@/lib/classicalAyur";
import {
  HeartPulse,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  ShieldAlert,
} from "lucide-react";

export default function RemediesPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [remedies, setRemedies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    getHomeRemedies().then((data) => {
      setRemedies(data.remedies || []);
      if (data.remedies?.length > 0) setSelectedRemedy(data.remedies[0]);
      setLoading(false);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const filteredRemedies = remedies.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.ailment_sanskrit.toLowerCase().includes(q) ||
      r.ailment_english.toLowerCase().includes(q) ||
      r.remedy_title.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#F8F5EF] text-[#1E2B21]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3E6B4A] mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Chakradatta & Bhaishajya Ratnavali Medicine Cabinet</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2620] font-bold">
            Gharelu Upachar & Pathya (घरेलू उपचार एवं पथ्यापथ्य)
          </h1>
          <p className="text-sm text-[#5A6960] mt-1.5 max-w-2xl">
            Time-tested, kitchen-accessible classical Ayurvedic remedies for acute and everyday health complaints, prepared with authentic botanical precision.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#5A6960]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ailments or remedies (e.g. Acidity, Cough, Joint pain, Bloating)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DFE1DB] text-sm focus:outline-none focus:border-[#3E6B4A]"
          />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ailment List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredRemedies.map((rem) => {
              const isSelected = selectedRemedy?.id === rem.id;
              return (
                <div
                  key={rem.id}
                  onClick={() => setSelectedRemedy(rem)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#1A2620] text-white border-[#1A2620] shadow-md"
                      : "bg-white hover:bg-[#EAF2EC]/60 border-[#DFE1DB] text-[#1E2B21]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm">{rem.ailment_sanskrit}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-[#3E6B4A] text-white" : "bg-[#F8F5EF] text-[#5A6960]"
                      }`}
                    >
                      {rem.dosha_involved?.split(" ")[0]}
                    </span>
                  </div>
                  <p className={`text-xs font-medium mb-1 ${isSelected ? "text-white/80" : "text-[#5A6960]"}`}>
                    {rem.ailment_english}
                  </p>
                  <p className={`text-xs italic truncate ${isSelected ? "text-[#E9D8A6]" : "text-[#3E6B4A]"}`}>
                    {rem.remedy_title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Remedy Recipe Details (7 cols) */}
          <div className="lg:col-span-7">
            {selectedRemedy ? (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DFE1DB] shadow-xs space-y-6">
                <div>
                  <span className="text-xs uppercase font-semibold text-[#3E6B4A] tracking-wider block mb-1">
                    Classical Prescription
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A2620]">
                    {selectedRemedy.remedy_title}
                  </h2>
                  <p className="text-sm text-[#5A6960] mt-0.5">
                    For {selectedRemedy.ailment_sanskrit} ({selectedRemedy.ailment_english})
                  </p>
                </div>

                {/* Classical Script Box */}
                <div className="bg-[#1A2620] text-white p-4.5 rounded-2xl border border-[#3E6B4A]/40">
                  <div className="flex items-center gap-1.5 text-xs text-[#E9D8A6] font-semibold mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Scriptural Authority — {selectedRemedy.classical_script}</span>
                  </div>
                  <p className="font-display text-base italic text-white/95">
                    "{selectedRemedy.sanskrit_principle}"
                  </p>
                </div>

                {/* Ingredients & Preparation */}
                <div className="space-y-4">
                  <div className="bg-[#F8F5EF] p-5 rounded-2xl border border-[#DFE1DB]">
                    <h4 className="text-xs uppercase font-bold text-[#1E2B21] tracking-wider mb-2.5 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-4 h-4 text-[#3E6B4A]" />
                      Kitchen Ingredients Required:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#1E2B21]">
                      {selectedRemedy.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E6B4A] mt-1.5 shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#F8F5EF] p-5 rounded-2xl border border-[#DFE1DB]">
                    <h4 className="text-xs uppercase font-bold text-[#1E2B21] tracking-wider mb-1.5">
                      Preparation & Method of Administration:
                    </h4>
                    <p className="text-xs text-[#1E2B21] leading-relaxed">
                      {selectedRemedy.preparation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase font-bold text-[#5A6960] tracking-wider mb-1">
                      Pathophysiological Action:
                    </h4>
                    <p className="text-xs text-[#5A6960] leading-relaxed">
                      {selectedRemedy.clinical_mechanism}
                    </p>
                  </div>

                  {selectedRemedy.when_to_see_vaidya && (
                    <div className="p-3.5 rounded-2xl bg-[#C05540]/10 border border-[#C05540]/25 text-[#C05540] text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Red Flags (When to consult a Vaidya):</strong> {selectedRemedy.when_to_see_vaidya}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#DFE1DB] text-[#5A6960]">
                Select an ailment from the list to view its classical herbal preparation.
              </div>
            )}
          </div>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
