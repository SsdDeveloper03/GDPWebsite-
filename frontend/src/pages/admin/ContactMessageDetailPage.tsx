import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  Send,
  Info,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { ApiContactInquiry } from "../../services/apiClient";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { ErrorState } from "../../components/admin/ErrorState";
import { Toast } from "../../components/admin/Toast";

export const ContactMessageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [message, setMessage] = useState<ApiContactInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMessage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getAdminMessageById(id);
        const data = response.contact || (response as any).data;
        if (!data) {
          throw new Error("Message not found.");
        }
        setMessage(data);

        // Auto mark as READ if currently NEW
        if (data.status === "NEW") {
          try {
            const updateRes = await api.updateAdminMessageStatus(id, "READ");
            const updated = updateRes.contact || (updateRes as any).data || { ...data, status: "READ" as const };
            setMessage(updated);
          } catch (e) {
            console.warn("Auto-mark as read failed:", e);
          }
        }
      } catch (err: any) {
        console.error("Failed to load message:", err);
        setError(err.message || "Failed to retrieve inquiry record.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessage();
  }, [id]);

  const handleStatusChange = async (newStatus: "NEW" | "READ" | "REPLIED" | "ARCHIVED") => {
    if (!message || !id) return;
    try {
      setIsUpdatingStatus(true);
      const res = await api.updateAdminMessageStatus(id, newStatus);
      const updated = res.contact || (res as any).data || { ...message, status: newStatus };
      setMessage(updated);
      setToast({
        type: "success",
        message: `Message status updated to "${newStatus}".`,
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to update message status.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Link
          to="/admin/messages"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Messages</span>
        </Link>
        <ErrorState
          title="Message Not Found"
          message={error || "The requested message record could not be loaded."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to="/admin/messages"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contact Inquiries</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          Received: {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Main Message Card */}
      <div className="bg-[#0F1426] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Header Block with Sender Name & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  {message.subject || "General Inquiry"}
                </h2>
                <StatusBadge status={message.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>From: {message.name}</span>
              </p>
            </div>
          </div>

          {/* Workflow Status Controls */}
          <div className="space-y-1.5 sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Workflow Status
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["NEW", "READ", "REPLIED", "ARCHIVED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  disabled={isUpdatingStatus || message.status === st}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-default ${
                    message.status === st
                      ? "bg-[#D9A441] text-[#0E1326] font-bold shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sender Contact Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-[#D9A441] uppercase tracking-wider">
              Sender Email
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{message.email}</span>
              <a
                href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || "GDP Podcast Inquiry")}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D9A441] hover:underline"
              >
                <Send className="w-3 h-3" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-[#D9A441] uppercase tracking-wider">
              Telephone Number
            </div>
            <div>
              {message.phone ? (
                <a
                  href={`tel:${message.phone}`}
                  className="text-white hover:text-[#D9A441] font-mono"
                >
                  {message.phone}
                </a>
              ) : (
                <span className="text-slate-500 italic">Not provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Informative Security Callout */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Marking an inquiry as <strong>REPLIED</strong> updates internal administrative tracking in SQL Server. It does not send an email from the server. Use the <em>"Send Email"</em> action above to write back to the sender from your preferred mail client.
          </div>
        </div>

        {/* Full Inbound Message Body */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            Message Content
          </div>
          <div className="p-6 rounded-2xl bg-[#090D1A] border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {message.message}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link
            to="/admin/messages"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors"
          >
            Back to List
          </Link>

          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || "GDP Podcast Inquiry")}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-lg shadow-[#D9A441]/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Email Client to Reply</span>
          </a>
        </div>
      </div>
    </div>
  );
};
