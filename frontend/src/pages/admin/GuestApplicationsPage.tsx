import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Search,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  Eye,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { ApiGuestApplication, PaginationMeta } from "../../services/apiClient";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Pagination } from "../../components/admin/Pagination";
import { Toast } from "../../components/admin/Toast";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { ErrorState } from "../../components/admin/ErrorState";

export const GuestApplicationsPage: React.FC = () => {
  const [guests, setGuests] = useState<ApiGuestApplication[]>([]);
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getAdminGuests({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search: debouncedSearch,
      });

      const list = response.guests || (response as any).data || [];
      setGuests(list);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      console.error("Failed to load guests:", err);
      setError(err.message || "Failed to retrieve guest proposals from SQL Server.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Guest Applications & Pitches
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review guest candidate submissions, manage screening stages, and maintain internal production notes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchGuests()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#D9A441]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F1426] border border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "NEW", "CONTACTED", "APPROVED", "REJECTED"].map((tab) => (
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

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate or topic..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D9A441]"
          />
        </div>
      </div>

      {/* Main Table or State */}
      {isLoading ? (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800 p-4">
          <LoadingSkeleton type="table" count={5} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Guest Applications"
          message={error}
          onRetry={() => fetchGuests()}
        />
      ) : guests.length === 0 ? (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800">
          <EmptyState
            icon={<UserCheck className="w-6 h-6 text-slate-500" />}
            title="No guest applications found"
            description={
              searchTerm
                ? `No applications match your search query "${searchTerm}".`
                : "No candidate proposals match the selected filter."
            }
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Role & Organization</th>
                  <th className="py-3.5 px-4">Proposed Topic</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Date Applied</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <Link
                          to={`/admin/guests/${guest.id}`}
                          className="font-bold text-white group-hover:text-[#D9A441] transition-colors truncate block"
                        >
                          {guest.fullName}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {guest.email}
                          </span>
                          {guest.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {guest.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{guest.companyRole || "Executive"}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">
                        {guest.expertiseArea || "Domain Specialist"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 line-clamp-2 max-w-xs leading-relaxed">
                        {guest.topicSummary}
                      </div>
                      {guest.linkedinOrWebsite && (
                        <a
                          href={
                            guest.linkedinOrWebsite.startsWith("http")
                              ? guest.linkedinOrWebsite
                              : `https://${guest.linkedinOrWebsite}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[#D9A441] hover:underline mt-0.5"
                        >
                          <span>Profile Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={guest.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(guest.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/guests/${guest.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/60"
                          title="View Full Application Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </Link>
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
