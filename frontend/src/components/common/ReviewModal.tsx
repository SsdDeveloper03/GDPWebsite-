import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle, Info } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Review } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Omit<Review, 'id' | 'userId' | 'date' | 'helpfulCount'>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const ratingDescriptions: Record<number, string> = {
    1: 'Poor — Needs significant improvement',
    2: 'Fair — Met some basic expectations',
    3: 'Good — Solid work delivered',
    4: 'Very Good — High impact & professional',
    5: 'Exceptional — Exceeded all expectations!',
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please provide a valid email address.';
    if (!title.trim()) errs.title = 'Please provide a headline for your review.';
    if (!content.trim() || content.trim().length < 20) {
      errs.content = 'Please write at least 20 characters describing your experience.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitReview({
      userName: name.trim(),
      role: role.trim() || 'Verified Client',
      companyName: company.trim() || undefined,
      rating,
      title: title.trim(),
      content: content.trim(),
      verified: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 dark:bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0f1219] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141822]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#C68A27] dark:text-[#D9A441] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight font-serif">
                Write a Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Growth Ka Digital Partner (GDP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white font-serif">Thank You for Your Review!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-light">
              Your feedback has been recorded in the prototype state. In the upcoming phase, new reviews will be stored in SQL Server and appear upon moderation approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
            {/* Prototype Banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-amber-300">
              <Info className="w-4 h-4 shrink-0 text-[#C68A27] dark:text-amber-400 mt-0.5" />
              <span>
                <strong>Prototype Notice:</strong> Submissions update your local view immediately. Database persistence will be activated when connected to the backend.
              </span>
            </div>

            {/* Star Rating Picker */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#131620] border border-slate-200 dark:border-white/5 text-center space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Your Overall Rating
              </label>
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  size="xl"
                  interactive
                  onRatingChange={(newRating) => setRating(newRating)}
                />
              </div>
              <p className="text-xs font-medium text-[#C68A27] dark:text-amber-400/90">
                {ratingDescriptions[rating]}
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Review Headline <span className="text-[#C68A27] dark:text-[#D9A441]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional podcast quality and personal branding strategy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Detailed Review <span className="text-[#C68A27] dark:text-[#D9A441]">*</span>
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your studio experience, conversational guidance, media quality, and overall impact..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors resize-none"
              />
              {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
            </div>

            {/* Personal Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-[#C68A27] dark:text-[#D9A441]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-[#C68A27] dark:text-[#D9A441]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Optional Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Title <span className="text-slate-400 dark:text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name <span className="text-slate-400 dark:text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Tech, Surat"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
