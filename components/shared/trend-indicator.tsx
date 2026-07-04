import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface TrendIndicatorProps {
  value: number
  trend: "up" | "down"
  /** When true, a downward trend is shown as positive (e.g. low stock falling). */
  invertColor?: boolean
  className?: string
}

export function TrendIndicator({
  value,
  trend,
  invertColor = false,
  className,
}: TrendIndicatorProps) {
  const isGood = invertColor ? trend === "down" : trend === "up"
  const Icon = trend === "up" ? TrendingUp : TrendingDown

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular",
        isGood
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
        className
      )}
    >
      <Icon className="size-3" />
      {value}%
    </span>
  )
}
