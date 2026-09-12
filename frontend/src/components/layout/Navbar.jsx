import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, User, LogOut, Sparkles, Clock, Utensils, BookOpen, History, Info } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const location = useLocation();
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

  const logout = () => {
    localStorage.removeItem("ayurai_token");
    localStorage.removeItem("ayurai_user");
    setUser(null);
  };

  const navLinks = [
    { path: "/", label: "Dosha Analysis", icon: Sparkles },
    { path: "/routine", label: "Dinacharya Routine", icon: Clock },
    { path: "/food-checker", label: "Food Compatibility", icon: Utensils },
    { path: "/history", label: "Health History", icon: History },
    { path: "/about", label: "About Ayurveda", icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F9F6F0]/85 border-b border-[#E2E4DF]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-[#4A7C59] flex items-center justify-center text-white shadow-sm">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-display text-2xl tracking-tight text-[#2C362F]">
              Ayur<span className="italic font-normal">AI</span>
            </span>
          </Link>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ECEDE8] p-1.5 rounded-full border border-[#E2E4DF]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#2C362F] text-white shadow-sm"
                      : "text-[#5C6B61] hover:text-[#2C362F] hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-medium text-[#2C362F]">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-full bg-[#ECEDE8] hover:bg-[#E2E4DF] text-[#5C6B61] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-2 border-t border-[#E2E4DF] bg-[#F9F6F0]">
          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  active ? "bg-[#2C362F] text-white" : "bg-[#ECEDE8] text-[#5C6B61]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </>
  );
}
