"use client"

import * as React from "react"
import { CircleDollarSign, Flame, MoonStar, TimerReset } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { Sparkline } from "@/components/shared/sparkline"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import {
  formatCompactCurrency,
  formatNumber,
  getCountdown,
} from "@/lib/constants"
import { CountdownBadge } from "@/features/promotions/components/promotion-badges"
import { cn } from "@/lib/utils"
import type { Promotion } from "@/types"

interface PromotionAnalyticsProps {
  promotions: Promotion[]
  onView: (promotion: Promotion) => void
  loading?: boolean
}

function Row({
  promotion,
  onView,
  right,
}: {
  promotion: Promotion
  onView: (p: Promotion) => void
  right: React.ReactNode
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onView(promotion)}
        className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{promotion.name}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {promotion.code}
          </p>
        </div>
        <div className="shrink-0 text-right">{right}</div>
      </button>
    </li>
  )
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <ChartCard
      title={title}
      description={description}
      contentClassName="pt-2"
      action={
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      }
    >
      {children}
    </ChartCard>
  )
}

export function PromotionAnalytics({
  promotions,
  onView,
  loading = false,
}: PromotionAnalyticsProps) {
  const mostUsed = React.useMemo(
    () => [...promotions].sort((a, b) => b.usedCount - a.usedCount).slice(0, 4),
    [promotions]
  )
  const topRevenue = React.useMemo(
    () => [...promotions].sort((a, b) => b.revenue - a.revenue).slice(0, 4),
    [promotions]
  )
  const expiringSoon = React.useMemo(
    () =>
      promotions
        .filter((p) => p.status === "active" && getCountdown(p.startDate, p.endDate).state === "soon")
        .sort(
          (a, b) =>
            new Date(a.endDate ?? 0).getTime() - new Date(b.endDate ?? 0).getTime()
        )
        .slice(0, 4),
    [promotions]
  )
  const unused = React.useMemo(
    () =>
      promotions
        .filter((p) => p.status === "active" && p.usedCount <= 5)
        .sort((a, b) => a.usedCount - b.usedCount)
        .slice(0, 4),
    [promotions]
  )

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Panel icon={Flame} title="Most Used" description="By redemption volume">
        <ul className="-mx-1.5">
          {mostUsed.map((p) => (
            <Row
              key={p.id}
              promotion={p}
              onView={onView}
              right={
                <div className="flex items-center gap-2">
                  <Sparkline
                    data={p.redemptionTrend}
                    positive
                    className="hidden h-6 w-14 opacity-70 sm:block"
                  />
                  <span className="text-sm font-medium tabular">
                    {formatNumber(p.usedCount)}
                  </span>
                </div>
              }
            />
          ))}
        </ul>
      </Panel>

      <Panel icon={CircleDollarSign} title="Highest Revenue" description="Attributed sales">
        <ul className="-mx-1.5">
          {topRevenue.map((p) => (
            <Row
              key={p.id}
              promotion={p}
              onView={onView}
              right={
                <span className="text-sm font-medium tabular">
                  {formatCompactCurrency(p.revenue)}
                </span>
              }
            />
          ))}
        </ul>
      </Panel>

      <Panel icon={TimerReset} title="Expiring Soon" description="Active, ending this week">
        {expiringSoon.length ? (
          <ul className="-mx-1.5">
            {expiringSoon.map((p) => (
              <Row
                key={p.id}
                promotion={p}
                onView={onView}
                right={
                  <CountdownBadge
                    startDate={p.startDate}
                    endDate={p.endDate}
                    status={p.status}
                  />
                }
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={TimerReset}
            title="Nothing expiring"
            description="No active promotions end this week."
            compact
          />
        )}
      </Panel>

      <Panel icon={MoonStar} title="Unused Coupons" description="Live but rarely redeemed">
        {unused.length ? (
          <ul className="-mx-1.5">
            {unused.map((p) => (
              <Row
                key={p.id}
                promotion={p}
                onView={onView}
                right={
                  <span
                    className={cn(
                      "text-sm font-medium tabular",
                      p.usedCount === 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                    )}
                  >
                    {formatNumber(p.usedCount)} used
                  </span>
                }
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={MoonStar}
            title="All performing"
            description="Every live promotion is being redeemed."
            compact
          />
        )}
      </Panel>
    </div>
  )
}
