import { Megaphone } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { announcements } from "@/lib/mock-data/dashboard"
import { formatDate } from "@/lib/constants"

export function Announcements() {
  return (
    <ChartCard title="Announcements" description="From the T-Mark team">
      <ul className="space-y-3">
        {announcements.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-lg border border-gold/20 bg-gold-muted/20 p-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-[color-mix(in_oklch,var(--gold),black_20%)] dark:text-gold">
              <Megaphone className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground/70">
                {formatDate(item.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
