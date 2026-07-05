"use client"

import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ORDER_PIPELINE, ORDER_STAGE_META } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderStage } from "@/types"

interface OrderPipelineProps {
  counts: Record<OrderStage, number>
  active: OrderStage | null
  onSelect: (stage: OrderStage | null) => void
  loading?: boolean
}

const TONE_DOT: Record<string, string> = {
  neutral: "text-muted-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-sky-600 dark:text-sky-400",
  danger: "text-rose-600 dark:text-rose-400",
  gold: "text-[color-mix(in_oklch,var(--gold),black_20%)] dark:text-gold",
}

export function OrderPipeline({
  counts,
  active,
  onSelect,
  loading = false,
}: OrderPipelineProps) {
  const inPipeline = ORDER_PIPELINE.reduce((sum, s) => sum + (counts[s] ?? 0), 0)

  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold tracking-tight">
            Production Pipeline
          </h2>
          <p className="text-xs text-muted-foreground">
            {inPipeline} active order{inPipeline === 1 ? "" : "s"} across the
            atelier floor — click a stage to filter
          </p>
        </div>
        {active ? (
          <Button
            variant="ghost"
            size="xs"
            className="text-muted-foreground"
            onClick={() => onSelect(null)}
          >
            Clear stage
          </Button>
        ) : null}
      </div>

      <div className="no-scrollbar overflow-x-auto px-2 py-4 sm:px-3">
        <div className="flex min-w-max items-stretch gap-0">
          {ORDER_PIPELINE.map((stage, i) => {
            const meta = ORDER_STAGE_META[stage]
            const Icon = meta.icon
            const count = counts[stage] ?? 0
            const isActive = active === stage
            const isEmpty = count === 0
            const share =
              inPipeline > 0 ? Math.round((count / inPipeline) * 100) : 0

            return (
              <div key={stage} className="flex items-stretch">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onSelect(isActive ? null : stage)}
                      aria-pressed={isActive}
                      aria-label={`${meta.label}: ${count} orders`}
                      className={cn(
                        "group relative flex w-[6.25rem] flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-all sm:w-28",
                        "hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isActive && "bg-accent ring-1 ring-gold/40",
                        loading && "pointer-events-none"
                      )}
                    >
                      {isActive ? (
                        <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold" />
                      ) : null}
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border bg-background transition-colors",
                          isActive
                            ? "border-gold/40"
                            : "group-hover:border-foreground/20",
                          isEmpty ? "text-muted-foreground/40" : TONE_DOT[meta.tone]
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <span
                        className={cn(
                          "font-display text-xl leading-none font-medium tabular transition-colors",
                          isEmpty && "text-muted-foreground/40"
                        )}
                      >
                        {loading ? "—" : count}
                      </span>
                      <span className="text-[0.7rem] leading-tight font-medium text-muted-foreground">
                        {meta.short}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {count} order{count === 1 ? "" : "s"} · {share}% of pipeline
                  </TooltipContent>
                </Tooltip>

                {i < ORDER_PIPELINE.length - 1 ? (
                  <div className="flex items-center px-0.5 text-muted-foreground/30">
                    <ChevronRight className="size-4" />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
