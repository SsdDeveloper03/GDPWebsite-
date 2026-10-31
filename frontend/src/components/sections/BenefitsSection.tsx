import React from 'react';
import { UserCheck, Award, ShieldCheck, Repeat, Users, Globe, ArrowRight } from 'lucide-react';
import { GDP_BENEFITS, GDP_CONTACT_INFO } from '../../data/mockData';

export const BenefitsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'Award':
        return <Award className="w-6 h-6 text-[#B8860B] dark:text-[#F2C94C]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#1E2761] dark:text-[#CADCFC]" />;
      case 'Repeat':
        return <Repeat className="w-6 h-6 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#B8860B] dark:text-[#F2C94C]" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-[#1E2761] dark:text-[#CADCFC]" />;
      default:
        return <Award className="w-6 h-6 text-[#C68A27] dark:text-[#D9A441]" />;
    }
  };

  return (
    <section id="why-podcasting" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Section Header */}
      <div className="max-w-3xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#1E2761]/60 border border-slate-200 dark:border-[#CADCFC]/20 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold tracking-wider uppercase">
          <span>The Strategic Advantage</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
          What Podcasting{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
            Actually Gives You
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/80 leading-relaxed font-light">
          It is not about chasing short-term viral stunts. A strategic podcast is the highest-leverage asset a business owner or professional can build — generating authentic trust and evergreen inbound opportunities.
        </p>
      </div>

      {/* 6 Benefit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {GDP_BENEFITS.map((item, index) => (
          <div
            key={item.id}
            className="group relative p-7 rounded-2xl bg-white dark:bg-[#121936]/80 hover:bg-slate-50 dark:hover:bg-[#1E2761]/60 border border-slate-200 dark:border-[#CADCFC]/15 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-[#D9A441]/15 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header with Circular Icon & Tag */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/25 flex items-center justify-center group-hover:scale-110 group-hover:border-[#C68A27]/60 dark:group-hover:border-[#D9A441]/60 transition-all duration-300 shadow-sm">
                  {getIcon(item.iconName)}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C68A27] dark:text-[#D9A441] bg-[#C68A27]/10 dark:bg-[#D9A441]/10 px-2.5 py-1 rounded-full border border-[#C68A27]/25 dark:border-[#D9A441]/25">
                  {item.tag}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors font-serif">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#1E2761] dark:text-[#CADCFC]">
                  {item.subtitle}
                </p>
              </div>

              {/* Concise Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            {/* Subtle bottom indicator */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-[#CADCFC]/60 group-hover:text-[#C68A27] dark:group-hover:text-[#D9A441] transition-colors">
              <span className="font-mono text-[11px]">0{index + 1} / 06</span>
              <span className="flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                Explore Impact <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Banner within section */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1E2761] to-[#0E1326] border border-[#CADCFC]/20 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold text-white font-serif">
            Ready to turn your knowledge into an authoritative personal brand?
          </h4>
          <p className="text-xs sm:text-sm text-[#CADCFC]">
            Join Gujarat’s visionary business leaders recording at the GDP studio in Surat.
          </p>
        </div>
        <a
          href={GDP_CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-gradient-to-r from-[#F2C94C] via-[#D9A441] to-[#E5A93B] shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
        >
          Book a Studio Discovery Session
        </a>
      </div>
    </section>
  );
};
