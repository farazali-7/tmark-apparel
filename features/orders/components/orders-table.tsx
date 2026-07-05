"use client"

import { Crown } from "lucide-react"

import {
  DataTable,
  type Column,
  type SortState,
} from "@/components/shared/data-table"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { OrderActions } from "@/features/orders/components/order-actions"
import {
  OrderTypeBadge,
  PaymentBadge,
  PriorityBadge,
  ShippingBadge,
  StageBadge,
} from "@/features/orders/components/order-badges"
import { formatCurrency, formatDeadline, formatRelative } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderDetail } from "@/types"

interface OrdersTableProps {
  data: OrderDetail[]
  loading?: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  sort: SortState | null
  onSortChange: (id: string) => void
  onView: (order: OrderDetail) => void
  onCancel: (order: OrderDetail) => void
  empty?: React.ReactNode
}

export function OrdersTable({
  data,
  loading,
  selectedIds,
  onSelectionChange,
  sort,
  onSortChange,
  onView,
  onCancel,
  empty,
}: OrdersTableProps) {
  const columns: Column<OrderDetail>[] = [
    {
      id: "reference",
      header: "Order",
      cell: (o) => (
        <div className="flex flex-col">
          <span className="font-medium tabular">{o.reference}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelative(o.createdAt)}
          </span>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (o) => (
        <div className="flex items-center gap-2.5">
          <EntityAvatar initials={o.customer.initials} seed={o.customer.id} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">
                {o.customer.name}
              </span>
              <span aria-label={o.customer.country} title={o.customer.country}>
                {o.customer.flag}
              </span>
              {o.customer.vip ? (
                <Crown className="size-3 text-gold" aria-label="VIP customer" />
              ) : null}
            </div>
            <span className="text-xs text-muted-foreground tabular">
              {o.customer.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "items",
      header: "Products",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (o) => (
        <div className="flex items-center gap-2.5">
          <ProductThumb
            seed={o.items[0].image}
            name={o.items[0].name}
            className="size-9"
            iconClassName="size-4"
          />
          <div className="min-w-0">
            <p className="max-w-[11rem] truncate text-sm">{o.items[0].name}</p>
            <p className="text-xs text-muted-foreground">
              {o.itemCount} item{o.itemCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell",
      cell: (o) => <OrderTypeBadge type={o.type} />,
    },
    {
      id: "stage",
      header: "Production",
      cell: (o) => (
        <div className="flex flex-col items-start gap-1">
          <StageBadge stage={o.stage} />
          {o.assignedTailor ? (
            <span className="hidden text-[0.7rem] text-muted-foreground 2xl:inline">
              {o.assignedTailor}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "shipping",
      header: "Shipping",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (o) => (
        <div className="flex flex-col items-start gap-1">
          <ShippingBadge status={o.shipment.status} />
          <span className="text-[0.7rem] text-muted-foreground capitalize">
            {o.shipment.scope}
          </span>
        </div>
      ),
    },
    {
      id: "payment",
      header: "Payment",
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell",
      cell: (o) => <PaymentBadge status={o.payment.status} />,
    },
    {
      id: "total",
      header: "Amount",
      align: "right",
      sortable: true,
      cell: (o) => (
        <span className="font-medium tabular">{formatCurrency(o.total)}</span>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell",
      cell: (o) => {
        const deadline = formatDeadline(o.deliveryDeadline)
        return (
          <div className="flex flex-col items-start gap-1">
            <PriorityBadge priority={o.priority} />
            {deadline ? (
              <span
                className={cn(
                  "text-[0.7rem] tabular",
                  deadline.overdue
                    ? "font-medium text-rose-600 dark:text-rose-400"
                    : deadline.soon
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                )}
              >
                {deadline.label}
              </span>
            ) : null}
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(o) => o.id}
      loading={loading}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={onView}
      stickyHeader
      skeletonRows={8}
      empty={empty}
      rowActions={(o) => (
        <OrderActions order={o} onView={onView} onCancel={onCancel} />
      )}
    />
  )
}
