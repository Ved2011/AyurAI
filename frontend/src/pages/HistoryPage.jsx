import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/layout/Sidebar";
import History from "@/components/ayur/History";
import Disclaimer from "@/components/ayur/Disclaimer";
import { History as HistoryIcon, Clock } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch (e) {} }
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl("/history"));
      setHistory(data);
    } catch (e) {
      toast.error("Could not load history");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(apiUrl(`/history/${id}`));
      setHistory((h) => h.filter((x) => x.id !== id));
      toast.success("Record deleted");
    } catch (e) {
      toast.error("Could not delete record");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F5EF]">
      <Sidebar user={user} onOpenAuth={() => setAuthOpen(true)} onLogout={logout} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
          {/* Page header */}
          <div className="mb-10 fade-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#3E6B4A]/10 text-[#3E6B4A] flex items-center justify-center">
                <HistoryIcon className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#3E6B4A] font-semibold">Health Timeline</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-[#1E2B21]">
              Saved Dosha Assessments
            </h1>
            <p className="text-sm text-[#5A6960] mt-3 max-w-xl">
              Track your Prakriti baseline readings and seasonal Vikriti shifts over time.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-[#5A6960] gap-3">
              <Clock className="w-5 h-5 animate-spin opacity-50" />
              <span className="text-sm">Loading your history…</span>
            </div>
          ) : (
            <History history={history} onDelete={handleDeleteHistory} />
          )}

          <div className="mt-16">
            <Disclaimer />
          </div>
        </div>
      </main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}
