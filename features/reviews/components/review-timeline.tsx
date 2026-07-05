import {
  Check,
  MessageSquareReply,
  Pencil,
  Send,
  Sparkles,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { ReviewActivityEntry, ReviewActivityType } from "@/types"

const TYPE_META: Record<ReviewActivityType, { icon: LucideIcon; className: string }> = {
  submitted: { icon: Send, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  approved: { icon: Check, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  rejected: { icon: X, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  edited: { icon: Pencil, className: "bg-muted text-muted-foreground" },
  replied: { icon: MessageSquareReply, className: "bg-muted text-muted-foreground" },
  reported: { icon: TriangleAlert, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  featured: { icon: Sparkles, className: "bg-gold-muted/50 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold" },
}

function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function ReviewTimeline({
  activity,
  className,
}: {
  activity: ReviewActivityEntry[]
  className?: string
}) {
  return (
    <ol className={cn("relative", className)}>
      {activity.map((event, i) => {
        const meta = TYPE_META[event.type]
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
