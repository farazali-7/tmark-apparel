import { Banknote, PackageCheck, Scissors, ShoppingBag, Undo2 } from "lucide-react"

import {
  SummaryCard,
  SummaryCardSkeleton,
} from "@/components/shared/summary-card"
import { formatCurrency, formatNumber } from "@/lib/constants"
import type { OrderDetail, OrderStage } from "@/types"

interface OrdersSummaryProps {
  orders: OrderDetail[]
  loading?: boolean
}

const PRODUCTION_STAGES: OrderStage[] = [
  "measurements",
  "fabric",
  "tailoring",
  "quality_check",
]
const READY_STAGES: OrderStage[] = ["ready", "packed"]

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function OrdersSummary({ orders, loading = false }: OrdersSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const today = orders.filter((o) => isToday(o.createdAt))
  const revenueToday = today
    .filter((o) => o.payment.status === "paid" || o.payment.status === "partially_paid")
    .reduce((sum, o) => sum + o.payment.paid, 0)
  const inProduction = orders.filter((o) =>
    PRODUCTION_STAGES.includes(o.stage)
  ).length
  const readyToShip = orders.filter((o) => READY_STAGES.includes(o.stage)).length
  const refundRequests = orders.filter(
    (o) => o.stage === "refund_requested" || o.payment.status === "refund_requested"
  ).length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <SummaryCard
        icon={Banknote}
        label="Revenue Today"
        value={formatCurrency(revenueToday)}
        description="Collected across paid orders"
        trend={{ value: 12.4, direction: "up" }}
        accent
      />
      <SummaryCard
        icon={ShoppingBag}
        label="Orders Today"
        value={formatNumber(today.length)}
        description="New orders placed today"
        trend={{ value: 8.1, direction: "up" }}
      />
      <SummaryCard
        icon={Scissors}
        label="In Production"
        value={formatNumber(inProduction)}
        description="Measurements → quality check"
      />
      <SummaryCard
        icon={PackageCheck}
        label="Ready to Ship"
        value={formatNumber(readyToShip)}
        description="Packed & awaiting courier"
      />
      <SummaryCard
        icon={Undo2}
        label="Refund Requests"
        value={formatNumber(refundRequests)}
        description="Awaiting review"
        trend={
          refundRequests > 0
            ? { value: 2, direction: "up", invert: true }
            : undefined
        }
      />
    </div>
  )
}
