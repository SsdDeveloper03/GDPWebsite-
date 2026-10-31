import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  linkTo?: string;
  linkLabel?: string;
  subtext?: React.ReactNode;
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColorClass = "text-[#D9A441]",
  iconBgClass = "bg-[#D9A441]/10",
  linkTo,
  linkLabel = "View Details",
  subtext,
  badge,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0F1426] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className={`w-9 h-9 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {value}
          </span>
          {badge}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="truncate">{subtext}</div>
        {linkTo && (
          <Link
            to={linkTo}
            className="font-semibold text-[#D9A441] hover:text-[#F2C94C] flex items-center gap-1 shrink-0 ml-2"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
