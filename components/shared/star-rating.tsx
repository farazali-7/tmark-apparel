import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  className?: string
  showValue?: boolean
}

export function StarRating({
  rating,
  max = 5,
  className,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i < rating
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-xs text-muted-foreground tabular">
          {rating.toFixed(1)}
        </span>
      ) : null}
    </div>
  )
}
