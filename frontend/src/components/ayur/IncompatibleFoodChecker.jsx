import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Utensils, AlertTriangle, CheckCircle2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function IncompatibleFoodChecker() {
  const [foodA, setFoodA] = useState("");
  const [foodB, setFoodB] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkCombination = async (e) => {
    e.preventDefault();
    if (!foodA || !foodB) return;
    setLoading(true);
    try {
      const { data } = await axios.post(apiUrl("/viruddha-check"), { foodA, foodB });
      setResult(data);
    } catch (err) {
      toast.error("Could not check food combination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-full bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center">
          <Utensils className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl text-[#2C362F]">Viruddha Ahara (Incompatible Food) Checker</h3>
          <p className="text-xs text-[#5C6B61]">Classical Ayurvedic rule engine for conflicting food combinations.</p>
        </div>
      </div>

      <form onSubmit={checkCombination} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <input
          type="text"
          value={foodA}
          onChange={(e) => setFoodA(e.target.value)}
          placeholder="First Item (e.g. Milk)"
          className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
        />
        <input
          type="text"
          value={foodB}
          onChange={(e) => setFoodB(e.target.value)}
          placeholder="Second Item (e.g. Fish or Honey)"
          className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2C362F] hover:bg-[#1e2520] text-white rounded-xl font-medium text-sm py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Compatibility"}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-5 rounded-2xl border ${result.compatible ? "bg-[#4A7C59]/10 border-[#4A7C59]/30 text-[#2C362F]" : "bg-[#C8624C]/10 border-[#C8624C]/30 text-[#2C362F]"}`}>
          <div className="flex items-start gap-3">
            {result.compatible ? (
              <CheckCircle2 className="w-6 h-6 text-[#4A7C59] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#C8624C] shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-base mb-1">{result.compatible ? "Compatible Combination" : "Viruddha Ahara Warning!"}</h4>
              <p className="text-sm text-[#5C6B61]">{result.warning || result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
