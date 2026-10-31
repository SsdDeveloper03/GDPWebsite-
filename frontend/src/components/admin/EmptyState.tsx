import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-16 px-4 space-y-4 max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
        {icon || <FolderOpen className="w-6 h-6 text-slate-500" />}
      </div>
      <div>
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      {action && (
        <div className="pt-2">
          <button
            onClick={action.onClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0E1326] bg-[#D9A441] hover:bg-[#F2C94C] shadow-sm transition-all cursor-pointer"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};
