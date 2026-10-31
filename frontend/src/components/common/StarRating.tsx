import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5 (e.g. 4.9 or integer)
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-1" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = currentRating >= starValue;
          const isPartial = !isFilled && currentRating > idx && currentRating < starValue;

          return (
            <button
              key={idx}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`transition-transform duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-120 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm'
                  : 'cursor-default'
              }`}
              aria-label={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors duration-150 ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                    : isPartial
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-600 fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-slate-200 tabular-nums ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
