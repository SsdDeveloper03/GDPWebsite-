import React from 'react';
import { Send, MessageSquare, Calendar, Mic, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProcessStepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const GUEST_PROCESS_STEPS: ProcessStepItem[] = [
  {
    step: '01',
    title: 'Submit Your Guest Enquiry',
    subtitle: 'Share Your Story & Ideas',
    description:
      'Fill out our straightforward guest proposal form with your professional background, industry focus, and the core themes you would love to discuss.',
    highlights: ['Zero-friction application', 'No complex agency bureaucracy', 'Prompt personal review by our team'],
    icon: Send,
  },
  {
    step: '02',
    title: 'Discuss Your Topic',
    subtitle: 'Narrative Alignment Call',
    description:
      'Connect directly with Bhavesh Chudasama for a relaxed discovery dialogue to identify your unique angles, pivotal milestones, and key audience takeaways.',
    highlights: ['Comfortable alignment session', 'Identify high-impact story arcs', 'Clarify episode goals'],
    icon: MessageSquare,
  },
  {
    step: '03',
    title: 'Plan the Recording',
    subtitle: 'Calm, Thorough Preparation',
    description:
      'We design a personalized conversational outline and provide wardrobe, lighting, and camera guidance so you walk into the studio feeling relaxed and fully prepared.',
    highlights: ['Conversational prompt framework', 'No script memorization needed', 'Wardrobe & studio arrival tips'],
    icon: Calendar,
  },
  {
    step: '04',
    title: 'Join the Conversation',
    subtitle: 'Broadcast 4K Studio Session',
    description:
      'Step into our Surat studio equipped with broadcast condenser mics and cinematic 4K camera angles. Have an authentic conversation that elevates your personal authority.',
    highlights: ['Guided conversational hosting', 'Warm, zero-stress atmosphere', 'Turnkey post-production repurposing'],
    icon: Mic,
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section id="our-process" className="py-24 bg-slate-50/70 dark:bg-[#0B1024] border-t border-slate-200 dark:border-[#CADCFC]/10 text-left scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-[#D9A441]/10 border border-slate-300 dark:border-[#D9A441]/30 text-[#0B1024] dark:text-[#F4CC69] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
            <span>HOW IT WORKS FOR GUESTS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
            A Welcoming, Professionally Prepared{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1024] via-[#C68A27] to-[#D9A441] dark:from-white dark:via-[#F4CC69] dark:to-[#D9A441]">
              Podcast Experience.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#AAB4CB] leading-relaxed font-light">
            We eliminate anxiety, stage fright, and technical complexity. Our four-step guest onboarding ensures you feel confident, respected, and articulate from day one.
          </p>
        </div>

        {/* 4-Step Connected Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {GUEST_PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`reveal-on-scroll reveal-stagger-${idx + 1} group p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121A35]/90 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#D9A441]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-[#D9A441]/40 group-hover:text-[#D9A441] font-mono transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#C68A27] dark:text-[#D9A441] uppercase tracking-wider block">
                      {step.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mt-1 group-hover:text-[#C68A27] dark:group-hover:text-[#F4CC69] transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    {step.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-1.5">
                    {step.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-[#D9A441] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
