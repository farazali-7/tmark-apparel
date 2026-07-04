import {
  PackagePlus,
  RotateCcw,
  ShoppingBag,
  Star,
  TriangleAlert,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { activityEvents } from "@/lib/mock-data/dashboard"
import { formatRelative } from "@/lib/constants"
import type { ActivityType } from "@/types"
import { cn } from "@/lib/utils"

const ICONS: Record<ActivityType, LucideIcon> = {
  order: ShoppingBag,
  product: PackagePlus,
  customer: UserPlus,
  review: Star,
  refund: RotateCcw,
  inventory: TriangleAlert,
}

const TONES: Record<ActivityType, string> = {
  order: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  product: "bg-muted text-foreground",
  customer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  review: "bg-gold-muted/60 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold",
  refund: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  inventory: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function ActivityTimeline() {
  return (
    <ChartCard title="Recent Activity" description="Everything happening across the store">
      <ol className="relative space-y-5">
        {activityEvents.map((event, i) => {
          const Icon = ICONS[event.type]
          const isLast = i === activityEvents.length - 1
          return (
            <li key={event.id} className="relative flex gap-3">
              {!isLast ? (
                <span className="absolute top-8 left-[15px] h-[calc(100%+4px)] w-px bg-border" />
              ) : null}
              <span
                className={cn(
                  "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                  TONES[event.type]
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm leading-snug">{event.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {event.meta} · {formatRelative(event.timestamp)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </ChartCard>
  )
}
