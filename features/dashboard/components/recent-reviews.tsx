import { ArrowUpRight } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { StarRating } from "@/components/shared/star-rating"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { REVIEW_STATUS_META, formatRelative } from "@/lib/constants"
import { reviews } from "@/lib/mock-data/reviews"

export function RecentReviews() {
  return (
    <ChartCard
      title="Recent Reviews"
      description="Latest product feedback"
      action={
        <Button variant="ghost" size="sm">
          View all <ArrowUpRight className="size-3.5" />
        </Button>
      }
    >
      <ul className="space-y-4">
        {reviews.slice(0, 4).map((review) => (
          <li key={review.id} className="flex gap-3">
            <EntityAvatar
              initials={review.customerInitials}
              seed={review.customerName}
              className="size-9"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{review.customerName}</span>
                <StatusBadge
                  label={REVIEW_STATUS_META[review.status].label}
                  tone={REVIEW_STATUS_META[review.status].tone}
                />
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="truncate text-xs text-muted-foreground">
                  {review.product}
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {review.comment}
              </p>
              <p className="text-[0.7rem] text-muted-foreground/70">
                {formatRelative(review.createdAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
