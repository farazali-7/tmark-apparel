import type { LucideIcon } from "lucide-react"

import { TrendIndicator } from "@/components/shared/trend-indicator"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  icon: LucideIcon
  label: string
  value: string
  description?: string
  trend?: { value: number; direction: "up" | "down"; invert?: boolean }
  accent?: boolean
  className?: string
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  accent = false,
  className,
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {accent ? (
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gold/70" />
      ) : null}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate font-display text-2xl leading-none font-medium tabular">
            {value}
          </span>
          {trend ? (
            <TrendIndicator
              value={trend.value}
              trend={trend.direction}
              invertColor={trend.invert}
            />
          ) : null}
        </div>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </Card>
  )
}

export function SummaryCardSkeleton() {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  )
}
