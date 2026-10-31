import React from 'react';
import { MessageSquarePlus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 sm:p-14 rounded-2xl glass-panel text-center max-w-xl mx-auto space-y-4 border border-dashed border-white/15 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
        {icon || <MessageSquarePlus className="w-7 h-7" />}
      </div>
      <div className="space-y-1.5">
        <h4 className="text-lg sm:text-xl font-bold text-white">{title}</h4>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
