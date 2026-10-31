import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import { StarRating } from '../common/StarRating';

interface ReviewsShowcaseSectionProps {
  onWriteReview?: () => void;
}

export const ReviewsShowcaseSection: React.FC<ReviewsShowcaseSectionProps> = ({ onWriteReview }) => {
  const { reviews, ratingSummary } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalReviews = reviews.length;

  // Autoplay functionality: slow 8s cycle, pauses on hover/focus, respects reduced-motion
  useEffect(() => {
    if (totalReviews <= 1) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 8000);

    return () => clearInterval(timer);
  }, [totalReviews, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const activeReview = reviews[currentIndex] || reviews[0];

  return (
    <section id="reviews" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200/80 dark:border-white/10 reveal-on-scroll">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#D9A441]/10 border border-slate-200 dark:border-[#D9A441]/30 text-[#0B1024] dark:text-[#F4CC69] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
            <span>VERIFIED COMMUNITY FEEDBACK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-serif">
            Trusted Conversations.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1024] via-[#C68A27] to-[#D9A441] dark:from-white dark:via-[#F4CC69] dark:to-[#D9A441]">
              Meaningful Experiences.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#AAB4CB] leading-relaxed font-light">
            Genuine reflections from business owners, healthcare specialists, and leaders who shared their journey in our Surat studio.
          </p>
        </div>

        {/* Global Score & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-3 pr-4 border-r-0 sm:border-r border-slate-200 dark:border-white/10">
            <span className="text-4xl font-black text-slate-900 dark:text-white font-serif">
              {ratingSummary.average}
            </span>
            <div className="space-y-0.5">
              <StarRating rating={ratingSummary.average} size="sm" />
              <span className="text-[11px] text-slate-500 dark:text-[#AAB4CB] block">
                {ratingSummary.totalReviews} Verified Ratings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onWriteReview && (
              <button
                onClick={onWriteReview}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0B1024] bg-[#D9A441] hover:bg-[#F4CC69] shadow-md transition-all cursor-pointer"
              >
                Write a Review
              </button>
            )}
            <Link
              to="/reviews"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
            >
              All Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Testimonial Carousel or Empty State */}
      {totalReviews === 0 ? (
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-amber-50/20 dark:from-[#121A35] dark:via-[#10172E] dark:to-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl text-center space-y-4 reveal-on-scroll">
          <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/10 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            Client Testimonials in Curation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4CB] max-w-lg mx-auto leading-relaxed">
            We are curating verified feedback from Gujarati business owners and thought leaders who have shared their journey in our studio. Have you recorded with GDP? We'd love to hear your story.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-md transition-all"
            >
              <span>Get in Touch with Studio</span>
            </Link>
          </div>
        </div>
      ) : activeReview ? (
        <div
          className="relative reveal-on-scroll"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-white via-slate-50 to-amber-50/20 dark:from-[#121A35] dark:via-[#10172E] dark:to-[#0B1024] border border-slate-200 dark:border-[#CADCFC]/15 shadow-2xl transition-all duration-500">
            {/* Elegant Background Gold Watermark Quote */}
            <div className="absolute top-6 right-8 text-[#D9A441]/10 dark:text-[#D9A441]/10 pointer-events-none select-none">
              <Quote className="w-24 h-24 sm:w-36 sm:h-36 rotate-180" />
            </div>

            <div className="relative z-10 space-y-6 max-w-4xl">
              {/* Rating & Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StarRating rating={activeReview.rating} size="md" />
                  {activeReview.verified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Guest / Client</span>
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-slate-400 dark:text-[#AAB4CB]">
                  {activeReview.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white font-serif leading-snug">
                “{activeReview.title}”
              </h3>

              {/* Main Content */}
              <blockquote className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-light italic">
                "{activeReview.content}"
              </blockquote>

              {/* Host/Studio Reply if present */}
              {activeReview.replies && activeReview.replies.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#C68A27] dark:text-[#F4CC69]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Response from {activeReview.replies[0].userName}:</span>
                  </div>
                  <p className="leading-relaxed font-light italic">
                    "{activeReview.replies[0].content}"
                  </p>
                </div>
              )}

              {/* Author Metadata & Controls */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Avatar Circle */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4CC69] via-[#D9A441] to-[#C68A27] text-[#0B1024] font-black text-base flex items-center justify-center shadow-md">
                    {activeReview.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeReview.userName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#AAB4CB]">
                      {activeReview.role}
                      {activeReview.companyName && ` · ${activeReview.companyName}`}
                    </p>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous review"
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="flex items-center gap-1.5 px-2">
                    {reviews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to review ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentIndex
                            ? 'w-7 bg-[#D9A441]'
                            : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    aria-label="Next review"
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Supporting 3 Review Cards Grid Below Carousel */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {reviews.slice(0, 3).map((rev, index) => (
            <div
              key={rev.id}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                index === currentIndex
                  ? 'bg-amber-500/5 dark:bg-[#151D38] border-[#D9A441] shadow-lg -translate-y-1'
                  : 'bg-white dark:bg-[#121A35]/80 hover:bg-slate-50 dark:hover:bg-[#162040] border-slate-200 dark:border-[#CADCFC]/10 hover:border-[#D9A441]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StarRating rating={rev.rating} size="sm" />
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {rev.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 font-serif">
                  “{rev.title}”
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-light">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white truncate">
                  {rev.userName}
                </span>
                <span className="text-[11px] text-[#C68A27] dark:text-[#D9A441] font-semibold">
                  Read Story →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
