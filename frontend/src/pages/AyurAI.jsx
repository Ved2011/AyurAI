import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Hero from "@/components/ayur/Hero";
import DoshaForm from "@/components/ayur/DoshaForm";
import PrakritiQuiz from "@/components/ayur/PrakritiQuiz";
import ResultsCard from "@/components/ayur/ResultsCard";
import AboutAyurveda from "@/components/ayur/AboutAyurveda";
import History from "@/components/ayur/History";
import Disclaimer from "@/components/ayur/Disclaimer";
import { Leaf } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AyurAI() {
  const [options, setOptions] = useState({ symptoms: [], lifestyles: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("quick"); // 'quick' | 'quiz'
  const resultsRef = useRef(null);
  const formRef = useRef(null);

  const loadOptions = async () => {
    try {
      const { data } = await axios.get(`${API}/options`);
      setOptions(data);
    } catch (e) {
      console.error("options error", e);
    }
  };

  const loadHistory = async () => {
    try {
      const { data } = await axios.get(`${API}/history`);
      setHistory(data);
    } catch (e) {
      console.error("history error", e);
    }
  };

  useEffect(() => {
    loadOptions();
    loadHistory();
  }, []);

  const handleAnalyze = async ({ age, symptoms, lifestyle }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/analyze`, {
        age: Number(age),
        symptoms,
        lifestyle,
      });
      setResult(data);
      loadHistory();
      toast.success(`Your dominant dosha: ${data.dosha_name}`);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Analysis failed";
      toast.error(typeof msg === "string" ? msg : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    toast.message("Form reset");
  };

  const handleQuizResult = (data) => {
    setResult(data);
    loadHistory();
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(`${API}/history/${id}`);
      setHistory((h) => h.filter((x) => x.id !== id));
      toast.success("Entry removed");
    } catch (e) {
      toast.error("Could not delete");
    }
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div data-testid="ayurai-page" className="min-h-screen relative">
      {/* Header */}
      <header
        data-testid="ayurai-header"
        className="sticky top-0 z-30 backdrop-blur-md bg-[#F9F6F0]/75 border-b border-[#E2E4DF]"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#4A7C59] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </span>
            <span className="font-display text-2xl tracking-tight">AyurAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#5C6B61]">
            <a href="#analyzer" className="hover:text-[#2C362F]" data-testid="nav-analyzer">Analyzer</a>
            <a href="#about" className="hover:text-[#2C362F]" data-testid="nav-about">About Ayurveda</a>
            <a href="#history" className="hover:text-[#2C362F]" data-testid="nav-history">History</a>
          </nav>
          <button
            data-testid="cta-header"
            onClick={scrollToForm}
            className="px-5 py-2 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-sm font-medium transition-all hover:-translate-y-0.5"
          >
            Begin analysis
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <Hero onStart={scrollToForm} />

        <section id="analyzer" ref={formRef} className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="text-sm uppercase tracking-[0.22em] text-[#5C6B61]">Step 01 — Your constitution</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
              Discover the dosha at play<br/>within you today.
            </h2>
            <p className="mt-4 text-[#5C6B61] text-base md:text-lg max-w-xl">
              {mode === "quick"
                ? "Answer three short questions for a quick read — or switch to the full 20-question Prakriti quiz for a deeper analysis."
                : "Twenty classical questions adapted from Ayurvedic Prakriti assessment. Answer honestly — there are no right answers, only your unique nature."}
            </p>
          </div>

          {/* Mode switcher */}
          <div
            data-testid="mode-switcher"
            className="mt-10 inline-flex p-1 rounded-full bg-[#ECEDE8] border border-[#E2E4DF]"
          >
            <button
              type="button"
              data-testid="mode-quick"
              onClick={() => { setMode("quick"); setResult(null); }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "quick" ? "bg-white text-[#2C362F] shadow-sm" : "text-[#5C6B61] hover:text-[#2C362F]"
              }`}
            >
              Quick read · 3 Q
            </button>
            <button
              type="button"
              data-testid="mode-quiz"
              onClick={() => { setMode("quiz"); setResult(null); }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "quiz" ? "bg-white text-[#2C362F] shadow-sm" : "text-[#5C6B61] hover:text-[#2C362F]"
              }`}
            >
              Full Prakriti quiz · 20 Q
            </button>
          </div>

          {mode === "quick" ? (
            <DoshaForm options={options} loading={loading} onAnalyze={handleAnalyze} onReset={handleReset} />
          ) : (
            <PrakritiQuiz onResult={handleQuizResult} />
          )}

          <div ref={resultsRef} className="mt-16">
            {result && <ResultsCard result={result} />}
          </div>
        </section>

        <AboutAyurveda />
        <History items={history} onDelete={handleDeleteHistory} />
        <Disclaimer />
      </main>
    </div>
  );
}
