import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Utensils, AlertTriangle, CheckCircle2, BookOpen, ShieldAlert, Sparkles } from "lucide-react";
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

  const report = result?.details;

  return (
    <div className="mt-10 rounded-3xl bg-white border border-[#E2E4DF] p-6 md:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-full bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center">
          <Utensils className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-display text-2xl text-[#2C362F]">Viruddha Ahara (Incompatible Food) Engine</h3>
          <p className="text-xs text-[#5C6B61]">Classical Ayurvedic rule engine powered by NIIMH CCRAS &amp; Charaka Samhita.</p>
        </div>
      </div>

      <form onSubmit={checkCombination} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <input
          type="text"
          value={foodA}
          onChange={(e) => setFoodA(e.target.value)}
          placeholder="First Item (e.g. Milk, Honey, Yogurt)"
          className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
        />
        <input
          type="text"
          value={foodB}
          onChange={(e) => setFoodB(e.target.value)}
          placeholder="Second Item (e.g. Fish, Ghee, Banana)"
          className="bg-[#F9F6F0] border border-[#E2E4DF] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2C362F] hover:bg-[#1e2520] text-white rounded-xl font-medium text-sm py-3 transition-colors disabled:opacity-50"
        >
          {loading ? "Evaluating Engine..." : "Check Compatibility"}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-6 rounded-2xl border ${result.compatible ? "bg-[#4A7C59]/10 border-[#4A7C59]/30 text-[#2C362F]" : "bg-[#C8624C]/10 border-[#C8624C]/30 text-[#2C362F]"}`}>
          <div className="flex items-start gap-3">
            {result.compatible ? (
              <CheckCircle2 className="w-6 h-6 text-[#4A7C59] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#C8624C] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <h4 className="font-semibold text-base">
                  {result.compatible ? "Compatible Combination" : "Viruddha Ahara Warning!"}
                </h4>
                {report?.compatibility_score !== undefined && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${report.compatibility_score >= 80 ? "bg-[#4A7C59]/20 text-[#2C362F]" : "bg-[#C8624C]/20 text-[#8B2C19]"}`}>
                    Synergy Score: {report.compatibility_score}/100
                  </span>
                )}
              </div>
              <p className="text-sm text-[#5C6B61] leading-relaxed">{result.warning || result.message}</p>

              {/* Tridosha Net Impact */}
              {report?.dosha_impact && (
                <div className="mt-4 pt-3 border-t border-[#E2E4DF] flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-[#2C362F] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Tridosha Karma:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#5C6B61]">
                    Vata: {report.dosha_impact.vata > 0 ? `+${report.dosha_impact.vata}` : report.dosha_impact.vata}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#5C6B61]">
                    Pitta: {report.dosha_impact.pitta > 0 ? `+${report.dosha_impact.pitta}` : report.dosha_impact.pitta}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#5C6B61]">
                    Kapha: {report.dosha_impact.kapha > 0 ? `+${report.dosha_impact.kapha}` : report.dosha_impact.kapha}
                  </span>
                </div>
              )}

              {/* Classical Violations with Sanskrit References */}
              {report?.violations && report.violations.length > 0 && (
                <div className="mt-4 space-y-3">
                  {report.violations.map((v, i) => (
                    <div key={i} className="bg-white/80 p-3.5 rounded-xl border border-[#E2E4DF]/80 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-[#8B2C19] mb-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="italic">{v.sanskrit_rule}</span>
                        <span className="text-[10px] text-[#7A8A7E]">({v.classical_citation})</span>
                      </div>
                      <p className="text-[#5C6B61] mt-0.5"><strong>Pathophysiology:</strong> {v.pathophysiology}</p>
                      {v.remediation && (
                        <p className="text-[#3A6B48] mt-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <strong>Remediation:</strong> {v.remediation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
