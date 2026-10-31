import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-lg mx-auto px-4 text-center space-y-6 transition-colors duration-300">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-[#C68A27] dark:text-[#D9A441] tracking-wider">ERROR 404</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">Page Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto font-light">
          The page or broadcast episode you are searching for does not exist or has been relocated in our directory.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/podcast"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Podcast</span>
        </Link>
      </div>
    </div>
  );
};
