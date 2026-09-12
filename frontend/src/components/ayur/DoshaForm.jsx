import { useState } from "react";
import { RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";

const lifestyleDesc = {
  active: "Daily movement, exercise, outdoor activity",
  moderate: "Some activity, mixed with desk time",
  sedentary: "Mostly sitting, minimal movement",
};

const DEFAULT_SYMPTOMS = [
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

const DEFAULT_LIFESTYLES = [
  { id: "active", label: "Active" },
  { id: "moderate", label: "Moderate" },
  { id: "sedentary", label: "Sedentary" },
];

const COMMON_CONDITIONS = [
  { id: "hypertension", label: "High Blood Pressure" },
  { id: "diabetes", label: "Diabetes / High Blood Sugar" },
  { id: "asthma", label: "Asthma / Breathing Issues" },
  { id: "thyroid", label: "Thyroid Imbalance" },
  { id: "acid_reflux", label: "Chronic Acid Reflux / GERD" },
  { id: "ibs", label: "IBS / Irritable Bowel" },
];

export default function DoshaForm({ options, loading, onAnalyze, onReset }) {
  const symptomsList = options?.symptoms?.length > 0 ? options.symptoms : DEFAULT_SYMPTOMS;
  const lifestylesList = options?.lifestyles?.length > 0 ? options.lifestyles : DEFAULT_LIFESTYLES;

  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [lifestyle, setLifestyle] = useState("moderate");
  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");

  const toggleSymptom = (id) => {
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleCondition = (id) => {
    setConditions((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const reset = () => {
    setAge("");
    setSymptoms([]);
    setLifestyle("moderate");
    setConditions([]);
    setAllergies("");
    setMedications("");
    onReset && onReset();
  };

  const submit = (e) => {
    e.preventDefault();
    const n = Number(age);
    if (!age || isNaN(n) || n < 1 || n > 120) {
      toast.error("Please enter a valid age (1-120)");
      return;
    }
    onAnalyze({ age: n, symptoms, lifestyle, conditions, allergies, medications });
  };

  return (
    <form
      data-testid="dosha-form"
      onSubmit={submit}
      className="mt-10 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-[0_20px_50px_-30px_rgba(44,54,47,0.2)]"
    >
      {/* Age */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-3">Your age</label>
        <input
          data-testid="input-age"
          type="number"
          min="1"
          max="120"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 32"
          className="ayur-focus w-full md:w-48 text-4xl font-display bg-transparent border-0 border-b-2 border-[#E2E4DF] pb-2 focus:outline-none focus:border-[#4A7C59] transition-colors"
        />
      </div>

      {/* Symptoms */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-4">
          Current signals ({symptoms.length} selected)
        </label>
        <div data-testid="symptom-group" className="flex flex-wrap gap-2.5">
          {symptomsList.map((s) => {
            const selected = symptoms.includes(s.id);
            return (
              <button
                type="button"
                key={s.id}
                data-testid={`symptom-${s.id}`}
                onClick={() => toggleSymptom(s.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  selected
                    ? "bg-[#2C362F] text-white border-[#2C362F] -translate-y-[1px] shadow-sm"
                    : "bg-[#ECEDE8] text-[#2C362F] border-[#E2E4DF] hover:border-[#4A7C59] hover:-translate-y-[1px]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-4">Lifestyle</label>
        <div data-testid="lifestyle-group" className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lifestylesList.map((l) => {
            const selected = lifestyle === l.id;
            return (
              <button
                key={l.id}
                type="button"
                data-testid={`lifestyle-${l.id}`}
                onClick={() => setLifestyle(l.id)}
                className={`text-left rounded-2xl p-5 border transition-all ${
                  selected
                    ? "bg-[#4A7C59] text-white border-[#4A7C59] shadow-md -translate-y-[2px]"
                    : "bg-[#ECEDE8] text-[#2C362F] border-[#E2E4DF] hover:border-[#4A7C59]"
                }`}
              >
                <div className="font-display text-2xl">{l.label}</div>
                <div className={`text-xs mt-1 ${selected ? "text-white/80" : "text-[#5C6B61]"}`}>
                  {lifestyleDesc[l.id]}
                </div>
              </button>
            );
          })}
        </div>
      {/* Pre-existing Conditions */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-2">
          Pre-existing Conditions / Medical History
        </label>
        <p className="text-xs text-[#5C6B61] mb-4">Select any known diagnosed conditions for targeted herbal safety filtering.</p>
        <div className="flex flex-wrap gap-2.5">
          {COMMON_CONDITIONS.map((c) => {
            const selected = conditions.includes(c.id);
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCondition(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                  selected
                    ? "bg-[#C8624C] text-white border-[#C8624C] shadow-sm"
                    : "bg-[#F9F6F0] text-[#2C362F] border-[#E2E4DF] hover:border-[#C8624C]"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies & Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-2">Known Allergies & Intolerances</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Dairy, Gluten, Nuts, Pollen"
            className="w-full text-sm bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.22em] text-[#5C6B61] mb-2">Current Medications / Supplements</label>
          <input
            type="text"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="e.g. Antacids, Thyroid meds, Multivitamins"
            className="w-full text-sm bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#4A7C59]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E4DF]">
        <button
          data-testid="btn-analyze"
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-4 h-4" />
          {loading ? "Analyzing…" : "Analyze my dosha"}
        </button>
        <button
          data-testid="btn-reset"
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#2C362F]/20 hover:border-[#2C362F]/50 text-[#2C362F] text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <span className="text-xs text-[#5C6B61] ml-auto">Takes under 30 seconds.</span>
      </div>
    </form>
  );
}
