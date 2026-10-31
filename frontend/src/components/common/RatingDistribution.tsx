import React from 'react';
import { Star } from 'lucide-react';

interface RatingDistributionProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  activeFilter?: number | null;
  onFilterChange?: (stars: number | null) => void;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews,
  activeFilter = null,
  onFilterChange,
}) => {
  const starsList = [5, 4, 3, 2, 1] as const;

  return (
    <div className="space-y-2.5 w-full">
      {starsList.map((stars) => {
        const count = distribution[stars] || 0;
        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        const isSelected = activeFilter === stars;

        return (
          <button
            key={stars}
            type="button"
            onClick={() => {
              if (onFilterChange) {
                onFilterChange(isSelected ? null : stars);
              }
            }}
            className={`w-full flex items-center gap-3 text-xs sm:text-sm group p-1.5 rounded-lg transition-colors text-left ${
              isSelected ? 'bg-orange-500/15 border border-orange-500/30' : 'hover:bg-slate-800/40'
            }`}
          >
            {/* Star label */}
            <div className="flex items-center gap-1 w-8 sm:w-10 font-medium text-slate-300 shrink-0">
              <span>{stars}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </div>

            {/* Progress bar track */}
            <div className="flex-1 h-2.5 bg-slate-800/80 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                    : 'bg-amber-400 group-hover:bg-amber-300'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Percentage & count */}
            <div className="w-14 text-right text-xs text-slate-400 font-mono shrink-0">
              <span className="tabular-nums">{percentage}%</span>
              <span className="text-slate-500 text-[10px] ml-1">({count})</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
