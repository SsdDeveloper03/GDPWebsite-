import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';

export const HonestPositioningSection: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-[#1E2761] via-[#121936] to-[#0E1326] border-2 border-[#D9A441]/30 shadow-2xl">
        {/* Decorative Gold Glow in Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#F2C94C] text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
            <span>The GDP Philosophy on Growth</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-serif">
            We Don't Chase Numbers.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F2C94C] to-[#D9A441]">
              We Chase Genuine Audiences.
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#CADCFC] font-light leading-relaxed">
            “Views and followers can be misleading. Trust is earned through useful conversations, honest storytelling, and consistent value.”
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="space-y-2 p-4 rounded-xl bg-black/20 border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D9A441] uppercase">
                <HeartHandshake className="w-4 h-4" />
                <span>Zero Gimmicks</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We refuse to rely on rage-bait, false controversies, or cheap algorithmic shortcuts that damage your long-term reputation.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-black/20 border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2C94C] uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Substance Over Noise</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every conversation is framed around actionable wisdom, practical lessons, and genuine experiences your peers value.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-black/20 border border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#CADCFC] uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Enduring Equity</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A high-quality podcast episode published today continues to win customer trust, talent, and respect for years to come.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href={GDP_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-gradient-to-r from-[#F2C94C] via-[#D9A441] to-[#E5A93B] shadow-lg shadow-[#D9A441]/20 hover:scale-[1.02] transition-transform"
            >
              <span>Speak Directly with Bhavesh</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <span className="text-xs text-[#CADCFC]/70">
              Personalized strategy • Surat studio visits by appointment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
