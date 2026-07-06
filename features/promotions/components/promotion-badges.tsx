"use client"

import * as React from "react"
import { Check, Copy, Timer } from "lucide-react"
import { toast } from "sonner"

import { StatusBadge } from "@/components/shared/status-badge"
import {
  PROMOTION_SCOPE_META,
  PROMOTION_STATUS_META,
  PROMOTION_TYPE_META,
  formatDiscount,
  getCountdown,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Promotion, PromotionScope, PromotionStatus, PromotionType } from "@/types"

export function PromotionStatusBadge({
  status,
  className,
}: {
  status: PromotionStatus
  className?: string
}) {
  const meta = PROMOTION_STATUS_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

/** The discount value as an editorial chip — the number that matters most. */
export function DiscountBadge({
  promotion,
  className,
}: {
  promotion: Pick<Promotion, "type" | "value" | "buyX" | "getY">
  className?: string
}) {
  const Icon = PROMOTION_TYPE_META[promotion.type].icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold-muted/40 px-2 py-0.5 text-xs font-medium text-[color-mix(in_oklch,var(--gold),black_30%)] dark:bg-gold-muted/25 dark:text-gold",
        className
      )}
    >
      <Icon className="size-3" />
      {formatDiscount(promotion)}
    </span>
  )
}

export function ScopeBadge({
  scope,
  label,
  className,
}: {
  scope: PromotionScope
  label: string
  className?: string
}) {
  const Icon = PROMOTION_SCOPE_META[scope].icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function TypeBadge({ type, className }: { type: PromotionType; className?: string }) {
  const meta = PROMOTION_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3" />
      {meta.short}
    </span>
  )
}

/** Copy-to-clipboard coupon code chip in a monospaced, ticket-like treatment. */
export function CouponCode({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  function copy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(true)
    toast.success(`Copied ${code}`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group/code inline-flex items-center gap-1.5 rounded-md border border-dashed bg-muted/40 px-2 py-0.5 font-mono text-xs font-medium tracking-wide transition-colors hover:border-foreground/30 hover:bg-muted",
        className
      )}
      aria-label={`Copy code ${code}`}
    >
      {code}
      {copied ? (
        <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Copy className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/code:opacity-100" />
      )}
    </button>
  )
}

/**
 * Live countdown badge. Recomputes every 30s (not every second) so many badges
 * on screen stay cheap while still feeling alive.
 */
export function CountdownBadge({
  startDate,
  endDate,
  status,
  className,
}: {
  startDate: string
  endDate: string | null
  status: PromotionStatus
  className?: string
}) {
  const [now, setNow] = React.useState(() => Date.now())

  React.useEffect(() => {
    if (status === "expired" || status === "draft" || status === "paused") return
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [status, endDate])

  if (status === "draft") {
    return (
      <span className={cn("text-xs text-muted-foreground/70", className)}>
        Not scheduled
      </span>
    )
  }
  if (status === "paused") {
    return <span className={cn("text-xs text-amber-600 dark:text-amber-400", className)}>Paused</span>
  }

  const cd = getCountdown(startDate, endDate, now)
  const tone =
    cd.state === "ended"
      ? "text-muted-foreground/70"
      : cd.state === "soon"
        ? "text-amber-600 dark:text-amber-400"
        : cd.state === "upcoming"
          ? "text-sky-600 dark:text-sky-400"
          : "text-muted-foreground"

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs tabular", tone, className)}>
      <Timer className="size-3" />
      {cd.label}
    </span>
  )
}
