import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard",    label: "Dashboard",          icon: LayoutDashboard },
  { path: "/analyze",      label: "Dosha Diagnostic",   icon: Sparkles },
  { path: "/routine",      label: "Dinacharya",         icon: Clock },
  { path: "/food-checker", label: "Food Compatibility", icon: Utensils },
  { path: "/history",      label: "Health History",     icon: History },
  { path: "/about",        label: "Ayurvedic Knowledge",icon: BookOpen },
];

export default function Sidebar({ user, onOpenAuth, onLogout }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("ayurai_sidebar_collapsed") === "true"; }
    catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem("ayurai_sidebar_collapsed", collapsed);
  }, [collapsed]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <aside
      className={`sidebar-panel ${collapsed ? "sidebar-collapsed" : ""} relative flex flex-col justify-between shrink-0 min-h-screen bg-[#1A2620] text-white select-none`}
      style={{ width: collapsed ? "72px" : "256px" }}
    >
      {/* ── Top section ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Brand */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="w-9 h-9 rounded-xl bg-[#3E6B4A] flex items-center justify-center text-white shadow-md shrink-0">
            <Leaf className="w-4.5 h-4.5" strokeWidth={2.2} />
          </span>
          {!collapsed && (
            <div className="sidebar-label overflow-hidden">
              <span className="font-display text-[22px] leading-none text-white block">
                Ayur<span className="italic font-normal text-[#7DB88A]">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-medium font-mono">
                Classical Suite
              </span>
            </div>
          )}
        </div>

        {/* User card */}
        <div className={`mx-3 mt-4 mb-2 rounded-2xl bg-white/5 border border-white/8 overflow-hidden ${collapsed ? "p-2.5" : "p-3.5"}`}>
          {user ? (
            <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2`}>
              {/* Avatar */}
              <div className={`shrink-0 rounded-xl bg-[#3E6B4A] flex items-center justify-center text-white font-bold text-xs shadow ${collapsed ? "w-9 h-9" : "w-8 h-8"}`}>
                {initials ?? <User className="w-4 h-4" />}
              </div>
              {!collapsed && (
                <div className="sidebar-label flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#7DB88A] block font-semibold leading-none mb-0.5">
                    Active
                  </span>
                  <span className="font-semibold text-sm text-white block truncate">
                    {user.name}
                  </span>
                </div>
              )}
              {!collapsed && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="sidebar-label shrink-0 p-1.5 rounded-lg bg-white/8 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Sign In"
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-[#3E6B4A] hover:bg-[#2F5238] text-white text-xs font-semibold transition-all ${collapsed ? "p-2" : "py-2.5 px-3"}`}
            >
              <User className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="sidebar-label">Sign In / Register</span>}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <span className="px-3 pt-1 pb-2 text-[9px] uppercase tracking-[0.18em] text-white/30 font-semibold block">
              Navigation
            </span>
          )}
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                className={`group relative flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-150
                  ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${active
                    ? "bg-[#3E6B4A] text-white shadow-md"
                    : "text-white/55 hover:text-white hover:bg-white/6"
                  }`}
              >
                {/* Active bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#7DB88A]" />
                )}
                <Icon
                  className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {!collapsed && (
                  <span className="sidebar-label">{label}</span>
                )}
                {/* Tooltip on collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#1A2620] border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom ── */}
      <div className="px-2 pb-4 space-y-2">
        {/* Logout when collapsed */}
        {collapsed && user && (
          <button
            onClick={onLogout}
            title="Sign Out"
            className="w-full flex justify-center py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

        {/* Safety badge */}
        {!collapsed && (
          <div className="sidebar-label mx-1 p-3 rounded-xl bg-white/4 border border-white/8 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#7DB88A]" />
            <span className="text-[10px] leading-snug text-white/40">
              Charaka Samhita Standards
            </span>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-full flex items-center rounded-xl py-2.5 text-white/40 hover:text-white hover:bg-white/6 transition-all text-xs font-medium ${collapsed ? "justify-center" : "gap-2 px-3"}`}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <>
                <ChevronLeft className="w-4 h-4" />
                <span className="sidebar-label">Collapse</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
