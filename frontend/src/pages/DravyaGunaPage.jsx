import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { getDravyaGunaHerbs } from "@/lib/classicalAyur";
import {
  Leaf,
  Search,
  Filter,
  BookOpen,
  Sparkles,
  ShieldAlert,
  Flame,
  Droplet,
  Wind,
} from "lucide-react";

export default function DravyaGunaPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [herbs, setHerbs] = useState([]);
  const [search, setSearch] = useState("");
  const [doshaFilter, setDoshaFilter] = useState("all");
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    getDravyaGunaHerbs().then((data) => {
      setHerbs(data.herbs || []);
      if (data.herbs?.length > 0) setSelectedHerb(data.herbs[0]);
      setLoading(false);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const filteredHerbs = herbs.filter((h) => {
    const matchesSearch =
      h.name_sanskrit.toLowerCase().includes(search.toLowerCase()) ||
      h.botanical_name?.toLowerCase().includes(search.toLowerCase()) ||
      h.common_names?.toLowerCase().includes(search.toLowerCase()) ||
      h.id.toLowerCase().includes(search.toLowerCase());

    const matchesDosha =
      doshaFilter === "all" ||
      h.doshakarma.toLowerCase().includes(doshaFilter.toLowerCase());

    return matchesSearch && matchesDosha;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F5EF] text-[#1E2B21]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3E6B4A] mb-1">
            <Leaf className="w-4 h-4" />
            <span>Classical Materia Medica (द्रव्यगुण विज्ञान)</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2620] font-bold">
            Dravya Guna — Classical Herbal Pharmacopeia
          </h1>
          <p className="text-sm text-[#5A6960] mt-1.5 max-w-2xl">
            Explore canonical medicinal plants, their 5 pharmacological dimensions (Rasa, Guna, Virya, Vipaka, Prabhava), and shloka citations from <em>Bhavaprakasha Nighantu</em>.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#5A6960]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Sanskrit name, botanical name, or indication (e.g. Ashwagandha, memory)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DFE1DB] text-sm focus:outline-none focus:border-[#3E6B4A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6960] font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Dosha:
            </span>
            {["all", "vata", "pitta", "kapha"].map((d) => (
              <button
                key={d}
                onClick={() => setDoshaFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  doshaFilter === d
                    ? "bg-[#1A2620] text-white border-[#1A2620]"
                    : "bg-white text-[#5A6960] border-[#DFE1DB] hover:bg-[#EAF2EC]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Catalog List, Right Detailed Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Herb List (4 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredHerbs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#DFE1DB] text-sm text-[#5A6960]">
                No herbs matched your search criteria.
              </div>
            ) : (
              filteredHerbs.map((h) => {
                const isSelected = selectedHerb?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHerb(h)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#1A2620] text-white border-[#1A2620] shadow-md"
                        : "bg-white hover:bg-[#EAF2EC]/60 border-[#DFE1DB] text-[#1E2B21]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm">{h.name_sanskrit}</h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-[#3E6B4A] text-white" : "bg-[#EAF2EC] text-[#3E6B4A]"
                        }`}
                      >
                        {h.virya?.split(" ")[0]}
                      </span>
                    </div>
                    <p className={`text-xs italic truncate mb-2 ${isSelected ? "text-white/70" : "text-[#5A6960]"}`}>
                      {h.botanical_name}
                    </p>
                    <p className={`text-xs line-clamp-1 ${isSelected ? "text-white/80" : "text-[#5A6960]"}`}>
                      <strong>Karma:</strong> {h.doshakarma}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Herb Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {selectedHerb ? (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#DFE1DB] shadow-xs space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#3E6B4A]">
                      {selectedHerb.family || "Classical Botanical"}
                    </span>
                    <span className="text-xs bg-[#F8F5EF] border border-[#DFE1DB] px-3 py-1 rounded-full text-[#1E2B21] font-medium">
                      Common: {selectedHerb.common_names}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A2620]">
                    {selectedHerb.name_sanskrit}
                  </h2>
                  <p className="text-sm italic text-[#5A6960] mt-0.5">{selectedHerb.botanical_name}</p>
                </div>

                {/* Sanskrit Shloka Box */}
                {selectedHerb.sanskrit_shloka && (
                  <div className="bg-[#1A2620] text-white p-4.5 rounded-2xl border border-[#3E6B4A]/40">
                    <div className="flex items-center gap-1.5 text-xs text-[#E9D8A6] font-semibold mb-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Classical Citation — {selectedHerb.classical_citation}</span>
                    </div>
                    <p className="font-display text-base italic text-white/95">
                      "{selectedHerb.sanskrit_shloka}"
                    </p>
                  </div>
                )}

                {/* 5 Pharmacological Dimensions Grid */}
                <div>
                  <h4 className="text-xs uppercase font-semibold text-[#5A6960] tracking-wider mb-3">
                    Ayurvedic Pharmacological Profile (पञ्चगुण)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#DFE1DB]">
                      <span className="text-[10px] uppercase font-bold text-[#5A6960] block">Rasa (Taste)</span>
                      <span className="text-xs font-semibold text-[#1E2B21]">{selectedHerb.rasa?.join(", ")}</span>
                    </div>
                    <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#DFE1DB]">
                      <span className="text-[10px] uppercase font-bold text-[#5A6960] block">Virya (Potency)</span>
                      <span className="text-xs font-semibold text-[#C05540]">{selectedHerb.virya}</span>
                    </div>
                    <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#DFE1DB]">
                      <span className="text-[10px] uppercase font-bold text-[#5A6960] block">Vipaka (Post-Digestive)</span>
                      <span className="text-xs font-semibold text-[#1E2B21]">{selectedHerb.vipaka}</span>
                    </div>
                    <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#DFE1DB]">
                      <span className="text-[10px] uppercase font-bold text-[#5A6960] block">Guna (Attributes)</span>
                      <span className="text-xs font-semibold text-[#1E2B21]">{selectedHerb.guna?.join(", ") || "Laghu"}</span>
                    </div>
                    <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#DFE1DB] sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-[#5A6960] block">Prabhava (Special Action)</span>
                      <span className="text-xs font-semibold text-[#3E6B4A]">{selectedHerb.prabhava}</span>
                    </div>
                  </div>
                </div>

                {/* Therapeutics & Indications */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-[#5A6960] tracking-wider mb-1">
                      Therapeutic Indications (रोगघ्नता)
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHerb.indications?.map((ind, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-[#EAF2EC] text-[#2F5238] font-medium">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                    <h4 className="text-xs uppercase font-bold text-[#1E2B21] mb-1">Recommended Dosage & Carrier (Anupana)</h4>
                    <p className="text-xs text-[#5A6960] leading-relaxed mb-1.5">
                      <strong>Dose:</strong> {selectedHerb.recommended_dose}
                    </p>
                    <p className="text-xs text-[#5A6960] leading-relaxed">
                      <strong>Anupana (Vehicle):</strong> {selectedHerb.anupana}
                    </p>
                  </div>

                  {selectedHerb.contraindications && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#C05540]/10 border border-[#C05540]/20 text-[#C05540] text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Contraindications:</strong> {selectedHerb.contraindications}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#DFE1DB] text-[#5A6960]">
                Select an herb from the catalog to inspect its classical pharmacological properties.
              </div>
            )}
          </div>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
