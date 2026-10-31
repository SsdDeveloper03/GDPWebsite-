import React from "react";
import { CheckCircle2, Clock, Archive, UserCheck, XCircle, Mail, Eye } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "episode" | "guest" | "message";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalized = status.toUpperCase();

  const getStyleAndIcon = () => {
    switch (normalized) {
      case "PUBLISHED":
        return {
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3 h-3" />,
          label: "Published",
        };
      case "DRAFT":
        return {
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          icon: <Clock className="w-3 h-3" />,
          label: "Draft",
        };
      case "NEW":
        return {
          style: "bg-blue-500/15 text-blue-400 border-blue-500/30",
          icon: <Mail className="w-3 h-3" />,
          label: "New",
        };
      case "CONTACTED":
        return {
          style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          icon: <Clock className="w-3 h-3" />,
          label: "Contacted",
        };
      case "APPROVED":
        return {
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: <UserCheck className="w-3 h-3" />,
          label: "Approved",
        };
      case "REJECTED":
        return {
          style: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          icon: <XCircle className="w-3 h-3" />,
          label: "Rejected",
        };
      case "READ":
        return {
          style: "bg-slate-800 text-slate-300 border-slate-700",
          icon: <Eye className="w-3 h-3" />,
          label: "Read",
        };
      case "REPLIED":
        return {
          style: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3 h-3" />,
          label: "Replied",
        };
      case "ARCHIVED":
        return {
          style: "bg-slate-800 text-slate-400 border-slate-700",
          icon: <Archive className="w-3 h-3" />,
          label: "Archived",
        };
      default:
        return {
          style: "bg-slate-800 text-slate-300 border-slate-700",
          icon: null,
          label: status,
        };
    }
  };

  const { style, icon, label } = getStyleAndIcon();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
