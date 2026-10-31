import React from 'react';
import { MessageCircle, MapPin, Eye, Target, Sparkles, Briefcase, ExternalLink, ArrowUpRight } from 'lucide-react';
import { GDP_FOUNDER, GDP_CONTACT_INFO } from '../data/mockData';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      {/* =========================================================================
          1. ABOUT HERO
          ========================================================================= */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E2761]/80 border border-slate-200 dark:border-[#CADCFC]/20 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>ABOUT GROWTH KA DIGITAL PARTNER</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-[#C68A27] dark:text-[#F2C94C] font-medium">SURAT, GUJARAT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] font-serif">
          Engineering Thought Leadership,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
            One Conversation at a Time.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-[#CADCFC]/90 leading-relaxed font-light">
          Growth Ka Digital Partner (GDP) was founded in Surat by <strong>Bhavesh J. Chudasama</strong> (Founder &amp; CEO of Sunrise Software Development) on a singular conviction: Gujarat’s business owners and domain experts possess extraordinary wisdom — they just need an approachable, world-class studio and strategic media partner to share it.
        </p>
      </section>

      {/* =========================================================================
          2. THE FOUNDER'S REAL STORY
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white dark:bg-[#0B0F1D] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl dark:shadow-2xl transition-colors">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-slate-200 dark:border-[#CADCFC]/20 shadow-2xl">
            <img
              src="/bhavesh-chudasama-podcast.jpg"
              alt="Bhavesh J. Chudasama — Founder & CEO of Sunrise Software Development and Host of GDP Podcast"
              className="w-full h-full object-cover filter brightness-95"
              style={{ objectPosition: '70% 18%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1326] via-transparent to-transparent opacity-80" />
            
            {/* Studio Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1326]/85 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>GDP STUDIO • 4K ON-AIR</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0E1326]/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-left">
              <div className="pr-2">
                <h3 className="text-base font-bold text-white font-serif">{GDP_FOUNDER.name}</h3>
                <p className="text-xs text-[#D9A441]">{GDP_FOUNDER.title}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D9A441]" />
                  {GDP_FOUNDER.location}
                </p>
              </div>
              <a
                href={GDP_FOUNDER.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#D9A441]/20 hover:bg-[#D9A441] text-[#F2C94C] hover:text-[#0E1326] flex items-center justify-center transition-colors border border-[#D9A441]/40 shrink-0"
                title="View Personal Portfolio"
                aria-label="Bhavesh J. Chudasama Personal Portfolio"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#D9A441]">
            FOUNDER STATEMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
            Why I Created Growth Ka Digital Partner
          </h2>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            {GDP_FOUNDER.story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <a
              href={GDP_FOUNDER.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-md transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore My Journey &amp; Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={GDP_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current text-emerald-500" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. VISION AND MISSION
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#1E2761]/70 dark:to-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 shadow-lg dark:shadow-xl space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441]">
            <Eye className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#C68A27] dark:text-[#D9A441] uppercase tracking-wider block">
            OUR VISION
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
            Democratizing Thought Leadership
          </h3>
          <p className="text-sm text-slate-600 dark:text-[#CADCFC]/90 leading-relaxed font-light">
            {GDP_FOUNDER.vision}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#121936] dark:to-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 shadow-lg dark:shadow-xl space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#F2C94C]">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#C68A27] dark:text-[#F2C94C] uppercase tracking-wider block">
            OUR MISSION
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
            Authentic Media, Zero Vanity
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            {GDP_FOUNDER.mission}
          </p>
        </div>
      </section>

      {/* =========================================================================
          4. FOUR CORE OPERATING PRINCIPLES
          ========================================================================= */}
      <section className="space-y-10">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#D9A441]">
            ETHOS & STANDARDS
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">
            How We Operate Differently
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-sm hover:shadow-md transition-all space-y-3">
            <span className="text-2xl font-serif text-[#C68A27] dark:text-[#D9A441]">01</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">Authenticity Over Hype</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              We never ask you to perform unnatural gimmicks or dance on camera. We capture your real voice and authentic intellectual mastery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-sm hover:shadow-md transition-all space-y-3">
            <span className="text-2xl font-serif text-[#C68A27] dark:text-[#F2C94C]">02</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">Deep Conversational Empathy</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              Bhavesh moderates each session with guided warmth. It feels like an inspiring boardroom coffee chat, completely stress-free.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-sm hover:shadow-md transition-all space-y-3">
            <span className="text-2xl font-serif text-[#1E2761] dark:text-[#CADCFC]">03</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">Broadcast-Grade Quality</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              Multi-angle 4K cameras, calibrated studio acoustic treatment, broadcast microphones, and color grading for cinematic presence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 shadow-sm hover:shadow-md transition-all space-y-3">
            <span className="text-2xl font-serif text-[#C68A27] dark:text-[#D9A441]">04</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">Turnkey Repurposing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              One 45-minute recording delivers full YouTube episodes, 15+ vertical reels, YouTube shorts, and LinkedIn quotes ready for syndication.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CALL TO ACTION
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1E2761] via-[#161F4D] to-[#0E1326] border border-[#CADCFC]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-white">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Start Your Personal Branding Journey Today
          </h3>
          <p className="text-xs sm:text-sm text-[#CADCFC]">
            Visit our studio in Surat, Gujarat or connect directly with Bhavesh to plan your inaugural episode.
          </p>
        </div>
        <a
          href={GDP_CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-gradient-to-r from-[#F2C94C] to-[#D9A441] hover:brightness-105 shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp ‘PODCAST’ Now</span>
        </a>
      </section>
    </div>
  );
};
