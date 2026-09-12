import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AyurAI from "@/pages/AyurAI";
import WelcomePage from "@/pages/WelcomePage";
import DashboardPage from "@/pages/DashboardPage";
import RoutinePage from "@/pages/RoutinePage";
import FoodCheckerPage from "@/pages/FoodCheckerPage";
import HistoryPage from "@/pages/HistoryPage";
import AboutPage from "@/pages/AboutPage";
import AuthModal from "@/components/auth/AuthModal";

function App() {
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ayurai_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <WelcomePage onOpenAuth={() => setAuthOpen(true)} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze" element={<AyurAI />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/food-checker" element={<FoodCheckerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
    </div>
  );
}

export default App;
