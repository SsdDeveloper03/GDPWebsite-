import React, { useState } from 'react';
import { Video, Sparkles, Repeat, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GDP_CREDIBILITY } from '../../data/mockData';

export const TrustStrip: React.FC = () => {
  // Respecting the brief: unverified metrics are hidden by default until Bhavesh Sir confirms them
  const [showMetricsDemo, setShowMetricsDemo] = useState(GDP_CREDIBILITY.showUnverifiedStats);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#B8860B] dark:text-[#F2C94C]" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-[#1E2761] dark:text-[#CADCFC]" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />;
    }
  };

  return (
    <section className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="bg-white dark:bg-[#121936]/90 backdrop-blur-xl border border-slate-200 dark:border-[#CADCFC]/15 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-2xl transition-colors duration-300">
        {/* Toggle / Verification Notice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[#1E2761] dark:text-[#CADCFC] uppercase">
              GDP Operational Standards & Commitments
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs hidden md:inline">•</span>
            <span className="text-xs text-[#C68A27] dark:text-[#D9A441] hidden md:inline font-semibold">
              Surat, Gujarat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMetricsDemo(!showMetricsDemo)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Per project instructions, unverified metrics require founder confirmation before publishing"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
              <span>{showMetricsDemo ? 'Showing Draft Metrics' : 'Metrics Hidden (Founder Verification Pending)'}</span>
            </button>
          </div>
        </div>

        {/* Unverified Statistics Strip (Controlled by founder confirmation) */}
        {showMetricsDemo ? (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
              <span>⚠️ <strong>Editorial Notice:</strong> These figures are pending final confirmation by the founder.</span>
              <button
                onClick={() => setShowMetricsDemo(false)}
                className="underline hover:text-black dark:hover:text-white text-[11px] cursor-pointer"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {GDP_CREDIBILITY.unverifiedStats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#C68A27] dark:text-[#D9A441] font-serif">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{stat.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.note}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Verified Pillars (Published Default) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GDP_CREDIBILITY.verifiedPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-[#1E2761]/30 border border-slate-200/80 dark:border-[#CADCFC]/10 hover:border-[#C68A27]/50 dark:hover:border-[#D9A441]/40 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  {getIcon(pillar.iconName)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#C68A27] dark:group-hover:text-[#F2C94C] transition-colors leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#CADCFC]/80 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
