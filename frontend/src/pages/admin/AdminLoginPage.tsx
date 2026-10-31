import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated as ADMIN, redirect immediately to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const destination = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your administrator email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your administrator password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ email: trimmedEmail, password });
      const destination = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(destination, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid administrator credentials. Access denied.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1C] text-slate-400">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-[#D9A441]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B0F1C] text-slate-100 relative overflow-hidden selection:bg-[#D9A441] selection:text-[#0E1326]">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D9A441]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#1E2761]/30 rounded-full blur-[110px] pointer-events-none" />

      {/* Back to Public Site link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#D9A441] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to GDP Podcast Website</span>
        </Link>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Encrypted Portal</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-[#121729]/90 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D9A441] via-[#F2C94C] to-[#1E2761] p-[2px] shadow-lg shadow-[#D9A441]/20 mx-auto mb-4">
            <div className="w-full h-full bg-[#0E1326] rounded-[14px] flex items-center justify-center">
              <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F2C94C]">
                GDP
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white font-serif tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Growth Ka Digital Partner &bull; Content & Operations
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gdppodcast.com"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#090D1A] border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSubmitting}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#090D1A] border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0E1326]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Internal administration area. Authorized personnel only.
            <br />
            All session actions are logged to SQL Server audit records.
          </p>
        </div>
      </div>
    </div>
  );
};
