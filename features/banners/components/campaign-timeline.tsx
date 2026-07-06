"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BANNER_PHASES,
  bannerPhase,
  type BannerPhase,
} from "@/features/banners/phase"
import { cn } from "@/lib/utils"
import type { Banner } from "@/types"

interface CampaignTimelineProps {
  banners: Banner[]
  active: BannerPhase | null
  onSelect: (phase: BannerPhase | null) => void
  loading?: boolean
}

export function CampaignTimeline({
  banners,
  active,
  onSelect,
  loading = false,
}: CampaignTimelineProps) {
  if (loading) {
    return <Skeleton className="h-[5.5rem] w-full rounded-xl" />
  }

  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold tracking-tight">Campaign Timeline</h2>
          <p className="text-xs text-muted-foreground">
            Where every live campaign sits — click a phase to filter
          </p>
        </div>
        {active ? (
          <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={() => onSelect(null)}>
            Clear
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {BANNER_PHASES.map((phase) => {
          const count = banners.filter((b) => bannerPhase(b) === phase.id).length
          const isActive = active === phase.id
          const Icon = phase.icon
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelect(isActive ? null : phase.id)}
              aria-pressed={isActive}
              className={cn(
                "group flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:px-5",
                isActive && "bg-accent"
              )}
            >
              <span className="relative flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-4" />
                <span className={cn("absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2 ring-card", phase.dot)} />
              </span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-xl leading-none font-medium tabular">
                    {count}
                  </span>
                  <span className="text-sm font-medium">{phase.label}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{phase.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
