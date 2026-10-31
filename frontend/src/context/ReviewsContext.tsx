import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Review, RatingSummary, ReviewReply } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';
import { api } from '../services/apiClient';

const REVIEWS_STORAGE_KEY = 'gdp_stored_reviews';
const LIKED_STORAGE_KEY = 'gdp_liked_reviews';
const DISLIKED_STORAGE_KEY = 'gdp_disliked_reviews';

export interface NewReviewInput {
  userName: string;
  role?: string;
  companyName?: string;
  rating: number;
  title: string;
  content: string;
  verified?: boolean;
}

export interface NewReplyInput {
  userName: string;
  role?: string;
  content: string;
}

interface ReviewsContextType {
  reviews: Review[];
  ratingSummary: RatingSummary;
  likedReviews: Record<string, boolean>;
  dislikedReviews: Record<string, boolean>;
  addReview: (input: NewReviewInput) => Review;
  toggleHelpful: (reviewId: string) => void;
  toggleDislike: (reviewId: string) => void;
  addReply: (reviewId: string, replyInput: NewReplyInput) => void;
  resetToDefault: () => void;
}

const computeSummary = (revs: Review[]): RatingSummary => {
  if (revs.length === 0) {
    return {
      average: 5.0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  revs.forEach((r) => {
    const star = Math.min(Math.max(Math.round(r.rating), 1), 5) as 1 | 2 | 3 | 4 | 5;
    dist[star] = (dist[star] || 0) + 1;
    sum += r.rating;
  });
  return {
    average: Number((sum / revs.length).toFixed(1)),
    totalReviews: revs.length,
    distribution: dist,
  };
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(LIKED_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  const [dislikedReviews, setDislikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(DISLIKED_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  const [ratingSummary, setRatingSummary] = useState<RatingSummary>(() => computeSummary([]));

  // Fetch approved reviews from backend API on mount
  useEffect(() => {
    let isMounted = true;
    api
      .getReviews()
      .then((res) => {
        if (isMounted && res.success) {
          if (res.data && res.data.length > 0) {
            const mapped: Review[] = res.data.map((r) => ({
              id: r.id,
              userId: r.id,
              userName: r.author || 'Anonymous',
              userAvatar: r.avatarUrl || undefined,
              rating: r.rating,
              title: r.title || 'Client Experience',
              content: r.content,
              date: new Date(r.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }),
              verified: true,
              helpfulCount: 0,
            }));
            setReviews(mapped);
          } else {
            // Authentic state: 0 approved reviews exist in SQL Server
            setReviews([]);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch approved reviews from API:', err);
        if (isMounted) setReviews([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage whenever reviews change
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      setRatingSummary(computeSummary(reviews));
    } catch (e) {
      console.warn('Error persisting reviews to localStorage:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedReviews));
    } catch {
      // ignore
    }
  }, [likedReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(DISLIKED_STORAGE_KEY, JSON.stringify(dislikedReviews));
    } catch {
      // ignore
    }
  }, [dislikedReviews]);

  const addReview = (input: NewReviewInput): Review => {
    const newRev: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: `usr-${Date.now()}`,
      userName: input.userName.trim(),
      role: input.role?.trim() || 'Verified Client',
      companyName: input.companyName?.trim() || undefined,
      rating: input.rating,
      title: input.title.trim(),
      content: input.content.trim(),
      date: 'Just now',
      verified: input.verified !== undefined ? input.verified : true,
      helpfulCount: 0,
      dislikesCount: 0,
      replies: [],
    };

    setReviews((prev) => [newRev, ...prev]);
    return newRev;
  };

  const toggleHelpful = (reviewId: string) => {
    const wasLiked = !!likedReviews[reviewId];
    const wasDisliked = !!dislikedReviews[reviewId];

    setLikedReviews((prev) => ({ ...prev, [reviewId]: !wasLiked }));
    if (wasDisliked) {
      setDislikedReviews((prev) => ({ ...prev, [reviewId]: false }));
    }

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const helpfulDelta = wasLiked ? -1 : 1;
        const dislikeDelta = wasDisliked ? -1 : 0;
        return {
          ...r,
          helpfulCount: Math.max(0, (r.helpfulCount || 0) + helpfulDelta),
          dislikesCount: Math.max(0, (r.dislikesCount || 0) + dislikeDelta),
        };
      })
    );
  };

  const toggleDislike = (reviewId: string) => {
    const wasDisliked = !!dislikedReviews[reviewId];
    const wasLiked = !!likedReviews[reviewId];

    setDislikedReviews((prev) => ({ ...prev, [reviewId]: !wasDisliked }));
    if (wasLiked) {
      setLikedReviews((prev) => ({ ...prev, [reviewId]: false }));
    }

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const dislikeDelta = wasDisliked ? -1 : 1;
        const helpfulDelta = wasLiked ? -1 : 0;
        return {
          ...r,
          dislikesCount: Math.max(0, (r.dislikesCount || 0) + dislikeDelta),
          helpfulCount: Math.max(0, (r.helpfulCount || 0) + helpfulDelta),
        };
      })
    );
  };

  const addReply = (reviewId: string, replyInput: NewReplyInput) => {
    const newReply: ReviewReply = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userName: replyInput.userName.trim(),
      role: replyInput.role?.trim() || 'Community Member',
      content: replyInput.content.trim(),
      date: 'Just now',
      helpfulCount: 0,
    };

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          replies: [...(r.replies || []), newReply],
        };
      })
    );
  };

  const resetToDefault = () => {
    setReviews(INITIAL_REVIEWS);
    setLikedReviews({});
    setDislikedReviews({});
    localStorage.removeItem(REVIEWS_STORAGE_KEY);
    localStorage.removeItem(LIKED_STORAGE_KEY);
    localStorage.removeItem(DISLIKED_STORAGE_KEY);
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        ratingSummary,
        likedReviews,
        dislikedReviews,
        addReview,
        toggleHelpful,
        toggleDislike,
        addReply,
        resetToDefault,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
