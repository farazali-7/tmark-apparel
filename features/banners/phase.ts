import { CalendarClock, CircleDot, Timer, TimerOff, type LucideIcon } from "lucide-react"

import type { Banner } from "@/types"

export type BannerPhase = "scheduled" | "running" | "ending_soon" | "expired"

const WEEK = 7 * 86_400_000

/** Lifecycle phase of a live campaign — the timeline's organising principle. */
export function bannerPhase(b: Banner, now: number = Date.now()): BannerPhase | null {
  if (b.status === "scheduled") return "scheduled"
  if (b.status === "expired") return "expired"
  if (b.status === "published") {
    if (b.endDate) {
      const remaining = new Date(b.endDate).getTime() - now
      if (remaining <= 0) return "expired"
      if (remaining <= WEEK) return "ending_soon"
    }
    return "running"
  }
  return null // draft, archived — not part of the live timeline
}

export interface PhaseMeta {
  id: BannerPhase
  label: string
  description: string
  icon: LucideIcon
  dot: string
}

export const BANNER_PHASES: PhaseMeta[] = [
  { id: "scheduled", label: "Scheduled", description: "Queued to launch", icon: CalendarClock, dot: "bg-sky-500" },
  { id: "running", label: "Running", description: "Live on the storefront", icon: CircleDot, dot: "bg-emerald-500" },
  { id: "ending_soon", label: "Ending Soon", description: "Wraps within 7 days", icon: Timer, dot: "bg-amber-500" },
  { id: "expired", label: "Expired", description: "Past their end date", icon: TimerOff, dot: "bg-muted-foreground" },
]
