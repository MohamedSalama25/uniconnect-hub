import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = true 
}: RatingStarsProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating);
        const partial = index === Math.floor(rating) && rating % 1 > 0;
        
        return (
          <Star
            key={index}
            className={cn(
              sizes[size],
              'transition-colors',
              filled || partial ? 'text-accent fill-accent' : 'text-muted-foreground/30'
            )}
          />
        );
      })}
      {showValue && (
        <span className={cn('font-medium mr-1', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
