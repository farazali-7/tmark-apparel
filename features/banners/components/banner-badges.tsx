import { StatusBadge } from "@/components/shared/status-badge"
import {
  BANNER_PRIORITY_META,
  BANNER_STATUS_META,
  BANNER_TYPE_META,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { BannerPriority, BannerStatus, BannerType } from "@/types"

export function BannerStatusBadge({
  status,
  className,
}: {
  status: BannerStatus
  className?: string
}) {
  const meta = BANNER_STATUS_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function BannerTypeBadge({
  type,
  className,
}: {
  type: BannerType
  className?: string
}) {
  const meta = BANNER_TYPE_META[type]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  )
}

export function BannerPriorityBadge({
  priority,
  className,
}: {
  priority: BannerPriority
  className?: string
}) {
  const meta = BANNER_PRIORITY_META[priority]
  if (priority === "low") {
    return (
      <span className={cn("text-xs text-muted-foreground/70", className)}>Low priority</span>
    )
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        priority === "high"
          ? "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-400 dark:ring-rose-400/20"
          : "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400 dark:ring-amber-400/20",
        className
      )}
    >
      {meta.label} priority
    </span>
  )
}
