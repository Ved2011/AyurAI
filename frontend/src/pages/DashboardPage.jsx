import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import { Sparkles, Clock, Utensils, History, ArrowRight, Activity, Calendar, ShieldCheck } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }

    axios
      .get(apiUrl("/history"))
      .then(({ data }) => {
        setHistoryCount(data.length);
        if (data.length > 0) setLatestResult(data[0]);
      })
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F9F6F0]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 p-6 md:p-12 max-w-6xl overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl text-[#2C362F]">
              {user ? `Welcome back, ${user.name}` : "AyurAI Health Dashboard"}
            </h1>
            <p className="text-xs text-[#5C6B61] mt-1">
              Personalized Ayurvedic Diagnostics & Wellness Tracking Suite
            </p>
          </div>

          <Link
            to="/analyze"
            className="px-6 py-3 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#5C6B61] font-semibold block mb-1">Primary Dosha Baseline</span>
            <div className="font-display text-3xl text-[#2C362F]">
              {latestResult ? latestResult.dosha_name : "Not Tested Yet"}
            </div>
            <p className="text-xs text-[#5C6B61] mt-2">
              {latestResult ? latestResult.tagline : "Take your first assessment to establish baseline."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#5C6B61] font-semibold block mb-1">Digestive Agni State</span>
            <div className="font-display text-2xl text-[#2C362F]">
              {latestResult?.agni ? latestResult.agni.type.split(" ")[0] : "Pending"}
            </div>
            <p className="text-xs text-[#5C6B61] mt-2">
              {latestResult?.agni ? latestResult.agni.description : "Calculated during dosha diagnosis."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E2E4DF] shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#5C6B61] font-semibold block mb-1">Assessments Saved</span>
            <div className="font-display text-4xl text-[#4A7C59]">{historyCount}</div>
            <p className="text-xs text-[#5C6B61] mt-2">Total saved diagnostic records.</p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link
            to="/analyze"
            className="p-8 rounded-3xl bg-[#2C362F] text-white hover:bg-[#1e2520] transition-all group flex justify-between items-end"
          >
            <div>
              <span className="text-xs uppercase tracking-widest opacity-60">Full Diagnostic</span>
              <h3 className="font-display text-3xl mt-1">Start Prakriti Quiz</h3>
              <p className="text-xs opacity-70 mt-2 max-w-sm">20 classical questions for in-depth constitutional breakdown.</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </span>
          </Link>

          <Link
            to="/food-checker"
            className="p-8 rounded-3xl bg-white border border-[#E2E4DF] hover:border-[#C8624C] transition-all group flex justify-between items-end"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8624C] font-semibold">Food Compatibility</span>
              <h3 className="font-display text-3xl text-[#2C362F] mt-1">Viruddha Ahara Tool</h3>
              <p className="text-xs text-[#5C6B61] mt-2 max-w-sm">Check conflicting ingredient pairings before eating.</p>
            </div>
            <span className="w-10 h-10 rounded-full bg-[#C8624C]/10 text-[#C8624C] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
