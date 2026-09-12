import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X, User, Mail, Lock } from "lucide-react";
import { apiUrl } from "@/lib/api";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const { data } = await axios.post(apiUrl(endpoint), payload);
      localStorage.setItem("ayurai_token", data.token);
      localStorage.setItem("ayurai_user", JSON.stringify(data.user));
      toast.success(isLogin ? `Welcome back, ${data.user.name}!` : "Account created successfully!");
      onAuthSuccess && onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E2E4DF] rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#5C6B61] hover:text-[#2C362F] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-3xl text-[#2C362F] mb-2">
          {isLogin ? "Welcome to AyurAI" : "Create Profile"}
        </h3>
        <p className="text-xs uppercase tracking-[0.2em] text-[#5C6B61] mb-6">
          {isLogin ? "Sign in to access saved health histories" : "Join for persistent dosha tracking"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#5C6B61] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-[#5C6B61]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E2E4DF] focus:outline-none focus:border-[#4A7C59] text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5C6B61] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#5C6B61]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E2E4DF] focus:outline-none focus:border-[#4A7C59] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5C6B61] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#5C6B61]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9F6F0] border border-[#E2E4DF] focus:outline-none focus:border-[#4A7C59] text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-full bg-[#4A7C59] hover:bg-[#3B6347] text-white text-sm font-semibold transition-all shadow-md disabled:opacity-60"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#5C6B61]">
          {isLogin ? "Don't have a profile yet? " : "Already registered? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-[#4A7C59] underline underline-offset-2"
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
