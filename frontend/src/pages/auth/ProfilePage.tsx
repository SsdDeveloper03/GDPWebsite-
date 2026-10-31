import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Edit3,
  LogOut,
  Building,
  Mail,
  Info,
} from 'lucide-react';
import { StarRating } from '../../components/common/StarRating';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Mock authenticated client state
  const [profile] = useState({
    name: 'Vikramaditya Mehta',
    email: 'vikram@nexora.health',
    company: 'Nexora HealthTech',
    role: 'USER',
    verified: true,
    joinedDate: 'January 2026',
  });

  // Mock single user review state
  const [userReview, setUserReview] = useState<{
    rating: number;
    title: string;
    content: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    date: string;
  } | null>({
    rating: 5,
    title: 'Transformed our brand authority and doubled organic enterprise pipeline',
    content:
      'Partnering with Growth Ka Digital Partner was a turning point for our executive positioning. Their blend of cinematic podcast storytelling and sharp funnel strategy positioned our venture as the category leader.',
    status: 'APPROVED',
    date: 'March 24, 2026',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(userReview?.title || '');
  const [editContent, setEditContent] = useState(userReview?.content || '');
  const [editRating, setEditRating] = useState(userReview?.rating || 5);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    setUserReview({
      rating: editRating,
      title: editTitle,
      content: editContent,
      status: 'PENDING', // Editing puts review back into pending moderation as required!
      date: 'Just now (Updated)',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10 transition-colors duration-300">
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#121936]/90 border border-slate-200 dark:border-[#CADCFC]/15 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9A441] via-[#F2C94C] to-[#1E2761] text-[#0E1326] font-extrabold text-2xl flex items-center justify-center shadow-xl shadow-[#D9A441]/25 shrink-0 font-serif">
            {profile.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-serif">{profile.name}</h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Client
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {profile.company}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono uppercase text-slate-700 dark:text-slate-300">
                Role: {profile.role}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Prototype Status Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-amber-300">
        <Info className="w-4 h-4 shrink-0 text-[#C68A27] dark:text-amber-400 mt-0.5" />
        <span>
          <strong>One Active Review Rule:</strong> As defined in the GDP schema specification, each authenticated user can possess at most one brand review. Modifying an approved review returns its moderation status to <strong>PENDING</strong> until re-approved by an administrator.
        </span>
      </div>

      {/* User's Single Active Review Section */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#0f121a] border border-slate-200 dark:border-white/10 shadow-lg space-y-6 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">Your Brand Review</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your public testimonial for Growth Ka Digital Partner
            </p>
          </div>

          {userReview && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#C68A27] dark:text-[#D9A441] hover:text-[#0E1326] bg-amber-500/10 hover:bg-[#D9A441] border border-amber-500/25 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Review</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveReview} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141822] border border-slate-200 dark:border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                Update Rating
              </label>
              <StarRating
                rating={editRating}
                size="lg"
                interactive
                onRatingChange={(r) => setEditRating(r)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Headline
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141822] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Written Feedback
              </label>
              <textarea
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141822] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#C68A27] dark:focus:border-[#D9A441] resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-md transition-colors cursor-pointer"
              >
                Save Changes (Submit for Moderation)
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : userReview ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121936]/80 border border-slate-200 dark:border-[#CADCFC]/15 space-y-4">
            <div className="flex items-center justify-between">
              <StarRating rating={userReview.rating} size="md" />
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    userReview.status === 'APPROVED'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : userReview.status === 'PENDING'
                      ? 'bg-amber-400/15 text-[#C68A27] dark:text-amber-300 border-amber-400/30'
                      : 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30'
                  }`}
                >
                  {userReview.status === 'APPROVED'
                    ? '● APPROVED & LIVE'
                    : userReview.status === 'PENDING'
                    ? '● PENDING MODERATION'
                    : '● REJECTED'}
                </span>
                <span className="text-xs text-slate-500 font-mono">{userReview.date}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
              "{userReview.title}"
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {userReview.content}
            </p>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 space-y-2">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">You haven't submitted a review yet.</p>
            <p className="text-xs text-slate-500">Share your partnership experience with the GDP community.</p>
          </div>
        )}
      </div>
    </div>
  );
};
