import { useState } from "react";
import { RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";

const lifestyleDesc = {
  active: "Daily movement, exercise, outdoor activity",
  moderate: "Some activity, mixed with desk time",
  sedentary: "Mostly sitting, minimal movement",
};

export default function DoshaForm({ options, loading, onAnalyze, onReset }) {
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [lifestyle, setLifestyle] = useState("moderate");

  const toggleSymptom = (id) => {
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const reset = () => {
    setAge("");
    setSymptoms([]);
    setLifestyle("moderate");
    onReset && onReset();
  };

  const submit = (e) => {
    e.preventDefault();
    const n = Number(age);
    if (!age || isNaN(n) || n < 1 || n > 120) {
      toast.error("Please enter a valid age (1-120)");
      return;
    }
    onAnalyze({ age: n, symptoms, lifestyle });
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
          {options.symptoms.map((s) => {
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
          {options.lifestyles.map((l) => {
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
