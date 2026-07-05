"use client"

import { OrderCard } from "@/features/orders/components/order-card"
import type { OrderDetail } from "@/types"

interface OrdersGridProps {
  data: OrderDetail[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (order: OrderDetail) => void
  onCancel: (order: OrderDetail) => void
}

export function OrdersGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onCancel,
}: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          selected={selectedIds.includes(order.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onCancel={onCancel}
        />
      ))}
    </div>
  )
}
