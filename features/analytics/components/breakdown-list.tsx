import { cn } from "@/lib/utils"
import type { BreakdownItem } from "@/lib/mock-data/analytics"

interface BreakdownListProps {
  items: BreakdownItem[]
  format?: (value: number) => string
  /** Highlight the leading row with the brass accent. */
  accentTop?: boolean
  showRank?: boolean
  className?: string
}

/**
 * Editorial horizontal bar list — pure CSS bars (no chart runtime) for crisp
 * rendering and zero SSR width warnings. The workhorse behind category,
 * collection, country, city, fabric, size and fit breakdowns.
 */
export function BreakdownList({
  items,
  format = (v) => v.toLocaleString(),
  accentTop = true,
  showRank = false,
  className,
}: BreakdownListProps) {
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const pct = Math.max(2, Math.round((item.value / max) * 100))
        const isTop = i === 0 && accentTop
        return (
          <li key={item.label} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                {showRank ? (
                  <span className="w-4 shrink-0 text-center text-xs text-muted-foreground tabular">
                    {i + 1}
                  </span>
                ) : null}
                {item.flag ? <span className="shrink-0">{item.flag}</span> : null}
                <span className="truncate font-medium">{item.label}</span>
                {item.meta ? (
                  <span className="shrink-0 text-xs text-muted-foreground">· {item.meta}</span>
                ) : null}
              </span>
              <span className="shrink-0 font-medium tabular">{format(item.value)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "block h-full rounded-full transition-all duration-500",
                  isTop ? "bg-gold" : "bg-foreground/55"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
