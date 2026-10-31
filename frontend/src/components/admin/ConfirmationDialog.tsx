import React from "react";
import { AlertTriangle, Archive, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningNote?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning";
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  warningNote,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "warning",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onClose,
  onCancel,
}) => {
  const handleClose = onCancel || onClose || (() => {});
  const effectiveType = isDangerous ? "danger" : type;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0F1426] border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              effectiveType === "danger"
                ? "bg-rose-500/10 text-rose-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {effectiveType === "danger" ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Archive className="w-6 h-6" />
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold font-serif text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {message}
          </p>
          {warningNote && (
            <div className="mt-3.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              {warningNote}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer ${
              effectiveType === "danger"
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
