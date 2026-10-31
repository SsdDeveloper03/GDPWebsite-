import React from 'react';
import { Sparkles, Mic, Share2, Compass } from 'lucide-react';

interface TimelineStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Share Your Story',
    subtitle: 'Your Milestones & Lessons',
    description:
      'Tell us about your professional journey, the pivotal decisions you made, the obstacles you overcame, and the valuable lessons learned along the way.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Have a Meaningful Conversation',
    subtitle: 'Guided In-Studio Dialogue',
    description:
      'Discuss your experience, expertise, and ideas in a relaxed, guided podcast conversation with Bhavesh Chudasama in our professional Surat studio.',
    icon: Mic,
  },
  {
    number: '03',
    title: 'Share the Conversation',
    subtitle: 'Evergreen Personal Brand Asset',
    description:
      'Your episode becomes an enduring chapter in the official GDP podcast library, ready to share with peers, clients, and leaders across your professional ecosystem.',
    icon: Share2,
  },
];

export const WhyBeAGuestSection: React.FC = () => {
  return (
    <section id="why-guest" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4 mb-16 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#D9A441]/10 border border-slate-200 dark:border-[#D9A441]/30 text-[#0B1024] dark:text-[#F4CC69] text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
          <span>GUEST JOURNEY</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
          Why Be a Guest on GDP Podcast?
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#AAB4CB] leading-relaxed font-light">
          Not just another interview. A thoughtful conversation designed to preserve your wisdom and present your journey with dignity.
        </p>
      </div>

      {/* 3-Step Horizontal Timeline (Desktop) / Vertical Timeline (Mobile) */}
      <div className="relative">
        {/* Subtle Horizontal Gold Connector Line (Desktop Only) */}
        <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#D9A441]/20 via-[#D9A441]/60 to-[#D9A441]/20 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`reveal-on-scroll reveal-stagger-${idx + 1} group p-8 rounded-3xl bg-white dark:bg-[#121A35]/90 hover:bg-slate-50 dark:hover:bg-[#182346] border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#D9A441]/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div className="space-y-5">
                  {/* Step Number Marker & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4CC69] via-[#D9A441] to-[#C68A27] text-[#0B1024] flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform font-mono">
                      {step.number}
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#C68A27] dark:text-[#D9A441] block">
                      {step.subtitle}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif mt-1 group-hover:text-[#C68A27] dark:group-hover:text-[#F4CC69] transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>Step {step.number} of 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
