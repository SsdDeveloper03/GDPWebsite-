import React from 'react';
import { Quote, Sparkles, MapPin, Eye, Target, MessageCircle, Briefcase, ExternalLink, ArrowUpRight } from 'lucide-react';
import { GDP_FOUNDER, GDP_CONTACT_INFO } from '../../data/mockData';

export const FounderSection: React.FC = () => {
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E2761]/70 border border-slate-200 dark:border-[#CADCFC]/20 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>The Human Story Behind GDP</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
          Born from Personal Struggle,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
            Built for Gujarat’s Leaders.
          </span>
        </h2>
      </div>

      {/* Main Founder Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        {/* Left Column: Founder Portrait & Credentials Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative group rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-[#CADCFC]/20 bg-white dark:bg-[#121936] shadow-xl dark:shadow-2xl">
            {/* Cinematic Studio Backdrop with Microphone Aesthetic */}
            <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-b from-[#1E2761]/40 via-[#0E1326] to-[#0B0F1D] flex items-center justify-center p-2.5">
              <img
                src="/bhavesh-chudasama-podcast.jpg"
                alt="Bhavesh Chudasama in GDP podcast studio with broadcast microphone"
                className="w-full h-full object-cover rounded-2xl filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: '70% 18%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1326] via-transparent to-transparent opacity-80" />

              {/* On-air Studio Live Badge */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1326]/85 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>GDP STUDIO • SURAT</span>
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0E1326]/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-left">
                <div className="pr-2">
                  <h3 className="text-base font-bold text-white font-serif">{GDP_FOUNDER.name}</h3>
                  <p className="text-[11px] font-semibold text-[#E9B13F]">
                    {GDP_FOUNDER.title}
                  </p>
                  <p className="text-xs text-[#CADCFC] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#D9A441]" />
                    {GDP_FOUNDER.location}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={GDP_FOUNDER.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D9A441]/20 hover:bg-[#D9A441] text-[#F2C94C] hover:text-[#0E1326] flex items-center justify-center transition-colors border border-[#D9A441]/40"
                    title="View Personal Portfolio & Tech Expertise"
                    aria-label="Bhavesh J. Chudasama Personal Portfolio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={GDP_FOUNDER.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#D9A441] text-white hover:text-[#0E1326] flex items-center justify-center transition-colors"
                    aria-label="Bhavesh J. Chudasama LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2761]/30 border border-slate-200 dark:border-[#CADCFC]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
            <span className="text-xs font-semibold text-slate-700 dark:text-[#CADCFC]">
              “Conversations That Drive Growth”
            </span>
            <div className="flex items-center gap-3">
              <a
                href={GDP_FOUNDER.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#1E2761] dark:text-[#F2C94C] hover:underline flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore My Journey</span>
              </a>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <a
                href={GDP_CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#C68A27] dark:text-[#D9A441] hover:underline flex items-center gap-1"
              >
                <span>Connect directly</span>
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Journey */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative pl-6 border-l-2 border-[#C68A27] dark:border-[#D9A441]">
            <Quote className="w-8 h-8 text-[#C68A27]/40 dark:text-[#D9A441]/40 mb-2" />
            <p className="text-lg sm:text-xl text-slate-900 dark:text-white font-serif italic leading-relaxed">
              “People know your company name. But in an era where trust is everything, do they know YOU? Your expertise deserves a voice.”
            </p>
          </div>

          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            {GDP_FOUNDER.story.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Portfolio Spotlight Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C68A27] dark:text-[#F2C94C] block">
                FOUNDER &amp; CEO · SUNRISE SOFTWARE DEVELOPMENT
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Bhavesh J. Chudasama's Tech Portfolio &amp; Leadership
              </h4>
            </div>
            <a
              href={GDP_FOUNDER.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow transition-colors shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Explore Portfolio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/15 text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-white block mb-1">Authentic Founder Commitment:</strong>
            We do not sell pre-packaged, artificial internet fame. We work hand-in-hand with business owners who have spent decades perfecting their craft and want to share their genuine journey.
          </div>
        </div>
      </div>

      {/* Vision & Mission Editorial Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-white/10">
        {/* Vision Block */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1E2761] to-[#0E1326] text-white border border-[#CADCFC]/20 relative overflow-hidden group shadow-xl">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E1326] border border-[#CADCFC]/20 flex items-center justify-center text-[#D9A441]">
              <Eye className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#D9A441] uppercase tracking-wider">
                OUR VISION
              </span>
              <h3 className="text-2xl font-bold text-white font-serif">
                A World Where Every Great Story is Heard
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#CADCFC]/90 leading-relaxed font-light">
              {GDP_FOUNDER.vision}
            </p>
          </div>
        </div>

        {/* Mission Block */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#121936] dark:to-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 relative overflow-hidden group shadow-md dark:shadow-xl transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#F2C94C]">
              <Target className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#C68A27] dark:text-[#F2C94C] uppercase tracking-wider">
                OUR MISSION
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">
                Turning Knowledge Into Meaningful Media
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {GDP_FOUNDER.mission}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
