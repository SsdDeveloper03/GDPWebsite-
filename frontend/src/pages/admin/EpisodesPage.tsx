import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Video,
  Plus,
  Search,
  Star,
  Edit2,
  Archive,
  RefreshCw,
  ExternalLink,
  Tv,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { ApiEpisode, PaginationMeta } from "../../services/apiClient";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Pagination } from "../../components/admin/Pagination";
import { ConfirmationDialog } from "../../components/admin/ConfirmationDialog";
import { Toast } from "../../components/admin/Toast";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { ErrorState } from "../../components/admin/ErrorState";

export const EpisodesPage: React.FC = () => {
  const location = useLocation();
  const [episodes, setEpisodes] = useState<ApiEpisode[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Archive confirmation target
  const [archiveTarget, setArchiveTarget] = useState<ApiEpisode | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Check if routed with a toast message in state
  useEffect(() => {
    if (location.state && (location.state as any).toastMessage) {
      setToast({
        type: "success",
        message: (location.state as any).toastMessage,
      });
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchEpisodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getAdminEpisodes({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search: debouncedSearch,
      });

      const list = response.episodes || (response as any).data || [];
      setEpisodes(list);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      console.error("Failed to load episodes:", err);
      setError(err.message || "Failed to retrieve episodes from SQL Server.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    try {
      setIsArchiving(true);
      await api.archiveAdminEpisode(archiveTarget.id);
      setToast({
        type: "success",
        message: `Episode "${archiveTarget.title}" archived successfully.`,
      });
      setArchiveTarget(null);
      fetchEpisodes();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to archive episode.",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const toggleFeatured = async (ep: ApiEpisode) => {
    try {
      await api.updateAdminEpisode(ep.id, { isFeatured: !ep.isFeatured });
      setToast({
        type: "success",
        message: `Episode "${ep.title}" ${!ep.isFeatured ? "marked as featured" : "removed from featured"}.`,
      });
      fetchEpisodes();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to toggle featured status.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog for Archiving */}
      <ConfirmationDialog
        isOpen={Boolean(archiveTarget)}
        title="Archive Podcast Episode?"
        message={`Are you sure you want to archive "${archiveTarget?.title}"? Archiving hides the episode from the public catalog while preserving historical metrics and references in SQL Server.`}
        confirmLabel={isArchiving ? "Archiving..." : "Archive Episode"}
        cancelLabel="Cancel"
        isDangerous={true}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveTarget(null)}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Podcast Episode Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, publish, organize, and archive video episodes and interviews.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchEpisodes()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#D9A441]" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/episodes/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Episode</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F1426] border border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab
                  ? "bg-[#D9A441] text-[#0E1326] shadow-sm font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title or guest..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D9A441]"
          />
        </div>
      </div>

      {/* Main Table or Loading Skeleton */}
      {isLoading ? (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800 p-4">
          <LoadingSkeleton type="table" count={5} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Episodes"
          message={error}
          onRetry={() => fetchEpisodes()}
        />
      ) : episodes.length === 0 ? (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800">
          <EmptyState
            icon={<Tv className="w-6 h-6 text-slate-500" />}
            title="No episodes found"
            description={
              searchTerm
                ? `No episodes match your search query "${searchTerm}". Try resetting filters.`
                : "No podcast episodes currently match the selected criteria."
            }
            action={{
              label: "Create First Episode",
              onClick: () => (window.location.href = "/admin/episodes/new"),
            }}
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Episode Title</th>
                  <th className="py-3.5 px-4">Guest</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {episodes.map((ep) => (
                  <tr key={ep.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {ep.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {ep.thumbnailUrl ? (
                          <img
                            src={ep.thumbnailUrl}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/50"
                          />
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/episodes/${ep.id}/edit`}
                            className="font-bold text-white group-hover:text-[#D9A441] transition-colors truncate max-w-xs block"
                          >
                            {ep.title}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>YT ID: {ep.youtubeVideoId}</span>
                            <a
                              href={`https://youtube.com/watch?v=${ep.youtubeVideoId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-red-400"
                              title="Watch on YouTube"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {ep.guestName ? (
                        <div>
                          <div className="font-semibold text-slate-200">{ep.guestName}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {ep.guestRole || "Featured Guest"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Solo / Editorial</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        {ep.category || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={ep.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(ep)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          ep.isFeatured
                            ? "text-[#D9A441] hover:text-[#F2C94C] bg-amber-500/10"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                        title={ep.isFeatured ? "Featured on Home" : "Mark as Featured"}
                      >
                        <Star className={`w-4 h-4 ${ep.isFeatured ? "fill-[#D9A441]" : ""}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {ep.publishedAt
                        ? new Date(ep.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Not published"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/episodes/${ep.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Episode Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {ep.status !== "ARCHIVED" && (
                          <button
                            onClick={() => setArchiveTarget(ep)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Soft-Archive Episode"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-900/40">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
