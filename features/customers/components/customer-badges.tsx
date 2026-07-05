import { Crown, Ruler } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { CUSTOMER_STATUS_META, CUSTOMER_TIER_META } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { CustomerStatus, CustomerTier } from "@/types"

/**
 * All customer badges live here so the table, cards and profile drawer share
 * one visual vocabulary. The VIP badge is the page's luxury signature — brass
 * on charcoal, never loud.
 */

export function VIPBadge({
  tier,
  className,
}: {
  tier: CustomerTier
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold-muted/40 px-2 py-0.5 text-[0.7rem] font-medium tracking-wide text-[color-mix(in_oklch,var(--gold),black_28%)] dark:bg-gold-muted/30 dark:text-gold",
        className
      )}
    >
      <Crown className="size-3" />
      {CUSTOMER_TIER_META[tier].label === "Member"
        ? "VIP"
        : `${CUSTOMER_TIER_META[tier].label} VIP`}
    </span>
  )
}

export function CustomerStatusBadge({
  status,
  className,
}: {
  status: CustomerStatus
  className?: string
}) {
  const meta = CUSTOMER_STATUS_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function MeasurementsBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground",
        className
      )}
    >
      <Ruler className="size-3" />
      On file
    </span>
  )
}

/** Compact relationship tags shown on cards & in the drawer header. */
export function RelationshipChips({
  customer,
  className,
}: {
  customer: {
    tailoringClient: boolean
    weddingClient: boolean
    international: boolean
    repeatBuyer: boolean
  }
  className?: string
}) {
  const chips: string[] = []
  if (customer.weddingClient) chips.push("Wedding")
  if (customer.tailoringClient) chips.push("Tailoring")
  if (customer.repeatBuyer) chips.push("Repeat")
  if (customer.international) chips.push("International")
  if (chips.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}
