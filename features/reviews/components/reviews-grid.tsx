"use client"

import { ReviewCard } from "@/features/reviews/components/review-card"
import type { ReviewDetail } from "@/types"

interface ReviewsGridProps {
  data: ReviewDetail[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (review: ReviewDetail) => void
  onDelete: (review: ReviewDetail) => void
}

export function ReviewsGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onDelete,
}: ReviewsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          selected={selectedIds.includes(review.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
