import { Link } from "react-router-dom";
import { Sparkles, Clock, Utensils, ShieldCheck, ArrowRight, Leaf, Activity, CheckCircle2 } from "lucide-react";

export default function WelcomePage({ onOpenAuth }) {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C362F]">
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-white shadow-md">
            <Leaf className="w-6 h-6" />
          </span>
          <span className="font-display text-3xl tracking-tight text-[#2C362F]">
            Ayur<span className="italic font-normal text-[#4A7C59]">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold uppercase tracking-wider text-[#5C6B61] hover:text-[#2C362F] transition-colors"
          >
            Sign In
          </button>
          <Link
            to="/analyze"
            className="px-6 py-2.5 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center py-16 md:py-24">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] text-xs font-semibold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Authentic Ayurvedic AI Intelligence
        </span>

        <h1 className="font-display text-5xl md:text-7xl leading-[1.1] text-[#2C362F] tracking-tight">
          Discover Your True Constitution & Doshic Balance
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#5C6B61] max-w-2xl mx-auto leading-relaxed">
          Rooted in 5,000-year-old classical Ayurvedic texts (*Charaka Samhita*). AyurAI evaluates your innate Prakriti, active Vikriti imbalances, Agni digestive fire, and custom herbs.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="px-8 py-4 rounded-full bg-[#2C362F] hover:bg-[#1e2520] text-white font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-3"
          >
            <span>Begin Free Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-full bg-white border border-[#E2E4DF] hover:border-[#4A7C59] text-[#2C362F] font-semibold text-sm transition-all shadow-sm"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 border-t border-[#E2E4DF]">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5C6B61] font-semibold">Core Capabilities</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#2C362F] mt-2">Comprehensive Ayurvedic Care Suite</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Dual Dosha Diagnostic</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Differentiates baseline Prakriti from current Vikriti imbalances with multi-dosha percentages.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Dinacharya Planner</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Hour-by-hour daily routines personalized to your primary active dosha energy.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center mb-6">
              <Utensils className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Viruddha Ahara Checker</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Checks food combinations against classical Ayurvedic rules to prevent metabolic toxicity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
