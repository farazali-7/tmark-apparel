"use client"

import { ImageIcon, MessageSquareReply, ThumbsUp } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { StarRating } from "@/components/shared/star-rating"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ReviewActions } from "@/features/reviews/components/review-actions"
import {
  FeaturedBadge,
  InsightBadge,
  PinnedBadge,
  ReviewStatusBadge,
  VerifiedBadge,
} from "@/features/reviews/components/review-badges"
import { formatRelative } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { ReviewDetail } from "@/types"

interface ReviewCardProps {
  review: ReviewDetail
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (review: ReviewDetail) => void
  onDelete: (review: ReviewDetail) => void
}

export function ReviewCard({
  review,
  selected,
  onSelectToggle,
  onView,
  onDelete,
}: ReviewCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onView(review)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView(review)
        }
      }}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group cursor-pointer gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "ring-2 ring-gold/50"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="relative">
          <EntityAvatar initials={review.customer.initials} seed={review.customer.id} className="size-9" />
          <Checkbox
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() => onSelectToggle(review.id)}
            aria-label={`Select ${review.reference}`}
            className={cn(
              "absolute -top-1.5 -left-1.5 bg-card transition-opacity",
              !selected && "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">{review.customer.name}</span>
            {review.verifiedPurchase ? <VerifiedBadge /> : null}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">
              {formatRelative(review.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <ReviewStatusBadge status={review.status} />
          <ReviewActions review={review} onView={onView} onDelete={onDelete} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">{review.title}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{review.body}</p>
      </div>

      {review.insights.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {review.insights.slice(0, 3).map((insight) => (
            <InsightBadge
              key={insight.label}
              label={insight.label}
              sentiment={insight.sentiment}
            />
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2.5 rounded-lg border bg-muted/30 p-2">
        <ProductThumb seed={review.product.image} name={review.product.name} className="size-8" iconClassName="size-3.5" />
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {review.product.name}
        </span>
        {review.photos.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular">
            <ImageIcon className="size-3.5" />
            {review.photos.length}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 tabular">
          <ThumbsUp className="size-3.5" /> {review.helpfulCount} helpful
        </span>
        <span className="flex items-center gap-1.5">
          {review.pinned ? <PinnedBadge /> : null}
          {review.featured ? <FeaturedBadge /> : null}
          {review.reply ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <MessageSquareReply className="size-3.5" /> Replied
            </span>
          ) : null}
        </span>
      </div>
    </Card>
  )
}
