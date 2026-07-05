"use client"

import { CustomerCard } from "@/features/customers/components/customer-card"
import type { CustomerDetail } from "@/types"

interface CustomersGridProps {
  data: CustomerDetail[]
  selectedIds: string[]
  onSelectToggle: (id: string) => void
  onView: (customer: CustomerDetail) => void
  onArchive: (customer: CustomerDetail) => void
}

export function CustomersGrid({
  data,
  selectedIds,
  onSelectToggle,
  onView,
  onArchive,
}: CustomersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          selected={selectedIds.includes(customer.id)}
          onSelectToggle={onSelectToggle}
          onView={onView}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}
