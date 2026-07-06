import { formatNumber } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface UsageProgressProps {
  used: number
  cap: number | null
  className?: string
  showLabel?: boolean
}

/**
 * Redemption progress toward the usage cap. Fills brass, shifting to amber as
 * it nears exhaustion so an almost-spent promotion reads at a glance. Uncapped
 * promotions show volume without a bar.
 */
export function UsageProgress({
  used,
  cap,
  className,
  showLabel = true,
}: UsageProgressProps) {
  if (cap == null) {
    return (
      <div className={cn("space-y-1", className)}>
        {showLabel ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Redemptions</span>
            <span className="font-medium tabular">{formatNumber(used)}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 flex-1 rounded-full bg-[repeating-linear-gradient(90deg,var(--border)_0,var(--border)_4px,transparent_4px,transparent_8px)]" />
          <span className="text-[0.7rem] text-muted-foreground">Unlimited</span>
        </div>
      </div>
    )
  }

  const pct = Math.min(100, Math.round((used / cap) * 100))
  const nearFull = pct >= 85

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Redeemed</span>
          <span className="font-medium tabular">
            {formatNumber(used)}
            <span className="text-muted-foreground"> / {formatNumber(cap)}</span>
          </span>
        </div>
      ) : null}
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
            nearFull ? "bg-amber-500" : "bg-gold"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
