import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserCheck,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Save,
  Clock,
  FileText,
  Info,
} from "lucide-react";
import { api } from "../../services/apiClient";
import type { ApiGuestApplication } from "../../services/apiClient";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { LoadingSkeleton } from "../../components/admin/LoadingSkeleton";
import { ErrorState } from "../../components/admin/ErrorState";
import { Toast } from "../../components/admin/Toast";

export const GuestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [guest, setGuest] = useState<ApiGuestApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchGuest = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getAdminGuestById(id);
        const data = response.guest || (response as any).data;
        if (!data) {
          throw new Error("Guest proposal not found.");
        }
        setGuest(data);
        setAdminNotes(data.adminNotes || "");
      } catch (err: any) {
        console.error("Failed to load guest proposal:", err);
        setError(err.message || "Failed to retrieve guest proposal from database.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuest();
  }, [id]);

  const handleStatusChange = async (newStatus: "NEW" | "CONTACTED" | "APPROVED" | "REJECTED") => {
    if (!guest || !id) return;
    try {
      setIsUpdatingStatus(true);
      const res = await api.updateAdminGuestStatus(id, newStatus);
      const updated = res.guest || (res as any).data || { ...guest, status: newStatus };
      setGuest(updated);
      setToast({
        type: "success",
        message: `Application marked as "${newStatus}".`,
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to update application status.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!guest || !id) return;
    try {
      setIsSavingNotes(true);
      const res = await api.updateAdminGuestNotes(id, adminNotes);
      const updated = res.guest || (res as any).data || { ...guest, adminNotes };
      setGuest(updated);
      setToast({
        type: "success",
        message: "Internal administrative notes saved to SQL Server.",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to save internal notes.",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Link
          to="/admin/guests"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guest Applications</span>
        </Link>
        <ErrorState
          title="Guest Record Not Found"
          message={error || "The requested applicant record could not be loaded."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          to="/admin/guests"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guest Applications</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Applied: {new Date(guest.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Applicant Dossier */}
      <div className="bg-[#0F1426] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Header Block with Applicant Name & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D9A441]/10 border border-[#D9A441]/20 flex items-center justify-center text-[#D9A441] shrink-0">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  {guest.fullName}
                </h2>
                <StatusBadge status={guest.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{guest.companyRole || "Executive / Domain Specialist"}</span>
              </p>
            </div>
          </div>

          {/* Workflow Status Controls */}
          <div className="space-y-1.5 sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Application Status
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["NEW", "CONTACTED", "APPROVED", "REJECTED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  disabled={isUpdatingStatus || guest.status === st}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:cursor-default ${
                    guest.status === st
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

        {/* Informative Security Callout */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Status changes update the database record and audit trail. Automated emails are not dispatched from this portal. Reach out directly to candidate using their contact coordinates below.
          </div>
        </div>

        {/* Two-Column Grid: Contact Details & Expertise Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-3">
            <div className="text-[10px] font-bold text-[#D9A441] uppercase tracking-wider">
              Contact Information
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email:
                </span>
                <a
                  href={`mailto:${guest.email}`}
                  className="text-white hover:text-[#D9A441] underline underline-offset-2 font-medium"
                >
                  {guest.email}
                </a>
              </div>
              {guest.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone:
                  </span>
                  <a
                    href={`tel:${guest.phone}`}
                    className="text-white hover:text-[#D9A441] font-mono"
                  >
                    {guest.phone}
                  </a>
                </div>
              )}
              {guest.linkedinOrWebsite && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Profile Link:
                  </span>
                  <a
                    href={guest.linkedinOrWebsite.startsWith("http") ? guest.linkedinOrWebsite : `https://${guest.linkedinOrWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D9A441] hover:underline truncate max-w-[200px]"
                  >
                    View External URL ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#090D1A] border border-slate-800 space-y-3">
            <div className="text-[10px] font-bold text-[#D9A441] uppercase tracking-wider">
              Domain Expertise
            </div>
            <div className="text-xs text-white bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              {guest.expertiseArea || "Not specified by applicant"}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Record created {new Date(guest.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Proposed Topic Summary */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
            Proposed Episode Topic & Pitch
          </div>
          <div className="p-5 rounded-2xl bg-[#090D1A] border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {guest.topicSummary}
          </div>
        </div>

        {/* Private Internal Admin Notes */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D9A441]" />
                <span>Internal Production & Screening Notes</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Private notes visible only to GDP administrators. Saved securely in SQL Server.
              </p>
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingNotes ? "Saving Notes..." : "Save Notes"}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Record interview screening dates, studio availability, pre-interview evaluation, or follow-up milestones..."
            className="w-full px-4 py-3 rounded-2xl bg-[#090D1A] border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all resize-y"
          />
        </div>
      </div>
    </div>
  );
};
