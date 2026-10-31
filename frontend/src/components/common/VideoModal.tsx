import React, { useEffect } from 'react';
import { X, Play, Clock, Eye, Tag, ArrowUpRight } from 'lucide-react';
import type { Video } from '../../types';

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121936]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/15 text-[#C68A27] dark:text-[#D9A441] border border-amber-500/30">
              <Play className="w-3 h-3 fill-current" />
              {video.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
              {video.duration}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://youtu.be/${video.youtubeVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Open on YouTube</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
              aria-label="Close episode video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Video Player (Privacy-conscious youtube-nocookie) */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Video Details */}
        <div className="p-5 sm:p-6 space-y-3">
          <h3
            id="video-modal-title"
            className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight font-serif"
          >
            {video.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            {video.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            {video.views && (
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
                {video.views}
              </span>
            )}
            <span>Release: {video.publishedDate}</span>
            <span className="flex items-center gap-1 text-[#C68A27] dark:text-[#D9A441] font-semibold">
              <Tag className="w-3.5 h-3.5" />
              GDP Growth Series · Surat Studio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
