"use client"

import { Crown } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { OrderActions } from "@/features/orders/components/order-actions"
import {
  OrderTypeBadge,
  PaymentBadge,
  PriorityBadge,
  StageBadge,
} from "@/features/orders/components/order-badges"
import { formatCurrency, formatDeadline, formatRelative } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderDetail } from "@/types"

interface OrderCardProps {
  order: OrderDetail
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (order: OrderDetail) => void
  onCancel: (order: OrderDetail) => void
}

export function OrderCard({
  order,
  selected,
  onSelectToggle,
  onView,
  onCancel,
}: OrderCardProps) {
  const deadline = formatDeadline(order.deliveryDeadline)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onView(order)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView(order)
        }
      }}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group cursor-pointer gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "ring-2 ring-gold/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() => onSelectToggle(order.id)}
            aria-label={`Select ${order.reference}`}
            className={cn(
              "transition-opacity",
              !selected && "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            )}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium tabular">{order.reference}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelative(order.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <StageBadge stage={order.stage} />
          <OrderActions order={order} onView={onView} onCancel={onCancel} />
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2.5">
        <EntityAvatar initials={order.customer.initials} seed={order.customer.id} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">{order.customer.name}</span>
            <span title={order.customer.country}>{order.customer.flag}</span>
            {order.customer.vip ? (
              <Crown className="size-3 text-gold" aria-label="VIP" />
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground tabular">
            {order.customer.phone}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5">
        <ProductThumb
          seed={order.items[0].image}
          name={order.items[0].name}
          className="size-10"
          iconClassName="size-4"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{order.items[0].name}</p>
          <p className="text-xs text-muted-foreground">
            {order.itemCount} item{order.itemCount === 1 ? "" : "s"} ·{" "}
            {order.items[0].fabric ?? order.items[0].color}
          </p>
        </div>
        <span className="shrink-0 font-display text-sm font-medium tabular">
          {formatCurrency(order.total)}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <OrderTypeBadge type={order.type} />
          <PaymentBadge status={order.payment.status} />
        </div>
        {order.priority !== "standard" ? (
          <PriorityBadge priority={order.priority} />
        ) : deadline ? (
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
    </Card>
  )
}
