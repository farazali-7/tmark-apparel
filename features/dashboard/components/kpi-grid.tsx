import {
  AlertTriangle,
  Clock,
  Package,
  Scissors,
  ShoppingCart,
  Users,
  Wallet,
  WalletCards,
  type LucideIcon,
} from "lucide-react"

import { MetricCard, MetricCardSkeleton } from "@/components/shared/metric-card"
import { metrics } from "@/lib/mock-data/dashboard"

const ICONS: Record<string, LucideIcon> = {
  "today-revenue": Wallet,
  "monthly-revenue": WalletCards,
  orders: ShoppingCart,
  "pending-orders": Clock,
  products: Package,
  customers: Users,
  "custom-orders": Scissors,
  "low-stock": AlertTriangle,
}

export function KpiGrid({ loading = false }: { loading?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <MetricCardSkeleton key={i} />)
        : metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              icon={ICONS[metric.id] ?? Package}
            />
          ))}
    </div>
  )
}
