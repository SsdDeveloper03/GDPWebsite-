import React, { useState } from 'react';
import {
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MessageSquarePlus,
  Send,
  Heart,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { StarRating } from '../components/common/StarRating';
import { RatingDistribution } from '../components/common/RatingDistribution';
import { ReviewModal } from '../components/common/ReviewModal';
import { EmptyState } from '../components/common/EmptyState';

export const ReviewsPage: React.FC = () => {
  const {
    reviews,
    ratingSummary,
    likedReviews,
    dislikedReviews,
    addReview,
    toggleHelpful,
    toggleDislike,
    addReply,
  } = useReviews();

  const [activeStarFilter, setActiveStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'newest' | 'highest' | 'lowest'>('top');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Inline YouTube-style Comment Form State
  const [isComposerExpanded, setIsComposerExpanded] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Active reply box per review id
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');

  // Expanded replies toggle per review id
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({
    'rev-1': true,
    'rev-2': true,
  });

  const ratingLabels: Record<number, string> = {
    5: '★★★★★ (5.0) — Exceptional experience!',
    4: '★★★★☆ (4.0) — Very good & high value',
    3: '★★★☆☆ (3.0) — Good / Satisfactory',
    2: '★★☆☆☆ (2.0) — Fair / Needs improvement',
    1: '★☆☆☆☆ (1.0) — Disappointing',
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;

    addReview({
      userName: newName.trim(),
      role: newRole.trim() || 'Verified Client',
      companyName: newCompany.trim() || undefined,
      rating: newRating,
      title: newTitle.trim() || `${newRating} Star Experience with GDP Studio`,
      content: newContent.trim(),
      verified: true,
    });

    // Reset composer form
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setNewTitle('');
    setNewContent('');
    setNewRating(5);
    setIsComposerExpanded(false);

    // Show success toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handlePostReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    addReply(reviewId, {
      userName: replyName.trim() || 'Community Member',
      role: 'Podcast Viewer',
      content: replyText.trim(),
    });

    setReplyText('');
    setReplyName('');
    setActiveReplyId(null);
    setExpandedReplies((prev) => ({ ...prev, [reviewId]: true }));
  };

  const toggleRepliesView = (reviewId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  // Filter & sort logic
  const displayedReviews = reviews
    .filter((r) => (activeStarFilter ? Math.round(r.rating) === activeStarFilter : true))
    .sort((a, b) => {
      if (sortBy === 'top') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  // Unique avatar gradient generator based on name
  const getAvatarGradient = (name: string) => {
    const charCode = name.charCodeAt(0) || 65;
    const gradients = [
      'from-[#D9A441] to-[#1E2761]',
      'from-[#E5A93B] to-[#B8860B]',
      'from-[#1E2761] to-[#3B82F6]',
      'from-[#10B981] to-[#047857]',
      'from-[#8B5CF6] to-[#6D28D9]',
      'from-[#F43F5E] to-[#BE123C]',
    ];
    return gradients[charCode % gradients.length];
  };

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl animate-bounce">
          <Check className="w-5 h-5 text-emerald-200" />
          <div className="text-xs font-semibold">
            Review saved! Your rating has updated the community score.
          </div>
        </div>
      )}

      {/* =========================================================================
          1. HEADER & OVERVIEW
          ========================================================================= */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#1E2761]/80 border border-slate-200 dark:border-[#CADCFC]/25 text-[#1E2761] dark:text-[#CADCFC] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C68A27] dark:text-[#D9A441]" />
            <span>COMMUNITY FEEDBACK & REVIEWS</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-[#C68A27] dark:text-[#D9A441]">YOUTUBE COMMENT FORMAT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] font-serif">
            Client Reviews &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E2761] via-[#C68A27] to-[#B8860B] dark:from-white dark:via-[#F2C94C] dark:to-[#D9A441]">
              Discussions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#CADCFC]/90 leading-relaxed font-light">
            Read verified feedback and community discussions from Gujarat business owners, doctors, and professionals who have recorded podcasts with Bhavesh Chudasama at GDP Surat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsComposerExpanded(!isComposerExpanded)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#0B1024] bg-[#D9A441] hover:bg-[#F4CC69] shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{isComposerExpanded ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. SUMMARY SCORE & RATING DISTRIBUTION CARD (when reviews exist)
          ========================================================================= */}
      {ratingSummary.totalReviews > 0 && (
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 backdrop-blur-md shadow-xl dark:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Big Average Score */}
            <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-4 lg:pr-8 lg:border-r lg:border-slate-200 dark:lg:border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C68A27] dark:text-[#D9A441]">
                OVERALL GDP SATISFACTION
              </span>

              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
                  {ratingSummary.average}
                </span>
                <span className="text-xl text-slate-500 dark:text-slate-400 font-medium">/ 5.0</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <StarRating rating={ratingSummary.average} size="lg" />
                  <span className="text-xs font-bold text-[#1E2761] dark:text-[#CADCFC]">
                    {ratingSummary.totalReviews} Verified Feedback Entries
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reviews are saved in your local session and calculate the live average score.
                </p>
              </div>

              <div className="pt-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsComposerExpanded(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Leave a Review / Comment</span>
                </button>
              </div>
            </div>

            {/* Right Column: 5-to-1 Star Distribution */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#CADCFC] font-semibold">
                <span>RATING BREAKDOWN</span>
                <span>CLICK ANY ROW TO FILTER</span>
              </div>

              <RatingDistribution
                distribution={ratingSummary.distribution}
                totalReviews={ratingSummary.totalReviews}
                activeFilter={activeStarFilter}
                onFilterChange={(stars) => setActiveStarFilter(stars)}
              />

              {activeStarFilter && (
                <div className="pt-2 flex items-center justify-between text-xs text-slate-800 dark:text-[#CADCFC] bg-slate-100 dark:bg-[#1E2761]/40 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#D9A441]/30">
                  <span>
                    Filtered to: <strong>{activeStarFilter} Stars Only</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveStarFilter(null)}
                    className="text-[#C68A27] dark:text-[#D9A441] font-bold hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. YOUTUBE-STYLE COMMENTS FEED & INTERACTIVE COMPOSER
          ========================================================================= */}
      {reviews.length === 0 && !isComposerExpanded ? (
        <EmptyState
          icon={<MessageSquarePlus className="w-8 h-8 text-[#C68A27] dark:text-[#D9A441]" />}
          title="Be the First to Review Growth Ka Digital Partner"
          description="We are currently curating verified client reviews from our Surat studio sessions. Have you recorded with GDP? Be the first to share your experience."
          actionLabel="Share Your Feedback"
          onAction={() => {
            setIsComposerExpanded(true);
          }}
        />
      ) : (
        <section className="space-y-8">
          {/* Section Header with YouTube Comments Count & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C68A27] dark:text-[#D9A441]" />
                <span>Reviews & Comments</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D9A441]/20 text-[#C68A27] dark:text-[#F2C94C] border border-[#D9A441]/30">
                {reviews.length}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-[#121936] border border-slate-200 dark:border-[#CADCFC]/20 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D9A441] cursor-pointer font-medium shadow-sm"
              >
                <option value="top">Top Comments (Most Helpful)</option>
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating (5★ first)</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* =========================================================================
              INLINE YOUTUBE-STYLE COMMENT COMPOSER
              ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/20 shadow-md">
            <div className="flex items-start gap-4">
              {/* User Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9A441] to-[#1E2761] text-[#0E1326] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                {newName ? newName.charAt(0).toUpperCase() : 'Y'}
              </div>

              {/* Main Composer Box */}
              <div className="flex-1 space-y-4">
                {!isComposerExpanded ? (
                  /* Collapsed 1-line YouTube prompt */
                  <div
                    onClick={() => setIsComposerExpanded(true)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0E1326]/60 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-xs sm:text-sm cursor-text hover:border-[#D9A441]/60 transition-colors flex items-center justify-between"
                  >
                    <span>Give a star rating and add a review comment...</span>
                    <div className="flex items-center gap-1 opacity-70">
                      <StarRating rating={5} size="sm" />
                    </div>
                  </div>
                ) : (
                  /* Expanded Full Interactive Form */
                  <form onSubmit={handlePostReview} className="space-y-4 animate-fadeIn">
                    {/* Star Rating Picker */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                          Select Your Star Rating:
                        </label>
                        <span className="text-xs font-semibold text-[#C68A27] dark:text-[#D9A441]">
                          {ratingLabels[newRating]}
                        </span>
                      </div>
                      <div className="pt-1">
                        <StarRating
                          rating={newRating}
                          size="xl"
                          interactive
                          onRatingChange={(stars) => setNewRating(stars)}
                        />
                      </div>
                    </div>

                    {/* Reviewer Name and Role inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Your Name (e.g. Ramesh Patel) *"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          placeholder="Your Profession or Business (optional)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>

                    {/* Headline */}
                    <div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Review Headline (e.g. Authentic podcasting environment and immense personal branding reach)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#D9A441]"
                      />
                    </div>

                    {/* Main Comment Textarea */}
                    <div>
                      <textarea
                        rows={3}
                        required
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Share details of your experience with Bhavesh & GDP Podcast Studio in Surat... *"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#D9A441]"
                      />
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsComposerExpanded(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newName.trim() || !newContent.trim()}
                        className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0E1326] bg-gradient-to-r from-[#F2C94C] to-[#D9A441] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Review</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              YOUTUBE COMMENTS CARDS LIST
              ========================================================================= */}
          {displayedReviews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121936] border border-slate-200 dark:border-[#CADCFC]/15 space-y-3 shadow-sm">
              <p className="text-base text-slate-800 dark:text-slate-300 font-bold font-serif">
                No reviews found for {activeStarFilter} stars.
              </p>
              <button
                type="button"
                onClick={() => setActiveStarFilter(null)}
                className="text-xs text-[#C68A27] dark:text-[#D9A441] hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {displayedReviews.map((rev) => {
                const isLiked = !!likedReviews[rev.id];
                const isDisliked = !!dislikedReviews[rev.id];
                const replies = rev.replies || [];
                const areRepliesExpanded = !!expandedReplies[rev.id];

                return (
                  <article
                    key={rev.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#121936]/80 hover:bg-slate-50/80 dark:hover:bg-[#141C3E] border border-slate-200 dark:border-[#CADCFC]/15 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      {/* Left: User Avatar */}
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          rev.userName
                        )} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md`}
                      >
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>

                      {/* Right: Comment Content & Actions */}
                      <div className="flex-1 space-y-2.5">
                        {/* Header: User Name, Handle, Verified Badge, Date */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {rev.userName}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                            @{rev.userName.toLowerCase().replace(/[^a-z0-9]/g, '')}
                          </span>

                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D9A441]/15 text-[#C68A27] dark:text-[#F2C94C] border border-[#D9A441]/30">
                              <CheckCircle2 className="w-3 h-3 text-[#D9A441]" />
                              <span>Verified Client</span>
                            </span>
                          )}

                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                            • {rev.date}
                          </span>
                        </div>

                        {/* Profession / Role */}
                        {(rev.role || rev.companyName) && (
                          <div className="text-[11px] font-medium text-[#1E2761] dark:text-[#CADCFC]/80">
                            {rev.role} {rev.companyName && `• ${rev.companyName}`}
                          </div>
                        )}

                        {/* Star Rating & Headline */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <StarRating rating={rev.rating} size="sm" showValue />
                          {rev.title && (
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif leading-snug">
                              “{rev.title}”
                            </h3>
                          )}
                        </div>

                        {/* Comment Body */}
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
                          {rev.content}
                        </p>

                        {/* Creator Heart (YouTube feature) */}
                        {rev.creatorHeart && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-medium">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>Loved by Bhavesh Chudasama (GDP Host)</span>
                          </div>
                        )}

                        {/* YouTube Action Row: Like, Dislike, Reply */}
                        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                          {/* Thumbs Up / Like */}
                          <button
                            type="button"
                            onClick={() => toggleHelpful(rev.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                              isLiked
                                ? 'bg-[#D9A441]/20 text-[#C68A27] dark:text-[#F2C94C] font-bold border border-[#D9A441]/40'
                                : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                            title="Like this review"
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{rev.helpfulCount || 0}</span>
                          </button>

                          {/* Thumbs Down / Dislike */}
                          <button
                            type="button"
                            onClick={() => toggleDislike(rev.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                              isDisliked
                                ? 'bg-red-500/20 text-red-500 font-bold border border-red-500/40'
                                : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                            title="Dislike"
                          >
                            <ThumbsDown className={`w-3.5 h-3.5 ${isDisliked ? 'fill-current' : ''}`} />
                          </button>

                          {/* Reply Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReplyId(activeReplyId === rev.id ? null : rev.id)
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer font-semibold"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Inline Reply Input (opens when Reply is clicked) */}
                        {activeReplyId === rev.id && (
                          <div className="pt-3 pl-2 sm:pl-4 border-l-2 border-[#D9A441]/40 space-y-2 animate-fadeIn">
                            <input
                              type="text"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              placeholder="Your Name (optional, defaults to Community Member)"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                            />
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a public reply..."
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0E1326] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveReplyId(null)}
                                className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePostReply(rev.id)}
                                disabled={!replyText.trim()}
                                className="px-4 py-1 rounded-lg text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] disabled:opacity-50"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies Thread (Expandable like YouTube) */}
                        {replies.length > 0 && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => toggleRepliesView(rev.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C68A27] dark:text-[#D9A441] hover:underline cursor-pointer"
                            >
                              {areRepliesExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                              </span>
                            </button>

                            {areRepliesExpanded && (
                              <div className="mt-3 space-y-3 pl-4 border-l-2 border-slate-200 dark:border-white/10">
                                {replies.map((rep) => (
                                  <div key={rep.id} className="flex items-start gap-3">
                                    <div
                                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarGradient(
                                        rep.userName
                                      )} text-white font-extrabold text-[10px] flex items-center justify-center shrink-0`}
                                    >
                                      {rep.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                          {rep.userName}
                                        </span>
                                        {rep.role?.includes('Founder') || rep.role?.includes('Host') ? (
                                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#D9A441] text-[#0E1326]">
                                            HOST
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                                            {rep.role}
                                          </span>
                                        )}
                                        <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                                          • {rep.date}
                                        </span>
                                      </div>
                                      <p className="text-slate-700 dark:text-slate-300 font-light">
                                        {rep.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Optional Modal Review Submission */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={(revData) => {
          addReview({
            ...revData,
            verified: true,
          });
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 4000);
        }}
      />
    </div>
  );
};
