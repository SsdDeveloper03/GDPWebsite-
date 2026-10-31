import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  Video,
  Repeat,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { GDP_SERVICES, GDP_CONTACT_INFO } from '../data/mockData';

export const ServicesPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need prior public speaking or on-camera experience?',
      a: 'Not at all. In fact, most of our best guests and clients are first-time podcast guests. Bhavesh guides the conversation with empathetic questions, so it feels like a relaxed, natural conversation between friends rather than an interrogation.',
    },
    {
      q: 'Where is the GDP podcast studio located?',
      a: 'Our studio is based right in Surat, Gujarat. We provide a comfortable, acoustically treated environment equipped with multi-camera 4K cinema cameras and broadcast condenser microphones.',
    },
    {
      q: 'What deliverables do I get from a single podcast session?',
      a: 'From a single 45-minute recording session, you receive: the full master 4K YouTube episode with pro audio sweetening, 5 to 15 vertical short-form reels with animated captions for Instagram & YouTube Shorts, and quote cards for LinkedIn thought leadership.',
    },
    {
      q: 'How do we prepare before recording in the studio?',
      a: 'During our Discovery Phase, we outline your key stories, core lessons, and conversational structure. You receive prompt questions in advance so you arrive confident, relaxed, and ready.',
    },
  ];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-7 h-7 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'Repeat':
        return <Repeat className="w-7 h-7 text-[#C68A27] dark:text-[#F2C94C]" />;
      case 'Compass':
        return <Compass className="w-7 h-7 text-[#1E2761] dark:text-[#CADCFC]" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#C68A27] dark:text-[#D9A441]" />;
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      {/* =========================================================================
          1. SERVICES HERO
          ========================================================================= */}
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E2761]/80 border border-slate-200 dark:border-[#CADCFC]/25 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>PRODUCTION & PERSONAL BRANDING CAPABILITIES</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] font-serif">
          Turnkey Media for the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
            Gujarat Business Leader.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-[#CADCFC]/90 leading-relaxed font-light">
          From 4K multi-camera studio production in Surat to viral vertical reels and strategic positioning, we run your entire personal branding machine.
        </p>

        <div className="pt-2">
          <a
            href={GDP_CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/25 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Book Studio Discovery Session</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          2. DETAILED SERVICE BLOCKS
          ========================================================================= */}
      <section className="space-y-12">
        {GDP_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/50 shadow-lg dark:shadow-xl backdrop-blur-md transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Icon & Core Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center">
                  {getServiceIcon(srv.iconName)}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#D9A441]">
                    {srv.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif leading-snug">
                    {srv.title}
                  </h2>
                  <p className="text-xs font-semibold text-[#1E2761] dark:text-[#CADCFC]">{srv.subtitle}</p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">{srv.description}</p>

                <div className="pt-2">
                  <span className="text-xs text-slate-700 dark:text-[#CADCFC] block">
                    <strong>Ideal for:</strong> {srv.idealFor}
                  </span>
                </div>
              </div>

              {/* Right Column: Deliverables */}
              <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0E1326] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#CADCFC] block font-serif">
                  Turnkey Deliverables:
                </span>

                <ul className="space-y-3">
                  {srv.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-[#C68A27] dark:text-[#D9A441] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Complete studio execution</span>
                  <a
                    href={GDP_CONTACT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#C68A27] dark:text-[#D9A441] hover:underline flex items-center gap-1"
                  >
                    <span>Inquire about this capability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* =========================================================================
          3. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#D9A441]">
            QUESTIONS & CLARITY
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-sm overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-serif">{faq.q}</span>
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#0E1326] flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] shrink-0">
                  {openFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {openFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light border-t border-slate-100 dark:border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. CTA CONVERSION BANNER
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1E2761] via-[#161F4D] to-[#0E1326] border border-[#CADCFC]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-white">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Ready to Record Your Inaugural Episode?
          </h3>
          <p className="text-xs sm:text-sm text-[#CADCFC]">
            Step into our studio in Surat, Gujarat. We take care of all production — you bring your expertise.
          </p>
        </div>
        <a
          href={GDP_CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp ‘PODCAST’ to Book</span>
        </a>
      </section>
    </div>
  );
};
