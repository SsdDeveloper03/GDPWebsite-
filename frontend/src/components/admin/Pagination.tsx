import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../services/apiClient";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  isLoading = false,
}) => {
  const { page, totalPages, total, limit } = pagination;

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-slate-800 text-xs text-slate-400">
      <div>
        Showing <span className="font-semibold text-white">{startItem}</span> to{" "}
        <span className="font-semibold text-white">{endItem}</span> of{" "}
        <span className="font-semibold text-[#D9A441]">{total}</span> records
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800/60 transition-colors border border-slate-700/50 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                disabled={isLoading || p === page}
                className={`w-8 h-8 rounded-xl font-semibold transition-all ${
                  p === page
                    ? "bg-[#D9A441] text-[#0E1326] font-bold shadow-md shadow-[#D9A441]/20"
                    : "bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-700/50"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-2 text-slate-500">
                {p}
              </span>
            )
          )}
        </div>

        <span className="sm:hidden text-slate-300 px-2 font-medium">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800/60 transition-colors border border-slate-700/50 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
