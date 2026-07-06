import { CalendarClock, CheckCircle2, FileEdit, Images, TimerOff } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatNumber } from "@/lib/constants"
import type { Banner } from "@/types"

interface BannersSummaryProps {
  banners: Banner[]
  loading?: boolean
}

export function BannersSummary({ banners, loading = false }: BannersSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const total = banners.length
  const published = banners.filter((b) => b.status === "published").length
  const scheduled = banners.filter((b) => b.status === "scheduled").length
  const draft = banners.filter((b) => b.status === "draft").length
  const expired = banners.filter((b) => b.status === "expired").length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Images}
        label="Total Campaigns"
        value={formatNumber(total)}
        description="Across the storefront"
      />
      <SummaryCard
        icon={CheckCircle2}
        label="Published"
        value={formatNumber(published)}
        description="Live right now"
        trend={{ value: 5, direction: "up" }}
        accent
      />
      <SummaryCard
        icon={CalendarClock}
        label="Scheduled"
        value={formatNumber(scheduled)}
        description="Queued to launch"
      />
      <SummaryCard
        icon={FileEdit}
        label="Draft"
        value={formatNumber(draft)}
        description="Not yet live"
      />
      <SummaryCard
        icon={TimerOff}
        label="Expired"
        value={formatNumber(expired)}
        description="Past campaigns"
      />
    </div>
  )
}
