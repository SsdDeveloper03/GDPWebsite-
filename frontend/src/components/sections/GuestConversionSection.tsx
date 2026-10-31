import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, Mic, Video as VideoIcon, Share2, Calendar } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';

export const GuestConversionSection: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#10172E] via-[#141B36] to-[#0A0E1C] border border-[#CADCFC]/15 p-8 sm:p-14 text-white shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30 text-[#F2C94C] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>GUEST OPPORTUNITY · GDP PODCAST SURAT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-tight">
            Your Experience Could Inspire Someone.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Whether you have scaled a manufacturing unit, built a specialized healthcare practice, or led an innovative enterprise in Gujarat — your hard-won insights hold value. Step into our studio and turn your story into an enduring personal brand.
          </p>
        </div>

        {/* 3 Pillars of Studio Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E9B13F]">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-serif">Zero-Script Conversation</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              No pressure or memorization. Bhavesh guides you through an empathetic, comfortable dialogue.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E9B13F]">
              <VideoIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-serif">Cinema Multi-Cam & Audio</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Recorded in Surat with broadcast condenser microphones, flattering studio lighting, and 4K cameras.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E9B13F]">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-serif">Turnkey Content Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Receive the full master episode plus viral-ready short reels formatted for LinkedIn and Instagram.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a
            href={GDP_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-4 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#E9B13F] hover:bg-[#F2C45F] shadow-lg shadow-[#E9B13F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Become a Guest — WhatsApp Topic</span>
          </a>

          <a
            href="#contact"
            className="px-6 py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#E9B13F]" />
            <span>Build Your Personal Brand</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
