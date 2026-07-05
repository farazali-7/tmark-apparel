import { Clock, Flag, MessageSquareReply, Star, Users } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatNumber } from "@/lib/constants"
import type { ReviewDetail } from "@/types"

interface ReviewsSummaryProps {
  reviews: ReviewDetail[]
  loading?: boolean
}

export function ReviewsSummary({ reviews, loading = false }: ReviewsSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const total = reviews.length
  const avg = total
    ? reviews.reduce((s, r) => s + r.rating, 0) / total
    : 0
  const pending = reviews.filter((r) => r.status === "pending").length
  const flagged = reviews.filter(
    (r) => r.status === "flagged" || r.reportedCount > 0
  ).length
  const published = reviews.filter((r) => r.status === "approved").length
  const replied = reviews.filter((r) => r.reply).length
  const responseRate = published ? Math.round((replied / published) * 100) : 0

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Users}
        label="Total Reviews"
        value={formatNumber(total)}
        description="Across all products"
        trend={{ value: 7.5, direction: "up" }}
      />
      <SummaryCard
        icon={Star}
        label="Average Rating"
        value={avg.toFixed(2)}
        description="Weighted across catalogue"
        trend={{ value: 1.2, direction: "up" }}
        accent
      />
      <SummaryCard
        icon={Clock}
        label="Pending Approval"
        value={formatNumber(pending)}
        description="Awaiting moderation"
      />
      <SummaryCard
        icon={Flag}
        label="Reported"
        value={formatNumber(flagged)}
        description="Flagged for review"
        trend={
          flagged > 0 ? { value: 1, direction: "up", invert: true } : undefined
        }
      />
      <SummaryCard
        icon={MessageSquareReply}
        label="Response Rate"
        value={`${responseRate}%`}
        description="Approved reviews replied to"
      />
    </div>
  )
}
