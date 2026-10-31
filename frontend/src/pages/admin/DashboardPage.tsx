import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  UserCheck,
  Mail,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  Activity,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { AdminDashboardStats } from "../../services/apiClient";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const response = await api.getDashboardStats();
      if (response.stats) {
        setStats(response.stats);
      } else {
        throw new Error("Invalid stats response from server.");
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard metrics from SQL Server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatTimeAgo = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("LOGIN")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (action.includes("CREATED") || action.includes("APPROVED")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (action.includes("ARCHIVED") || action.includes("REJECTED")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Executive Operations Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time podcast performance and community interaction metrics directly from SQL Server.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#D9A441]" : ""}`} />
            <span>{isRefreshing ? "Updating..." : "Refresh Stats"}</span>
          </button>
          <Link
            to="/admin/episodes"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Episode</span>
          </Link>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchStats()}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeletons while Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-800/40 border border-slate-800/70 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
              <div className="w-24 h-4 bg-slate-700/50 rounded" />
              <div className="w-16 h-6 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* =========================================================================
              KPI Metric Cards
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Episodes */}
            <div className="p-5 rounded-2xl bg-[#0F1426] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Episodes
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.episodes.total}
                </span>
                <Link
                  to="/admin/episodes"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {stats.episodes.published} published
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {stats.episodes.draft} drafts
                </span>
                {stats.episodes.archived > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Archive className="w-3 h-3" />
                      {stats.episodes.archived}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 2. Published Episodes */}
            <div className="p-5 rounded-2xl bg-[#0F1426] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Public Broadcasts
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {stats.episodes.published}
                </span>
                <span className="text-[11px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live on Website
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                Streaming on YouTube, Spotify & Apple
              </div>
            </div>

            {/* 3. Guest Proposals */}
            <div className="p-5 rounded-2xl bg-[#0F1426] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Guest Applications
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#D9A441]/10 text-[#D9A441] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.guestApplications.new}
                </span>
                <Link
                  to="/admin/guests"
                  className="text-xs font-semibold text-[#D9A441] hover:text-[#F2C94C] flex items-center gap-1"
                >
                  Review <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{stats.guestApplications.total} total proposals received</span>
                {stats.guestApplications.new > 0 && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded">
                    Action Needed
                  </span>
                )}
              </div>
            </div>

            {/* 4. Contact Inquiries */}
            <div className="p-5 rounded-2xl bg-[#0F1426] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contact Inquiries
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {stats.contactMessages.new}
                </span>
                <Link
                  to="/admin/messages"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Inbox <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{stats.contactMessages.total} total messages</span>
                {stats.contactMessages.new > 0 && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded">
                    Unread
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              Two-Column Layout: Operations Hub & Recent Audit Trail
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Operations Actions */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0F1426] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-serif tracking-tight flex items-center gap-2">
                <span>Administrative Actions</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct shortcuts for publishing new video episodes, evaluating candidate applications, or responding to prospective sponsors.
              </p>

              <div className="space-y-2 pt-2">
                <Link
                  to="/admin/episodes"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-[#D9A441]" />
                    <span>Create & Organize Episodes</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/admin/guests"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Review Guest Applications</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/admin/messages"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Review Inbound Inquiries</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Real Recent Activity / Audit Log Feed */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F1426] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white font-serif tracking-tight flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#D9A441]" />
                    <span>Recent Administrative Audit Events</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    SQL Server dbo.AuditLog
                  </span>
                </div>

                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getActionBadgeColor(
                                activity.action
                              )}`}
                            >
                              {activity.action.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs font-medium text-slate-300">
                              on {activity.entity}
                            </span>
                          </div>
                          {activity.details && (
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                              {activity.details}
                            </p>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 space-y-2">
                    <Activity className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-xs">No audit events recorded yet.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Immutable tamper-evident security audit stream</span>
                <span>Protected by AES-256 TLS</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
