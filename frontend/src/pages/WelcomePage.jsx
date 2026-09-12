import { Link } from "react-router-dom";
import { Sparkles, Clock, Utensils, ShieldCheck, ArrowRight, Leaf, Activity, LogIn, UserPlus, BookOpen } from "lucide-react";

export default function WelcomePage({ onOpenAuth }) {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C362F]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#F9F6F0]/85 border-b border-[#E2E4DF]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-white shadow-md">
              <Leaf className="w-6 h-6" />
            </span>
            <span className="font-display text-3xl tracking-tight text-[#2C362F]">
              Ayur<span className="italic font-normal text-[#4A7C59]">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E2E4DF] hover:border-[#4A7C59] text-[#2C362F] text-xs font-semibold transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>Log In</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Pure Informational Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center py-16 md:py-24">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] text-xs font-semibold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Classical Ayurvedic Science Meets AI
        </span>

        <h1 className="font-display text-5xl md:text-7xl leading-[1.1] text-[#2C362F] tracking-tight">
          Holistic Ayurvedic Diagnostics & Doshic Balance
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#5C6B61] max-w-2xl mx-auto leading-relaxed">
          AyurAI is an authentic digital wellness suite grounded in classical Ayurvedic literature (*Charaka Samhita* & *Sushruta Samhita*). It evaluates your innate Prakriti, active Vikriti imbalances, digestive fire (*Agni*), and tailored herbal remedies.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-full bg-[#2C362F] hover:bg-[#1e2520] text-white font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-3"
          >
            <UserPlus className="w-4 h-4 text-[#A3B18A]" />
            <span>Create Profile to Begin</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-full bg-white border border-[#E2E4DF] hover:border-[#4A7C59] text-[#2C362F] font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#4A7C59]" />
            <span>Log In to Existing Account</span>
          </button>
        </div>
      </section>

      {/* Educational Features Overview (NO QUIZ HERE) */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 border-t border-[#E2E4DF]">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5C6B61] font-semibold">Platform Overview</span>
          <h2 className="font-display text-3xl md:text-4xl text-[#2C362F] mt-2">What You Can Explore Inside</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Prakriti & Vikriti Evaluation</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Differentiates your lifelong genetic baseline (Prakriti) from acute active imbalances (Vikriti) with multi-dosha percentages.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Dinacharya Daily Planner</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Hour-by-hour daily schedules personalized to align your body clock with natural dosha cycles.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm hover:border-[#4A7C59] transition-all">
            <span className="w-12 h-12 rounded-2xl bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center mb-6">
              <Utensils className="w-6 h-6" />
            </span>
            <h3 className="font-display text-2xl mb-2">Viruddha Ahara Checker</h3>
            <p className="text-xs text-[#5C6B61] leading-relaxed">
              Rule engine for incompatible food combinations to prevent digestive toxin buildup (*Ama*).
            </p>
          </div>
        </div>
      </section>

      {/* Classical Principles Section */}
      <section className="bg-[#2C362F] text-white py-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#A3B18A] font-semibold">Classical Foundation</span>
          <h2 className="font-display text-3xl md:text-5xl mt-2 mb-6">Grounded in Ancient Ayurvedic Medical Texts</h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto leading-relaxed mb-8">
            Ayurveda views health as dynamic equilibrium between Vata (Air/Ether), Pitta (Fire/Water), and Kapha (Earth/Water). AyurAI translates these classical diagnostic models into personalized digital wellness intelligence.
          </p>

          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Create Your Profile Now
          </button>
        </div>
      </section>
    </div>
  );
}
