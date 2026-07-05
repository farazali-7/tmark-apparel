import { CalendarClock, FileEdit, Layers, Package, Star } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatNumber } from "@/lib/constants"
import type { Collection } from "@/types"

interface CollectionsSummaryProps {
  collections: Collection[]
  loading?: boolean
}

export function CollectionsSummary({
  collections,
  loading = false,
}: CollectionsSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const total = collections.length
  const featured = collections.filter((c) => c.featured).length
  const scheduled = collections.filter((c) => c.status === "scheduled").length
  const draft = collections.filter((c) => c.status === "draft").length
  const products = collections.reduce((sum, c) => sum + c.productCount, 0)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Layers}
        label="Total Collections"
        value={formatNumber(total)}
        description="Live, scheduled & draft"
        trend={{ value: 3.5, direction: "up" }}
      />
      <SummaryCard
        icon={Star}
        label="Featured"
        value={formatNumber(featured)}
        description="On the storefront hero"
        accent
      />
      <SummaryCard
        icon={CalendarClock}
        label="Scheduled"
        value={formatNumber(scheduled)}
        description="Queued to publish"
      />
      <SummaryCard
        icon={FileEdit}
        label="Draft"
        value={formatNumber(draft)}
        description="Not yet live"
      />
      <SummaryCard
        icon={Package}
        label="Products Included"
        value={formatNumber(products)}
        description="Across all collections"
        trend={{ value: 5.9, direction: "up" }}
      />
    </div>
  )
}
