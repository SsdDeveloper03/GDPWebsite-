import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Search,
  RefreshCw,
  Eye,
  Send,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { ApiContactInquiry, PaginationMeta } from "../../services/apiClient";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { Pagination } from "../../components/admin/Pagination";
import { Toast } from "../../components/admin/Toast";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { ErrorState } from "../../components/admin/ErrorState";

export const ContactMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ApiContactInquiry[]>([]);
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

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getAdminMessages({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        search: debouncedSearch,
      });

      const list = response.messages || (response as any).data || [];
      setMessages(list);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      console.error("Failed to load messages:", err);
      setError(err.message || "Failed to retrieve contact inquiries from SQL Server.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
            Contact Inquiries & Sponsorship Leads
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming messages from audience members, brands, and prospective sponsors.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMessages()}
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
          {["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"].map((tab) => (
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
            placeholder="Search sender, subject, email..."
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
          title="Failed to Load Inquiries"
          message={error}
          onRetry={() => fetchMessages()}
        />
      ) : messages.length === 0 ? (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800">
          <EmptyState
            icon={<Mail className="w-6 h-6 text-slate-500" />}
            title="No inquiries found"
            description={
              searchTerm
                ? `No messages match your search query "${searchTerm}".`
                : "No inquiries currently match the selected status filter."
            }
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0F1426] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject & Excerpt</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-slate-800/40 transition-colors group ${
                      msg.status === "NEW" ? "bg-blue-500/5 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        {msg.status === "NEW" && (
                          <span
                            className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5 shadow-sm shadow-blue-400/50"
                            title="Unread New Message"
                          />
                        )}
                        <div>
                          <Link
                            to={`/admin/messages/${msg.id}`}
                            className="text-white group-hover:text-[#D9A441] transition-colors truncate block"
                          >
                            {msg.name}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {msg.email}
                          </div>
                          {msg.phone && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              {msg.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {msg.subject || "General Inquiry"}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5 font-normal">
                        {msg.message}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap font-normal">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "GDP Podcast Inquiry")}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#D9A441] hover:bg-slate-800 transition-colors"
                          title="Compose Email Reply"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/admin/messages/${msg.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/60"
                          title="Read Full Inquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
