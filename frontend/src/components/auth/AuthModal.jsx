import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X, User, Mail, Lock, Leaf, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Input details, 2: OTP Verification
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setStep(1);
    setName("");
    setEmail("");
    setPassword("");
    setOtp("");
    setDemoOtp("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(apiUrl("/auth/send-otp"), { name, email, password });
      setDemoOtp(data.otpDemo || "");
      setStep(2);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to send verification code";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(apiUrl("/auth/verify-otp"), { email, otp });
      localStorage.setItem("ayurai_token", data.token);
      localStorage.setItem("ayurai_user", JSON.stringify(data.user));
      toast.success(`Account verified! Welcome, ${data.user.name}!`);
      onAuthSuccess && onAuthSuccess(data.user);
      handleResetForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(apiUrl("/auth/login"), { email, password });
      localStorage.setItem("ayurai_token", data.token);
      localStorage.setItem("ayurai_user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      onAuthSuccess && onAuthSuccess(data.user);
      handleResetForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,18,13,0.6)", backdropFilter: "blur(8px)" }}
    >
      <div className="scale-in bg-white rounded-[28px] overflow-hidden w-full max-w-[820px] shadow-2xl flex">

        {/* ── Left art panel ── */}
        <div
          className="hidden md:flex flex-col justify-between p-10 w-[340px] shrink-0"
          style={{
            background: "linear-gradient(145deg, #1A2620 0%, #243328 50%, #1A2620 100%)",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#3E6B4A] flex items-center justify-center text-white shadow-md">
              <Leaf className="w-4 h-4" strokeWidth={2.2} />
            </span>
            <span className="font-display text-2xl text-white leading-none">
              Ayur<span className="italic font-normal text-[#7DB88A]">AI</span>
            </span>
          </div>

          {/* Decorative dosha rings */}
          <div className="flex flex-col gap-5 my-8">
            {[
              { name: "Vata", el: "Air & Ether", color: "#C8A96A", pct: 72 },
              { name: "Pitta", el: "Fire & Water", color: "#C05540", pct: 55 },
              { name: "Kapha", el: "Earth & Water", color: "#3E6B4A", pct: 38 },
            ].map(({ name, el, color, pct }) => (
              <div key={name} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-white text-xs font-semibold">{name}</span>
                  <span className="text-white/40 text-[10px]">{el}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div>
            <p className="text-white/50 text-xs leading-relaxed italic border-l-2 border-[#3E6B4A] pl-3">
              "सर्वे भवन्तु सुखिनः" — May all beings be well and happy.
            </p>
            <p className="text-white/25 text-[10px] mt-3">Classical Ayurvedic Health Suite</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 p-8 md:p-10 relative">
          <button
            onClick={() => {
              handleResetForm();
              onClose();
            }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F0EDE7] hover:bg-[#DFE1DB] text-[#5A6960] hover:text-[#1E2B21] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Tab switcher */}
          <div className="inline-flex p-1 rounded-full bg-[#EDEDE8] border border-[#DFE1DB] mb-8">
            {["Sign In", "Register"].map((label, i) => {
              const active = isLogin === (i === 0);
              return (
                <button
                  key={label}
                  onClick={() => {
                    setIsLogin(i === 0);
                    setStep(1);
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-white text-[#1E2B21] shadow-sm"
                      : "text-[#5A6960] hover:text-[#1E2B21]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <h3 className="font-display text-3xl text-[#1E2B21] mb-1">
            {isLogin
              ? "Welcome back"
              : step === 1
              ? "Create Profile"
              : "Verify Email"}
          </h3>
          <p className="text-xs text-[#5A6960] mb-7">
            {isLogin
              ? "Sign in to access your saved health histories"
              : step === 1
              ? "Join for persistent dosha tracking across sessions"
              : `We sent a 6-digit verification OTP to ${email || "your email"}`}
          </p>

          {isLogin ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6960]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6960]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sign In
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : step === 1 ? (
            /* Register Step 1 Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6960]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6960]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A6960]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending OTP…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Send Verification Code
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Step 2: 6-Digit OTP Form */
            <form onSubmit={handleVerifyOtp} className="space-y-5">

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-[#5A6960] font-semibold">Enter 6-Digit Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3E6B4A]" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8F5EF] border border-[#DFE1DB] focus:outline-none focus:border-[#3E6B4A] focus:ring-2 focus:ring-[#3E6B4A]/15 text-lg font-mono tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5A6960]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:underline text-[#3E6B4A]"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="flex items-center gap-1 hover:underline text-[#3E6B4A] disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#3E6B4A] hover:bg-[#2F5238] disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Verify & Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-[#5A6960]">
            {isLogin ? "Don't have a profile yet? " : "Already registered? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep(1);
              }}
              className="font-semibold text-[#3E6B4A] hover:underline underline-offset-2"
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
