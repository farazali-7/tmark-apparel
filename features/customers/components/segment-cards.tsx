"use client"

import { HorizontalScroller } from "@/components/shared/horizontal-scroller"
import { SectionHeader } from "@/components/shared/section-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CUSTOMER_SEGMENTS,
  type CustomerSegment,
  type SegmentId,
} from "@/features/customers/segments"
import { formatCompactCurrency, formatNumber } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { CustomerDetail } from "@/types"

interface SegmentCardsProps {
  customers: CustomerDetail[]
  active: SegmentId | null
  onSelect: (id: SegmentId | null) => void
  loading?: boolean
}

function SegmentCard({
  segment,
  customers,
  active,
  onSelect,
}: {
  segment: CustomerSegment
  customers: CustomerDetail[]
  active: boolean
  onSelect: () => void
}) {
  const members = customers.filter(segment.match)
  const revenue = members.reduce((s, c) => s + c.lifetimeValue, 0)
  const avg = members.length ? Math.round(revenue / members.length) : 0
  const Icon = segment.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group relative flex w-56 flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active && "ring-2 ring-gold/50"
      )}
    >
      {segment.accent ? (
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gold/70" />
      ) : null}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background",
            active && "bg-foreground text-background"
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="font-display text-2xl leading-none font-medium tabular">
          {formatNumber(members.length)}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium">{segment.label}</p>
        <p className="text-xs text-muted-foreground">{segment.description}</p>
      </div>
      <div className="flex items-center justify-between border-t pt-2.5 text-xs">
        <span className="text-muted-foreground">
          Revenue{" "}
          <span className="font-medium text-foreground tabular">
            {formatCompactCurrency(revenue)}
          </span>
        </span>
        <span className="text-muted-foreground tabular">
          avg {formatCompactCurrency(avg)}
        </span>
      </div>
    </button>
  )
}

export function SegmentCards({
  customers,
  active,
  onSelect,
  loading = false,
}: SegmentCardsProps) {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Segments"
        description="Tap a segment to filter the list — your CRM at a glance"
      />
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[8.5rem] w-56 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : (
        <HorizontalScroller ariaLabel="Customer segments" itemClassName="w-56">
          {CUSTOMER_SEGMENTS.map((segment) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              customers={customers}
              active={active === segment.id}
              onSelect={() => onSelect(active === segment.id ? null : segment.id)}
            />
          ))}
        </HorizontalScroller>
      )}
    </section>
  )
}
