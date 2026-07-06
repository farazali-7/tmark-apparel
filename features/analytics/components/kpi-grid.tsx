import {
  CircleDollarSign,
  Globe2,
  Receipt,
  Repeat,
  Scissors,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { MetricCard, MetricCardSkeleton } from "@/components/shared/metric-card"
import { executiveMetrics } from "@/lib/mock-data/analytics"

const ICONS: Record<string, LucideIcon> = {
  revenue: CircleDollarSign,
  profit: TrendingUp,
  orders: ShoppingBag,
  aov: Receipt,
  customers: Users,
  returning: Repeat,
  conversion: Target,
  "custom-orders": Scissors,
  international: Globe2,
}

export function KpiGrid({ loading = false }: { loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {executiveMetrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} icon={ICONS[metric.id] ?? CircleDollarSign} />
      ))}
    </div>
  )
}
