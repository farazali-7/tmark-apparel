import {
  Crown,
  Gift,
  HeartHandshake,
  Ruler,
  ShoppingBag,
  Sparkles,
  Star,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { formatDate } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { CustomerMilestone, CustomerMilestoneKind } from "@/types"

const KIND_ICON: Record<CustomerMilestoneKind, LucideIcon> = {
  registered: UserPlus,
  first_order: Gift,
  measurements: Ruler,
  wedding: HeartHandshake,
  vip: Crown,
  purchase: ShoppingBag,
  review: Star,
}

interface CustomerTimelineProps {
  milestones: CustomerMilestone[]
  className?: string
}

/** Relationship milestones — the story of the client, newest at the bottom. */
export function CustomerTimeline({ milestones, className }: CustomerTimelineProps) {
  if (milestones.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No milestones yet.
      </p>
    )
  }

  return (
    <ol className={cn("relative", className)}>
      {milestones.map((m, i) => {
        const Icon = KIND_ICON[m.kind] ?? Sparkles
        const last = i === milestones.length - 1
        const highlight = m.kind === "vip" || m.kind === "wedding"

        return (
          <li key={m.id} className="flex gap-3 pb-5 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "z-10 flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                  highlight
                    ? "border-gold/40 bg-gold-muted/40 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold"
                    : "bg-background text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
              </span>
              {!last ? (
                <span className="absolute top-7 h-[calc(100%-1.75rem)] w-px bg-border" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm leading-none font-medium">{m.label}</p>
              <p className="mt-1 text-xs text-muted-foreground tabular">
                {formatDate(m.at)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
