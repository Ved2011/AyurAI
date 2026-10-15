import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { getAgniAmaQuiz, evaluateAgniAma } from "@/lib/classicalAyur";
import {
  Flame,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function AgniAmaPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    getAgniAmaQuiz().then((data) => {
      setQuestions(data.questions || []);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions for an accurate Ayurvedic clinical diagnosis.");
      return;
    }

    setLoading(true);
    const report = await evaluateAgniAma(answers);
    setResult(report);
    setLoading(false);
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5EF] text-[#1E2B21]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C05540] mb-1">
            <Flame className="w-4 h-4" />
            <span>Metabolic & Endotoxin Assessment</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2620] font-bold">
            Agni & Ama Pariksha (अग्नि एवं आम परीक्षा)
          </h1>
          <p className="text-sm text-[#5A6960] mt-1.5 max-w-2xl">
            In classical Ayurveda, all disease originates from compromised digestive fire (<em>"रोगाः सर्वेऽपि मन्दाग्नौ"</em>). Evaluate whether your Agni is Sama, Visham, Tikshna, or Manda, and measure your systemic Ama toxicity.
          </p>
        </header>

        {!result ? (
          /* Diagnostic Quiz Form */
          <form onSubmit={handleEvaluate} className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-6 rounded-3xl border border-[#DFE1DB] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3E6B4A] mb-2">
                  <span>Question {idx + 1} of {questions.length}</span>
                </div>
                <h3 className="font-semibold text-base text-[#1A2620] mb-4">{q.question}</h3>

                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.index;
                    return (
                      <div
                        key={opt.index}
                        onClick={() => handleSelect(q.id, opt.index)}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-[#EAF2EC] border-[#3E6B4A] text-[#1E2B21] font-medium shadow-xs"
                            : "bg-[#F8F5EF]/60 hover:bg-[#F8F5EF] border-[#DFE1DB] text-[#5A6960]"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-[#3E6B4A] bg-[#3E6B4A]" : "border-[#DFE1DB]"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1A2620] hover:bg-[#2C362F] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? "Analyzing Cellular Fire..." : "Calculate Agni & Ama Diagnosis"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Diagnostic Results View */
          <div className="space-y-6">
            {/* Agni State Card */}
            <div className="bg-gradient-to-br from-[#1A2620] to-[#2E4334] text-white p-6 md:p-8 rounded-3xl shadow-lg border border-[#3E6B4A]/30">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase bg-[#C05540] text-white px-3 py-1 rounded-full inline-block mb-2">
                    Primary Diagnostic Profile
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{result.primary_agni}</h2>
                  <p className="text-sm text-white/80 mt-0.5">Dosha Correlation: {result.dosha_association}</p>
                </div>

                {/* Ama Toxicity Meter */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[150px]">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                    Systemic Ama Level
                  </span>
                  <span
                    className={`font-display text-3xl font-bold ${
                      result.ama_percentage > 50 ? "text-[#FF8A80]" : "text-[#E9D8A6]"
                    }`}
                  >
                    {result.ama_percentage}%
                  </span>
                  <span className="text-[11px] font-semibold text-white/80 block mt-0.5">
                    {result.ama_status.split(" ")[0]}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15">
                <div className="flex items-center gap-1.5 text-xs text-[#E9D8A6] font-semibold mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Classical Sanskrit Grounding — {result.classical_citation}</span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">{result.pathophysiology}</p>
              </div>
            </div>

            {/* Prescriptive Therapy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dipana & Pachana Therapy */}
              <div className="bg-white p-6 rounded-3xl border border-[#3E6B4A]/30 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-[#3E6B4A]">
                  <Flame className="w-5 h-5" />
                  <h3 className="font-bold text-base">Dipana-Pachana Therapy (दीपन-पाचन)</h3>
                </div>
                <p className="text-xs uppercase font-semibold text-[#5A6960] mb-2 tracking-wider">
                  Rekindling Digestive Fire & Digesting Toxins:
                </p>
                <p className="text-xs sm:text-sm text-[#1E2B21] leading-relaxed bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                  {result.dipana_pachana_therapy}
                </p>
              </div>

              {/* Ama Clearance Protocol */}
              <div className="bg-white p-6 rounded-3xl border border-[#C05540]/30 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-[#C05540]">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-bold text-base">Ama Clearance & Srotas Detox</h3>
                </div>
                <p className="text-xs uppercase font-semibold text-[#5A6960] mb-2 tracking-wider">
                  Clinical Protocol:
                </p>
                <p className="text-xs sm:text-sm text-[#1E2B21] leading-relaxed bg-[#F8F5EF] p-4 rounded-2xl border border-[#DFE1DB]">
                  {result.ama_remediation}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={resetQuiz}
                className="bg-white hover:bg-[#F8F5EF] text-[#1E2B21] border border-[#DFE1DB] px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Diagnostic
              </button>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
