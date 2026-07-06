import { CalendarClock, CircleDollarSign, Percent, Ticket, Zap } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatCompactCurrency, formatNumber, getCountdown } from "@/lib/constants"
import type { Promotion } from "@/types"

interface PromotionsSummaryProps {
  promotions: Promotion[]
  loading?: boolean
}

export function PromotionsSummary({
  promotions,
  loading = false,
}: PromotionsSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const active = promotions.filter((p) => p.status === "active").length
  const redeemed = promotions.reduce((s, p) => s + p.usedCount, 0)
  const revenue = promotions.reduce((s, p) => s + p.revenue, 0)
  const discountValues = promotions.filter((p) => p.type === "percentage")
  const avgDiscount = discountValues.length
    ? Math.round(
        discountValues.reduce((s, p) => s + p.value, 0) / discountValues.length
      )
    : 0
  const expiringThisWeek = promotions.filter((p) => {
    if (p.status !== "active") return false
    const cd = getCountdown(p.startDate, p.endDate)
    return cd.state === "soon"
  }).length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Zap}
        label="Active Promotions"
        value={formatNumber(active)}
        description="Running right now"
        trend={{ value: 4, direction: "up" }}
      />
      <SummaryCard
        icon={CircleDollarSign}
        label="Revenue Generated"
        value={formatCompactCurrency(revenue)}
        description="Attributed to promotions"
        trend={{ value: 14.2, direction: "up" }}
        accent
      />
      <SummaryCard
        icon={Ticket}
        label="Coupons Redeemed"
        value={formatNumber(redeemed)}
        description="Across all campaigns"
        trend={{ value: 8.6, direction: "up" }}
      />
      <SummaryCard
        icon={Percent}
        label="Average Discount"
        value={`${avgDiscount}%`}
        description="On percentage offers"
      />
      <SummaryCard
        icon={CalendarClock}
        label="Expiring This Week"
        value={formatNumber(expiringThisWeek)}
        description="Active offers ending soon"
        trend={
          expiringThisWeek > 0
            ? { value: 2, direction: "up", invert: true }
            : undefined
        }
      />
    </div>
  )
}
