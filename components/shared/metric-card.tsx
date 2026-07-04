import type { LucideIcon } from "lucide-react"

import { Sparkline } from "@/components/shared/sparkline"
import { TrendIndicator } from "@/components/shared/trend-indicator"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metric } from "@/types"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  metric: Metric
  icon: LucideIcon
  className?: string
}

export function MetricCard({ metric, icon: Icon, className }: MetricCardProps) {
  const warning = metric.intent === "warning"

  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {warning ? (
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gold/70" />
      ) : null}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {metric.label}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="font-display text-2xl leading-none font-medium tabular">
            {metric.value}
          </div>
          <div className="flex items-center gap-2">
            <TrendIndicator
              value={metric.rawChange}
              trend={metric.trend}
              invertColor={metric.id === "low-stock"}
            />
            <span className="text-xs text-muted-foreground">
              {metric.comparison}
            </span>
          </div>
        </div>
        <Sparkline
          data={metric.spark}
          positive={metric.id === "low-stock" ? metric.trend === "down" : metric.trend === "up"}
          className="h-10 w-20 shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
        />
      </div>
    </Card>
  )
}

export function MetricCardSkeleton() {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
    </Card>
  )
}
