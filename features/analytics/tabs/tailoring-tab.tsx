import { CalendarClock } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { BreakdownList } from "@/features/analytics/components/breakdown-list"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import { StatTiles } from "@/features/analytics/components/stat-tiles"
import {
  mostRequestedFits,
  productionStatus,
  tailoringStats,
  tailorWorkload,
  topFabrics,
  upcomingDeliveries,
} from "@/lib/mock-data/analytics"
import { formatNumber } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function TailoringTab() {
  const totalInProduction = productionStatus.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <StatTiles tiles={tailoringStats} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Production Status" description="Custom orders on the atelier floor" className="lg:col-span-1">
          <DonutChart
            data={productionStatus}
            centerValue={formatNumber(totalInProduction)}
            centerLabel="in production"
            format={formatNumber}
          />
        </ChartCard>
        <ChartCard title="Most Requested Fabrics" description="By bespoke commissions">
          <BreakdownList items={topFabrics} format={formatNumber} />
        </ChartCard>
        <ChartCard title="Most Requested Fits" description="Client fit preferences">
          <BreakdownList items={mostRequestedFits} format={formatNumber} accentTop={false} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Tailor Workload" description="Active commissions vs. capacity">
          <ul className="space-y-3.5">
            {tailorWorkload.map((t) => {
              const pct = Math.round((t.active / t.capacity) * 100)
              const near = pct >= 90
              return (
                <li key={t.name} className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <EntityAvatar initials={t.initials} seed={t.name} className="size-8" />
                    <span className="flex-1 truncate text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground tabular">
                      {t.active}/{t.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn("block h-full rounded-full", near ? "bg-amber-500" : "bg-gold")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </ChartCard>

        <ChartCard title="Upcoming Deliveries" description="Bespoke orders nearing deadline" action={<CalendarClock className="size-4 text-muted-foreground" />}>
          <ul className="divide-y">
            {upcomingDeliveries.map((d) => (
              <li key={d.reference} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <EntityAvatar initials={d.initials} seed={d.customer} className="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.customer}</p>
                  <p className="text-xs text-muted-foreground tabular">{d.reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular">{d.deadline}</p>
                  <p
                    className={cn(
                      "text-xs tabular",
                      d.daysLeft <= 0
                        ? "font-medium text-rose-600 dark:text-rose-400"
                        : d.daysLeft <= 3
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground"
                    )}
                  >
                    {d.daysLeft <= 0 ? "Due today" : `${d.daysLeft}d left`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  )
}
