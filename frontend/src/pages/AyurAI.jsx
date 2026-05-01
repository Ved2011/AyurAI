import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Hero from "@/components/ayur/Hero";
import DoshaForm from "@/components/ayur/DoshaForm";
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
              Answer three short questions. We'll map your signals to Vata, Pitta or Kapha and return herbs and lifestyle practices rooted in 5,000 years of Ayurvedic wisdom.
            </p>
          </div>

          <DoshaForm options={options} loading={loading} onAnalyze={handleAnalyze} onReset={handleReset} />

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
