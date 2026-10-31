import React from 'react';
import { Sparkles, MessageCircle, Play, ArrowRight, Mic } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';

export const ClosingConversionSection: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1024] via-[#121A35] to-[#0A0E1C] border border-[#CADCFC]/15 p-8 sm:p-14 lg:p-16 text-white shadow-2xl reveal-on-scroll">
        {/* Ambient Warm Gold Lighting Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#1E2761]/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/30 text-[#F4CC69] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F4CC69]" />
            <span>JOIN US IN THE STUDIO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-tight tracking-tight">
            Have a Story Worth Sharing?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Start a conversation with Growth Ka Digital Partner and explore the possibility of joining us as a podcast guest.
          </p>

          <p className="text-xs sm:text-sm text-[#CADCFC]/80 font-mono tracking-wide pt-1">
            "Your Journey Could Inspire Someone's Next Chapter."
          </p>

          {/* Dual Primary & Secondary CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Primary CTA */}
            <a
              href="#become-a-guest"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('become-a-guest')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl font-bold text-sm text-[#0B1024] bg-gradient-to-r from-[#F4CC69] via-[#D9A441] to-[#C68A27] hover:opacity-95 shadow-xl shadow-[#D9A441]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4 fill-current text-[#0B1024]" />
              <span>Become a Guest</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary CTA */}
            <a
              href="#podcasts"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('podcasts')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-4 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-[#D9A441]/50 shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#D9A441]" />
              <span>Watch the Podcast</span>
            </a>

            {/* Direct WhatsApp Quick Chat */}
            <a
              href={GDP_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-emerald-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Quick WhatsApp Enquiry</span>
            </a>
          </div>
        </div>

        {/* Reassurance Footer Strip */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#AAB4CB]">
          <span>RECORDED AT SURAT STUDIO, GUJARAT</span>
          <span className="hidden sm:inline">ZERO SCRIPTING REQUIRED · GUIDED BY BHAVESH CHUDASAMA</span>
        </div>
      </div>
    </section>
  );
};
