import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import History from "@/components/ayur/History";
import Disclaimer from "@/components/ayur/Disclaimer";
import { apiUrl } from "@/lib/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadHistory();
  }, []);

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
    <div className="min-h-screen bg-[#F9F6F0]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.22em] text-[#4A7C59] font-semibold">Health Timeline</span>
          <h1 className="font-display text-4xl md:text-5xl text-[#2C362F] mt-2">Saved Health & Dosha Assessments</h1>
          <p className="text-sm text-[#5C6B61] mt-3">
            Track your Prakriti baseline readings and seasonal Vikriti shifts over time.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#5C6B61]">Loading history...</div>
        ) : (
          <History history={history} onDelete={handleDeleteHistory} />
        )}

        <div className="mt-16">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
