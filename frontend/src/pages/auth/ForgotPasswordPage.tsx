import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, Info } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-md mx-auto px-4 text-left transition-colors duration-300">
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl dark:shadow-2xl backdrop-blur-xl space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C68A27] dark:text-[#D9A441] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-serif">Reset Account Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter the work email associated with your verified GDP client account.
          </p>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-[#C68A27] dark:text-amber-400 mt-0.5" />
          <span>
            <strong>Prototype Flow:</strong> Email verification will be dispatched via your configured SMTP server when backend email integration is activated.
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {sent ? (
          <div className="p-6 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">Instructions Sent</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              If an active client profile matches <strong>{email}</strong>, a secure password reset token has been generated.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-xs font-semibold text-[#C68A27] dark:text-[#D9A441] hover:underline pt-2 block mx-auto cursor-pointer"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
