import {
  CalendarClock,
  CircleDot,
  Pause,
  Pencil,
  Play,
  Plus,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { PromotionActivityEntry, PromotionActivityType } from "@/types"

const TYPE_META: Record<PromotionActivityType, { icon: LucideIcon; className: string }> = {
  created: { icon: Plus, className: "bg-muted text-muted-foreground" },
  edited: { icon: Pencil, className: "bg-muted text-muted-foreground" },
  activated: { icon: Play, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  paused: { icon: Pause, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  scheduled: { icon: CalendarClock, className: "bg-gold-muted/50 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold" },
  expired: { icon: XCircle, className: "bg-muted text-muted-foreground" },
}

function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function PromotionTimeline({
  activity,
  className,
}: {
  activity: PromotionActivityEntry[]
  className?: string
}) {
  if (activity.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>No activity yet.</p>
    )
  }

  return (
    <ol className={cn("relative", className)}>
      {activity.map((event, i) => {
        const meta = TYPE_META[event.type] ?? {
          icon: CircleDot,
          className: "bg-muted text-muted-foreground",
        }
        const Icon = meta.icon
        const last = i === activity.length - 1
        return (
          <li key={event.id} className="flex gap-3 pb-5 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "z-10 flex size-7 shrink-0 items-center justify-center rounded-full",
                  meta.className
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
              </span>
              {!last ? (
                <span className="absolute top-7 h-[calc(100%-1.75rem)] w-px bg-border" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm leading-none font-medium">{event.label}</p>
              <p className="mt-1 text-xs text-muted-foreground tabular">
                {formatStamp(event.at)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
