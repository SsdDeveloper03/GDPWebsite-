import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Video,
  AlertCircle,
  Tv,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { CreateEpisodePayload } from "../../services/apiClient";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { ErrorState } from "../../components/admin/ErrorState";

export const EpisodeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateEpisodePayload>({
    title: "",
    description: "",
    youtubeVideoId: "",
    thumbnailUrl: "",
    guestName: "",
    guestRole: "",
    category: "Technology & Business",
    spotifyUrl: "",
    applePodcastsUrl: "",
    isFeatured: false,
    status: "PUBLISHED",
    displayOrder: 0,
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract YouTube video ID if someone pastes a full URL
  const sanitizeYoutubeId = (input: string) => {
    const trimmed = input.trim();
    const urlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = trimmed.match(urlPattern);
    return match ? match[1] : trimmed;
  };

  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadEpisode = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getAdminEpisodeById(id);
        const ep = response.episode || (response as any).data;
        if (!ep) {
          throw new Error("Episode record not found in database.");
        }
        setFormData({
          title: ep.title || "",
          description: ep.description || "",
          youtubeVideoId: ep.youtubeVideoId || "",
          thumbnailUrl: ep.thumbnailUrl || "",
          guestName: ep.guestName || "",
          guestRole: ep.guestRole || "",
          category: ep.category || "Technology & Business",
          spotifyUrl: ep.spotifyUrl || "",
          applePodcastsUrl: ep.applePodcastsUrl || "",
          isFeatured: Boolean(ep.isFeatured),
          status: ep.status || "PUBLISHED",
          displayOrder: ep.displayOrder || 0,
        });
      } catch (err: any) {
        console.error("Failed to load episode:", err);
        setError(err.message || "Could not retrieve episode record.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisode();
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = formData.title.trim();
    const cleanYtId = sanitizeYoutubeId(formData.youtubeVideoId);

    if (cleanTitle.length < 2) {
      setError("Episode title must be at least 2 characters.");
      return;
    }

    if (cleanYtId.length < 5) {
      setError("Please provide a valid YouTube video ID or URL.");
      return;
    }

    const payload: CreateEpisodePayload = {
      ...formData,
      title: cleanTitle,
      youtubeVideoId: cleanYtId,
      thumbnailUrl:
        formData.thumbnailUrl?.trim() ||
        `https://img.youtube.com/vi/${cleanYtId}/hqdefault.jpg`,
      guestName: formData.guestName?.trim() || "",
      guestRole: formData.guestRole?.trim() || "",
      category: formData.category?.trim() || "Technology & Business",
      spotifyUrl: formData.spotifyUrl?.trim() || "",
      applePodcastsUrl: formData.applePodcastsUrl?.trim() || "",
      description: formData.description?.trim() || "",
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode && id) {
        await api.updateAdminEpisode(id, payload);
      } else {
        await api.createAdminEpisode(payload);
      }
      navigate("/admin/episodes", {
        state: {
          toastMessage: isEditMode
            ? `Episode "${payload.title}" updated successfully.`
            : `Episode "${payload.title}" published to catalog.`,
        },
      });
    } catch (err: any) {
      console.error("Failed to save episode:", err);
      setError(err.message || "Failed to save episode to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewThumbnail =
    formData.thumbnailUrl ||
    (formData.youtubeVideoId
      ? `https://img.youtube.com/vi/${sanitizeYoutubeId(formData.youtubeVideoId)}/hqdefault.jpg`
      : null);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <LoadingSkeleton type="form" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to="/admin/episodes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Episodes Catalog</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          {isEditMode ? `ID: ${id?.slice(0, 8)}...` : "New Broadcast Entry"}
        </span>
      </div>

      {/* Error state if load failed */}
      {error && !formData.title && (
        <ErrorState
          title="Episode Not Available"
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0F1426] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
              <Video className="w-5 h-5 text-[#D9A441]" />
              <span>{isEditMode ? "Edit Episode Details" : "Create New Video Episode"}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure publication details, YouTube video linkage, guest credits, and audio streaming platforms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                })
              }
              className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none ${
                formData.status === "PUBLISHED"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : formData.status === "DRAFT"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <option value="PUBLISHED" className="bg-[#0F1426] text-white">
                PUBLISHED
              </option>
              <option value="DRAFT" className="bg-[#0F1426] text-white">
                DRAFT
              </option>
              <option value="ARCHIVED" className="bg-[#0F1426] text-white">
                ARCHIVED
              </option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Core Broadcast Metadata */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            1. Broadcast & Title
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Episode Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Scaling Tech Ventures in India | Ep. 12"
              className="w-full px-4 py-3 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Entrepreneurship, Technology, Personal Growth"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Priority / Sort Order
              </label>
              <input
                type="number"
                value={formData.displayOrder ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Show Notes
            </label>
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full episode summary, topics discussed, key insights, and timestamps..."
              className="w-full px-4 py-3 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441] transition-all resize-y"
            />
          </div>
        </div>

        {/* Section 2: Media & YouTube Integration */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            2. YouTube Video & Artwork
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  YouTube Video ID or Full URL <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.youtubeVideoId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const sanitized = sanitizeYoutubeId(val);
                      setFormData({
                        ...formData,
                        youtubeVideoId: sanitized,
                        thumbnailUrl:
                          formData.thumbnailUrl ||
                          `https://img.youtube.com/vi/${sanitized}/hqdefault.jpg`,
                      });
                    }}
                    placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
                  />
                  <Tv className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  You can paste either the 11-character video ID or the complete YouTube URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custom Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl || ""}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="Defaults automatically to YouTube high-res thumbnail"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-[#D9A441] focus:ring-[#D9A441] bg-[#090D1A]"
                />
                <label htmlFor="isFeatured" className="text-xs text-slate-200 cursor-pointer select-none">
                  Highlight this episode in the homepage Featured Spotlight
                </label>
              </div>
            </div>

            {/* Video Preview Card */}
            <div className="bg-[#090D1A] border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[180px]">
              {previewThumbnail ? (
                <div className="w-full space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-md">
                    <img
                      src={previewThumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/640x360/0E1326/D9A441?text=Video+Preview";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#D9A441]/90 text-[#0E1326] flex items-center justify-center shadow-lg">
                        <Tv className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Live Thumbnail Preview</span>
                </div>
              ) : (
                <div className="text-slate-400 space-y-1">
                  <Tv className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Provide a YouTube Video ID to preview artwork</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Guest Information */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            3. Featured Guest Credits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Guest Full Name
              </label>
              <input
                type="text"
                value={formData.guestName || ""}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Guest Title / Role / Organization
              </label>
              <input
                type="text"
                value={formData.guestRole || ""}
                onChange={(e) => setFormData({ ...formData, guestRole: e.target.value })}
                placeholder="e.g. Founder & CEO, FinTech Innovations"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Audio Streaming Links */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            4. Audio Streaming Distribution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Spotify Episode Link
              </label>
              <input
                type="url"
                value={formData.spotifyUrl || ""}
                onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                placeholder="https://open.spotify.com/episode/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Apple Podcasts Episode Link
              </label>
              <input
                type="url"
                value={formData.applePodcastsUrl || ""}
                onChange={(e) => setFormData({ ...formData, applePodcastsUrl: e.target.value })}
                placeholder="https://podcasts.apple.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#D9A441]"
              />
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/admin/episodes"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-center transition-colors"
          >
            Cancel & Exit
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Saving to SQL Server..."
                  : isEditMode
                  ? "Update Episode"
                  : "Publish Episode"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
