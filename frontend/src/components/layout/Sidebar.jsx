import { Link, useLocation } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  Sparkles,
  Clock,
  Utensils,
  History,
  BookOpen,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({ user, onOpenAuth, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analyze", label: "Dosha Diagnostic", icon: Sparkles },
    { path: "/routine", label: "Dinacharya Routine", icon: Clock },
    { path: "/food-checker", label: "Food Compatibility", icon: Utensils },
    { path: "/history", label: "Health History", icon: History },
    { path: "/about", label: "Ayurvedic Knowledge", icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-[#2C362F] text-white flex flex-col justify-between p-6 shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 mb-8 px-2">
          <span className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5" />
          </span>
          <div>
            <span className="font-display text-2xl tracking-tight text-white block leading-none">
              Ayur<span className="italic font-normal text-[#A3B18A]">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A3B18A]/80 font-mono">Classical Health Suite</span>
          </div>
        </Link>

        {/* User Card */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A3B18A] block font-semibold">Active Member</span>
                <span className="font-semibold text-sm text-white block truncate max-w-[130px]">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3B6347] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <span className="px-3 text-[10px] uppercase tracking-widest text-[#A3B18A]/60 font-semibold block mb-2">Main Navigation</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#4A7C59] text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Safety Badge */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#A3B18A] flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 text-[#4A7C59]" />
        <span className="text-[11px] leading-tight">Authentic Charaka Samhita Diagnostic Standards</span>
      </div>
    </aside>
  );
}
