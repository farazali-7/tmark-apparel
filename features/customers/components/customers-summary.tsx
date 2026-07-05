import { BellRing, Ruler, ShoppingBag, TrendingUp, Users } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatCompactCurrency, formatNumber } from "@/lib/constants"
import type { CustomerDetail } from "@/types"

interface CustomersSummaryProps {
  customers: CustomerDetail[]
  loading?: boolean
}

export function CustomersSummary({
  customers,
  loading = false,
}: CustomersSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const total = customers.length
  const avgLtv = total
    ? Math.round(customers.reduce((s, c) => s + c.lifetimeValue, 0) / total)
    : 0
  const avgOrders = total
    ? customers.reduce((s, c) => s + c.ordersCount, 0) / total
    : 0
  const withMeasurements = customers.filter((c) => c.hasMeasurements).length
  const followUps = customers.filter((c) => c.followUp).length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Users}
        label="Total Customers"
        value={formatNumber(total)}
        description="Across all markets"
        trend={{ value: 6.2, direction: "up" }}
      />
      <SummaryCard
        icon={TrendingUp}
        label="Avg Lifetime Value"
        value={formatCompactCurrency(avgLtv)}
        description="Per customer, all-time"
        trend={{ value: 9.4, direction: "up" }}
        accent
      />
      <SummaryCard
        icon={ShoppingBag}
        label="Avg Orders"
        value={avgOrders.toFixed(1)}
        description="Orders per customer"
      />
      <SummaryCard
        icon={Ruler}
        label="With Measurements"
        value={formatNumber(withMeasurements)}
        description="Saved tailoring profiles"
      />
      <SummaryCard
        icon={BellRing}
        label="Pending Follow-ups"
        value={formatNumber(followUps)}
        description="Flagged for outreach"
        trend={
          followUps > 0 ? { value: 2, direction: "up", invert: true } : undefined
        }
      />
    </div>
  )
}
