"use client"

import { ArrowUpRight, Inbox } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { DataTable, type Column } from "@/components/shared/data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatCurrency,
} from "@/lib/constants"
import { recentOrders } from "@/lib/mock-data/dashboard"
import type { Order } from "@/types"

const columns: Column<Order>[] = [
  {
    id: "reference",
    header: "Order",
    cell: (o) => (
      <div className="flex flex-col">
        <span className="font-medium tabular">{o.reference}</span>
        <span className="text-xs text-muted-foreground">
          {o.itemCount} item{o.itemCount > 1 ? "s" : ""}
          {o.isCustom ? " · Custom" : ""}
        </span>
      </div>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: (o) => (
      <div className="flex items-center gap-2.5">
        <EntityAvatar initials={o.customerInitials} seed={o.customerName} />
        <span className="truncate text-sm">{o.customerName}</span>
      </div>
    ),
  },
  {
    id: "payment",
    header: "Payment",
    cell: (o) => (
      <StatusBadge
        label={PAYMENT_STATUS_META[o.payment].label}
        tone={PAYMENT_STATUS_META[o.payment].tone}
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (o) => (
      <StatusBadge
        label={ORDER_STATUS_META[o.status].label}
        tone={ORDER_STATUS_META[o.status].tone}
      />
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    cell: (o) => (
      <span className="font-medium tabular">{formatCurrency(o.amount)}</span>
    ),
  },
]

export function RecentOrders() {
  return (
    <ChartCard
      title="Latest Orders"
      description="Most recent orders across the store"
      action={
        <Button variant="ghost" size="sm">
          View all <ArrowUpRight className="size-3.5" />
        </Button>
      }
      contentClassName="p-0"
    >
      <DataTable
        columns={columns}
        data={recentOrders}
        getRowId={(o) => o.id}
        empty={
          <EmptyState icon={Inbox} title="No orders yet" compact />
        }
      />
    </ChartCard>
  )
}
