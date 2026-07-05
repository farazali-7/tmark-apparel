import { Check } from "lucide-react"

import { ORDER_STAGE_META } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderTimelineStep } from "@/types"

function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface ProductionTimelineProps {
  steps: OrderTimelineStep[]
  className?: string
}

/**
 * Vertical production timeline. The first not-yet-reached step is rendered as
 * the "current" node so the owner can see exactly where the garment sits.
 */
export function ProductionTimeline({ steps, className }: ProductionTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.at === null)

  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, i) => {
        const meta = ORDER_STAGE_META[step.stage]
        const done = step.at !== null
        const current = i === currentIndex
        const Icon = meta.icon
        const last = i === steps.length - 1

        return (
          <li key={step.stage} className="flex gap-3 pb-5 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                  done
                    ? "border-transparent bg-foreground text-background"
                    : current
                      ? "border-gold bg-gold-muted/40 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold"
                      : "border-dashed bg-background text-muted-foreground/40"
                )}
              >
                {done ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <Icon className="size-3.5" strokeWidth={1.75} />
                )}
              </span>
              {!last ? (
                <span
                  className={cn(
                    "absolute top-7 h-[calc(100%-1.75rem)] w-px",
                    done ? "bg-foreground/25" : "bg-border"
                  )}
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <p
                className={cn(
                  "text-sm leading-none font-medium",
                  !done && !current && "text-muted-foreground/60"
                )}
              >
                {meta.label}
                {current ? (
                  <span className="ml-2 rounded-full bg-gold-muted/50 px-1.5 py-0.5 text-[0.65rem] font-medium text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold">
                    In progress
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-muted-foreground tabular">
                {step.at ? formatStamp(step.at) : current ? "Awaiting" : "Pending"}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
