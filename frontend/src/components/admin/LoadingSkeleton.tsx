import React from "react";

interface SkeletonProps {
  type?: "table" | "cards" | "detail" | "form";
  count?: number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({ type = "table", count = 5 }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-800/40 border border-slate-800/70 p-5 space-y-3"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
            <div className="w-24 h-4 bg-slate-700/50 rounded" />
            <div className="w-16 h-6 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-800/60 rounded-xl" />
        <div className="p-6 rounded-3xl bg-[#0F1426] border border-slate-800 space-y-4">
          <div className="h-6 w-1/3 bg-slate-800/80 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-14 bg-slate-800/40 rounded-xl" />
            <div className="h-14 bg-slate-800/40 rounded-xl" />
          </div>
          <div className="h-28 bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-800/60 rounded-xl" />
        <div className="p-8 rounded-3xl bg-[#0F1426] border border-slate-800 space-y-5">
          <div className="h-10 bg-slate-800/50 rounded-xl" />
          <div className="h-24 bg-slate-800/50 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-slate-800/50 rounded-xl" />
            <div className="h-10 bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className="divide-y divide-slate-800/60 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-slate-800/60 shrink-0" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 bg-slate-800/70 rounded w-3/4" />
              <div className="h-3 bg-slate-800/40 rounded w-1/2" />
            </div>
          </div>
          <div className="w-20 h-6 bg-slate-800/50 rounded-full" />
          <div className="w-16 h-8 bg-slate-800/60 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
