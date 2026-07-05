import { ArrowUpRight } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import {
  ORDER_STAGE_META,
  ORDER_TYPE_META,
  PAYMENT_STATE_META,
  PRIORITY_META,
  SHIPPING_STATE_META,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type {
  OrderPriority,
  OrderStage,
  OrderType,
  PaymentState,
  ShippingState,
} from "@/types"

/**
 * Every order badge lives here so the table, cards, drawer and pipeline share
 * one visual vocabulary. Changing a tone once updates it everywhere.
 */

export function StageBadge({
  stage,
  className,
}: {
  stage: OrderStage
  className?: string
}) {
  const meta = ORDER_STAGE_META[stage]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function OrderTypeBadge({
  type,
  className,
}: {
  type: OrderType
  className?: string
}) {
  const meta = ORDER_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        meta.bespoke
          ? "border-gold/30 bg-gold-muted/40 text-[color-mix(in_oklch,var(--gold),black_30%)] dark:bg-gold-muted/30 dark:text-gold"
          : "text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  )
}

export function PaymentBadge({
  status,
  className,
}: {
  status: PaymentState
  className?: string
}) {
  const meta = PAYMENT_STATE_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function ShippingBadge({
  status,
  className,
}: {
  status: ShippingState
  className?: string
}) {
  const meta = SHIPPING_STATE_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: OrderPriority
  className?: string
}) {
  const meta = PRIORITY_META[priority]
  if (priority === "standard") {
    return (
      <span className={cn("text-xs text-muted-foreground/70", className)}>
        {meta.label}
      </span>
    )
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        priority === "urgent"
          ? "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-400 dark:ring-rose-400/20"
          : "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400 dark:ring-amber-400/20",
        className
      )}
    >
      <ArrowUpRight className="size-3" />
      {meta.label}
    </span>
  )
}
