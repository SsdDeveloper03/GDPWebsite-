import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  autoCloseDurationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  autoCloseDurationMs = 5000,
}) => {
  useEffect(() => {
    if (autoCloseDurationMs > 0) {
      const timer = setTimeout(onClose, autoCloseDurationMs);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDurationMs, onClose]);

  const styles = {
    success: {
      bg: "bg-emerald-950/80 border-emerald-500/30 text-emerald-200",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: "bg-rose-950/80 border-rose-500/30 text-rose-200",
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    },
    info: {
      bg: "bg-blue-950/80 border-blue-500/30 text-blue-200",
      icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md text-xs font-medium max-w-md animate-fade-in ${styles.bg}`}
    >
      {styles.icon}
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss toast notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
