import React from 'react';
import { Sparkles, Play, ArrowRight, BookOpen, Lightbulb, Compass, Award } from 'lucide-react';
import { GDP_VIDEOS } from '../../data/mockData';
import type { Video } from '../../types';

interface LessonsSectionProps {
  onPlayVideo: (video: Video) => void;
}

interface LessonItem {
  episodeIndex: number;
  badge: string;
  topic: string;
  takeaway: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LESSONS: LessonItem[] = [
  {
    episodeIndex: 0,
    badge: 'PERSONAL BRANDING',
    topic: 'Building a Memorable Personal Brand',
    takeaway: 'Trust flows to founders who step out from behind the logo.',
    summary:
      'In high-trust B2B and retail markets, people do not commit to company logos alone; they invest in the human being behind the vision. Speaking openly about your craft, business philosophies, and hard-earned lessons transforms invisible expertise into undeniable enterprise equity.',
    icon: Compass,
  },
  {
    episodeIndex: 1,
    badge: 'MINDSET & CLARITY',
    topic: 'Developing a Growth-Oriented Mindset',
    takeaway: 'Inner equilibrium is an indispensable leadership discipline.',
    summary:
      'Aggressive business scaling frequently causes fatigue when external milestones eclipse personal clarity. Long-term leadership requires structured mental balance, intentional pauses, and the emotional resilience to navigate uncertainty without compromising ethics.',
    icon: Lightbulb,
  },
  {
    episodeIndex: 2,
    badge: 'DISCIPLINE & CRAFT',
    topic: 'Learning Discipline & Consistency From Craft',
    takeaway: 'Relentless micro-disciplines turn individual skill into an institution.',
    summary:
      'World-record milestones and high-growth creative enterprises are rarely products of sudden genius. They are forged through unwavering daily standards, repeatable training, and the dedication to treat your trade with the dignity of master craftsmanship.',
    icon: Award,
  },
];

export const LessonsSection: React.FC<LessonsSectionProps> = ({ onPlayVideo }) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#D9A441]/10 border border-slate-200 dark:border-[#D9A441]/30 text-[#1E2761] dark:text-[#F2C94C] text-xs font-bold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
            <span>EDITORIAL TAKEAWAYS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-serif leading-tight">
            Lessons From Our Conversations
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#CADCFC]/85 leading-relaxed font-light">
            Core principles and strategic insights distilled directly from genuine studio recordings with Gujarat’s founders, coaches, and industry pioneers.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#C68A27] dark:text-[#D9A441]">
          <Sparkles className="w-4 h-4" />
          <span>Curated from GDP Talks</span>
        </div>
      </div>

      {/* 3 Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {LESSONS.map((lesson, idx) => {
          const video = GDP_VIDEOS[lesson.episodeIndex] || GDP_VIDEOS[0];
          const Icon = lesson.icon;

          return (
            <div
              key={idx}
              className="group p-8 rounded-3xl bg-white dark:bg-[#121936]/80 hover:bg-slate-50 dark:hover:bg-[#161F42] border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/40 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#C68A27] dark:text-[#D9A441]">
                    {lesson.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#C68A27] dark:text-[#D9A441] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Topic Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif leading-snug group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors">
                  {lesson.topic}
                </h3>

                {/* Core Takeaway Accent */}
                <div className="p-3.5 rounded-xl bg-[#D9A441]/10 border-l-2 border-[#C68A27] dark:border-[#D9A441] text-xs font-semibold text-slate-900 dark:text-amber-200/90 leading-snug">
                  “{lesson.takeaway}”
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {lesson.summary}
                </p>
              </div>

              {/* Bottom Episode Reference & Play Trigger */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{video.publishedDate}</span>
                  <span className="font-mono text-[#C68A27] dark:text-[#D9A441]">{video.duration}</span>
                </div>

                <button
                  onClick={() => onPlayVideo(video)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-[#D9A441] hover:text-[#0E1326] text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center justify-between group/btn cursor-pointer"
                  aria-label={`Play source episode for ${lesson.topic}`}
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 fill-current text-[#C68A27] dark:text-[#D9A441] group-hover/btn:text-[#0E1326]" />
                    <span>Watch Source Episode</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
