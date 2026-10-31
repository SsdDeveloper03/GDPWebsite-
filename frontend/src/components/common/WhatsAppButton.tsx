import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { GDP_CONTACT_INFO } from '../../data/mockData';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Interactive Tooltip bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#0E1326] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xl border border-[#D9A441]/40 backdrop-blur-md animate-bounce">
          <span>WhatsApp ‘PODCAST’ to Start</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5 rounded"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={GDP_CONTACT_INFO.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp with Bhavesh"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#0E1326]/80 group"
      >
        <MessageCircle className="w-7 h-7 fill-current group-hover:rotate-6 transition-transform" />
      </a>
    </div>
  );
};
