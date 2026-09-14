import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthModal from "@/components/auth/AuthModal";
import IncompatibleFoodChecker from "@/components/ayur/IncompatibleFoodChecker";
import Disclaimer from "@/components/ayur/Disclaimer";
import { Utensils } from "lucide-react";

export default function FoodCheckerPage() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch (e) {} }
  }, []);

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5EF]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
          {/* Page header */}
          <div className="mb-10 fade-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#C05540]/10 text-[#C05540] flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C05540] font-semibold">Food Synergy &amp; Compatibility</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-[#1E2B21]">
              Viruddha Ahara Checker
            </h1>
            <p className="text-sm text-[#5A6960] mt-3 max-w-xl">
              Combining foods with opposing thermogenic properties leads to metabolic toxins (<em>Ama</em>). Use this classical checker before combining ingredients.
            </p>
          </div>

          <IncompatibleFoodChecker />

          <div className="mt-16">
            <Disclaimer />
          </div>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
