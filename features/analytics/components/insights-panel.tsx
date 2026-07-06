import { Sparkles, TrendingDown, TrendingUp } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { insights } from "@/lib/mock-data/analytics"
import { cn } from "@/lib/utils"

export function InsightsPanel({ loading = false }: { loading?: boolean }) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-3 sm:px-5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Insights</h2>
          <p className="text-xs text-muted-foreground">What the numbers are telling you</p>
        </div>
      </div>

      <div className="flex-1 divide-y overflow-y-auto">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          : insights.map((insight) => {
              const Icon = insight.icon
              const Trend = insight.trend === "up" ? TrendingUp : TrendingDown
              return (
                <div key={insight.id} className="group flex gap-3 p-4 transition-colors hover:bg-accent/50">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{insight.text}</p>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular",
                          insight.trend === "up"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                        )}
                      >
                        <Trend className="size-3" />
                        {insight.change}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{insight.detail}</p>
                  </div>
                </div>
              )
            })}
      </div>
    </section>
  )
}
