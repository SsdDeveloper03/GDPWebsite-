import React from 'react';
import {
  Sparkles,
  MapPin,
  Briefcase,
  ArrowUpRight,
  Play,
  Mic,
  ArrowRight,
  Code2,
  Cpu,
  Layout,
  TrendingUp,
  Radio,
  MessageCircle,
  Compass,
  Quote,
} from 'lucide-react';
import { GDP_FOUNDER, GDP_CONTACT_INFO } from '../../data/mockData';

export const MeetTheHostSection: React.FC = () => {
  const verifiedPortfolioUrl = GDP_FOUNDER.portfolioUrl || 'https://share.google/mN8Hwet0sf0dFvcgx';

  const handleScrollTo = (elementId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const expertiseHighlights = [
    {
      title: 'Software & Product Development',
      description: 'Custom scalable architecture, enterprise software engineering, and modern digital applications.',
      icon: Code2,
    },
    {
      title: 'Business Software Solutions',
      description: 'Specialized enterprise ERPs, business workflow automation, and operational digital systems.',
      icon: Cpu,
    },
    {
      title: 'Website Design & Development',
      description: 'Modern high-performance web platforms, corporate digital presence, and user-centric web design.',
      icon: Layout,
    },
    {
      title: 'Business, Technology & Entrepreneurship',
      description: 'Technology leadership, entrepreneurship guidance, and bridging technical execution with venture growth.',
      icon: TrendingUp,
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20 relative isolate">
      {/* Deep Link Anchors */}
      <div id="meet-the-host" className="scroll-mt-24" />

      {/* Subtle Ambient Studio Lighting Accent */}
      <div className="absolute top-1/3 -left-16 w-80 h-80 bg-[#C68A27]/5 dark:bg-[#D9A441]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#1E2761]/10 dark:bg-[#1E2761]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Eyebrow & Main Heading with Gold Accent Underline */}
      <div className="max-w-3xl space-y-4 mb-14 sm:mb-16 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#D9A441]/10 border border-slate-200 dark:border-[#D9A441]/30 text-[#1E2761] dark:text-[#F2C94C] text-xs font-bold tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>MEET THE HOST</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
            Behind Every Great Conversation Is a Story.
          </h2>
          {/* Refined Gold Underline Accent */}
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-[#C68A27] via-[#D9A441] to-transparent rounded-full" />
        </div>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/85 leading-relaxed font-light">
          Welcome to GDP Podcast. Here is who I am, what I build, and why I believe in the transformative power of authentic conversations.
        </p>
      </div>

      {/* Main Grid: Portrait and First-Person Editorial Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column (5 Cols): Cinematic Portrait with Sound-Wave & Studio Badges */}
        <div className="lg:col-span-5 space-y-5 reveal-on-scroll">
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-[#C68A27]/40 dark:hover:border-[#D9A441]/40 bg-white dark:bg-[#10172E] shadow-2xl transition-all duration-500">
            {/* Portrait with Natural Proportions (Never Stretched or Distorted) */}
            <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-b from-[#10172E]/40 to-[#070A14] p-3">
              <img
                src="/bhavesh-chudasama-podcast.jpg"
                alt="Bhavesh J. Chudasama — Founder & CEO of Sunrise Software Development and Host of GDP Podcast"
                className="w-full h-full object-cover rounded-2xl filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: '70% 18%' }}
                loading="lazy"
              />

              {/* Gradient Vignette for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080C18] via-[#080C18]/30 to-transparent opacity-85 pointer-events-none" />

              {/* Top-Left: Live Studio Badge */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1326]/85 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>SURAT STUDIO · ON AIR</span>
              </div>

              {/* Top-Right: Tasteful Microphone & Sound-Wave Detail */}
              <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E1326]/85 backdrop-blur-md border border-white/15 text-white shadow-lg">
                <Mic className="w-3.5 h-3.5 text-[#E9B13F]" />
                <div className="flex items-end gap-0.5 h-3.5 px-0.5" aria-label="Audio waveform indicator">
                  <span className="w-0.5 bg-[#E9B13F] rounded-full audio-bar-1" />
                  <span className="w-0.5 bg-[#E9B13F] rounded-full audio-bar-2" />
                  <span className="w-0.5 bg-[#E9B13F] rounded-full audio-bar-3" />
                  <span className="w-0.5 bg-[#E9B13F] rounded-full audio-bar-4" />
                </div>
              </div>

              {/* Bottom Card Strip Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0E1326]/92 backdrop-blur-md border border-white/15 flex items-center justify-between text-left shadow-2xl">
                <div className="pr-2 space-y-0.5">
                  <h3 className="text-base font-bold text-white font-serif tracking-tight">
                    {GDP_FOUNDER.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#E9B13F]">
                    {GDP_FOUNDER.title}
                  </p>
                  <p className="text-[11px] text-[#CADCFC]/80 flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-[#D9A441]" />
                    {GDP_FOUNDER.location}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* YouTube Channel */}
                  <a
                    href="https://www.youtube.com/@gdppodcast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-colors border border-red-500/30 shadow-sm"
                    aria-label="GDP YouTube Channel (@gdppodcast)"
                    title="GDP YouTube Channel (@gdppodcast)"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/gdptalks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white flex items-center justify-center transition-colors border border-pink-500/30 shadow-sm"
                    aria-label="GDP Instagram (@gdptalks)"
                    title="GDP Instagram (@gdptalks)"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-colors border border-blue-500/30 shadow-sm"
                    aria-label="Bhavesh J. Chudasama LinkedIn profile"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>

                  {/* Verified Personal Portfolio Link */}
                  <a
                    href={verifiedPortfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#D9A441]/20 hover:bg-[#D9A441] text-[#F2C94C] hover:text-[#0E1326] flex items-center justify-center transition-all border border-[#D9A441]/40 shadow-sm"
                    title="Explore My Journey (Bhavesh J. Chudasama Portfolio)"
                    aria-label="Explore My Journey"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Portrait Status Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151D38]/80 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#E9B13F]" />
              <span className="font-semibold text-slate-700 dark:text-[#CADCFC]">
                Host of GDP Podcast · Surat Studio
              </span>
            </div>
            <a
              href={GDP_CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#C68A27] dark:text-[#D9A441] hover:underline flex items-center gap-1.5"
            >
              <span>Connect with Me on WhatsApp</span>
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </a>
          </div>
        </div>

        {/* Right Column (7 Cols): First-Person Narrative with Structured Headings */}
        <div className="lg:col-span-7 space-y-7 reveal-on-scroll">
          {/* Host Role Header Block */}
          <div className="space-y-1 pb-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#C68A27] dark:text-[#E9B13F]">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{GDP_FOUNDER.title}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
              {GDP_FOUNDER.name}
            </h3>
          </div>

          {/* 1. MY JOURNEY */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#E9B13F]">
              <Compass className="w-3.5 h-3.5" />
              <span>My Journey</span>
            </div>
            <div className="relative pl-5 sm:pl-6 border-l-2 border-[#C68A27] dark:border-[#D9A441] space-y-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                I am <strong>Bhavesh J. Chudasama</strong>, Founder &amp; CEO of Sunrise Software Development. Over the past 15+ years, my career in technology, enterprise software, and business solutions has given me a close look at the challenges businesses face and the massive opportunities technology can create.
              </p>
              <p>
                From building custom ERP platforms across manufacturing, textiles, logistics, and retail to guiding digital transformation roadmaps, I have learned that lasting business success requires not just robust code, but deep clarity, disciplined execution, and strong human relationships.
              </p>
            </div>
          </div>

          {/* 2. MY PERSPECTIVE */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#E9B13F]">
              <Quote className="w-3.5 h-3.5" />
              <span>My Perspective</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-2 text-sm sm:text-base leading-relaxed">
              <p className="font-serif italic text-slate-900 dark:text-white">
                “Through GDP Podcast, I want to go beyond titles, awards, and surface achievements to explore the people, experiences, decisions, challenges, and ideas behind every journey.”
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#CADCFC]/85 font-light">
                Because every meaningful conversation has the power to share knowledge, inspire new thinking, and create genuine opportunities for leaders and entrepreneurs.
              </p>
            </div>
          </div>

          {/* 3. MY EXPERTISE */}
          <div className="space-y-3 pt-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C68A27] dark:text-[#E9B13F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>My Expertise</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {expertiseHighlights.map((exp, idx) => {
                const IconComponent = exp.icon;
                return (
                  <div
                    key={exp.title}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151D38]/85 border border-slate-200 dark:border-white/10 hover:border-[#C68A27]/50 dark:hover:border-[#E9B13F]/50 transition-all duration-300 hover:-translate-y-0.5 group/card shadow-sm hover:shadow-md reveal-stagger-${idx + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-[#10172E] border border-slate-200 dark:border-[#CADCFC]/15 flex items-center justify-center text-[#C68A27] dark:text-[#E9B13F] group-hover/card:scale-110 transition-transform shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-serif group-hover/card:text-[#C68A27] dark:group-hover/card:text-[#E9B13F] transition-colors leading-tight">
                          {exp.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug font-light">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. THREE CLEAR ACTION BUTTONS */}
          <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-3.5">
            {/* Button 1: Explore My Journey */}
            <a
              href={verifiedPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0B1024] bg-gradient-to-r from-[#F4CC69] via-[#D9A441] to-[#C68A27] hover:opacity-95 shadow-lg shadow-[#D9A441]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore My Journey</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Button 2: Watch My Conversations */}
            <a
              href="#podcasts"
              onClick={handleScrollTo('podcasts')}
              className="px-5 sm:px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-[#151D38] hover:bg-slate-200 dark:hover:bg-[#1C2649] border border-slate-200 dark:border-white/10 hover:border-[#C68A27]/50 dark:hover:border-[#E9B13F]/50 shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C68A27] dark:text-[#E9B13F]" />
              <span>Watch My Conversations</span>
            </a>

            {/* Button 3: Join Me on the Podcast */}
            <a
              href="#become-a-guest"
              onClick={handleScrollTo('become-a-guest')}
              className="px-5 sm:px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-[#CADCFC] hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-white/20 hover:border-[#C68A27] dark:hover:border-[#E9B13F] transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <Mic className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#E9B13F]" />
              <span>Join Me on the Podcast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Channels Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">Connect with Me:</span>
            <a
              href="https://www.youtube.com/@gdppodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-red-500 transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/gdptalks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-pink-500 transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5 fill-current text-pink-500" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/bhavesh-chudasama-48280728"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5 fill-current text-blue-500" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
