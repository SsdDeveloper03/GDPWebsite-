import React from 'react';
import {
  Briefcase,
  HeartPulse,
  Compass,
  GraduationCap,
  Music,
  Factory,
  FileSpreadsheet,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { GDP_AUDIENCES } from '../../data/mockData';

export const AudienceSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#B8860B] dark:text-[#F2C94C]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#1E2761] dark:text-[#CADCFC]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-amber-500 dark:text-amber-300" />;
      case 'Factory':
        return <Factory className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#B8860B] dark:text-[#F2C94C]" />;
      default:
        return <CheckCircle className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
    }
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0B0F1D] border-y border-slate-200 dark:border-[#CADCFC]/10 text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-[#1E2761]/70 border border-slate-300 dark:border-[#CADCFC]/20 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold tracking-wider uppercase">
            <span>Tailored for Gujarat’s Experts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
            If Your Journey Has a Lesson,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
              Your Story Has Value.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/80 leading-relaxed font-light">
            You don’t need to be an influencer or social media celebrity. You just need genuine domain experience and the courage to articulate your truth. Here is who thrives with GDP:
          </p>
        </div>

        {/* 8 Audience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GDP_AUDIENCES.map((aud) => (
            <div
              key={aud.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#121936]/60 hover:bg-slate-50 dark:hover:bg-[#1E2761]/60 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Circular Icon with subtle glow */}
                <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                  {getIcon(aud.iconName)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors font-serif leading-snug">
                    {aud.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-[#1E2761] dark:text-[#CADCFC] mt-0.5">
                    {aud.roleDescription}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {aud.podcastFocus}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-[#C68A27] dark:text-[#D9A441]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ready for Thought Leadership</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
