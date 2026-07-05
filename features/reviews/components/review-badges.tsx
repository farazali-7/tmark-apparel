import { BadgeCheck, Minus, Pin, Sparkles, Star, TrendingDown, TrendingUp } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import {
  FIT_FEEDBACK_META,
  REVIEW_MODERATION_META,
  ratingTone,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { FitFeedback, ReviewModerationStatus, ReviewSentiment } from "@/types"

/**
 * Shared review vocabulary — status, extracted insights, fit feedback and the
 * verified-purchase mark. Insight badges are the signature: subtle sentiment
 * tinting turns free text into scannable signal without going loud.
 */

export function ReviewStatusBadge({
  status,
  className,
}: {
  status: ReviewModerationStatus
  className?: string
}) {
  const meta = REVIEW_MODERATION_META[status]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

const SENTIMENT_ICON = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
} as const

const SENTIMENT_STYLES: Record<ReviewSentiment, string> = {
  positive:
    "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  negative: "border-rose-600/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  neutral: "border-border bg-muted text-muted-foreground",
}

export function InsightBadge({
  label,
  sentiment,
  withIcon = false,
  className,
}: {
  label: string
  sentiment: ReviewSentiment
  withIcon?: boolean
  className?: string
}) {
  const Icon = SENTIMENT_ICON[sentiment]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.7rem] font-medium",
        SENTIMENT_STYLES[sentiment],
        className
      )}
    >
      {withIcon ? <Icon className="size-2.5" /> : null}
      {label}
    </span>
  )
}

export function FitBadge({
  fit,
  className,
}: {
  fit: FitFeedback
  className?: string
}) {
  const meta = FIT_FEEDBACK_META[fit]
  return <StatusBadge label={meta.label} tone={meta.tone} className={className} />
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[0.7rem] font-medium text-emerald-700 dark:text-emerald-400",
        className
      )}
    >
      <BadgeCheck className="size-3.5" />
      Verified
    </span>
  )
}

/** Compact rating chip — number + single star, tinted by score. */
export function RatingChip({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  const tone = ratingTone(rating)
  const styles: Record<string, string> = {
    success: "text-emerald-700 dark:text-emerald-400",
    gold: "text-[color-mix(in_oklch,var(--gold),black_18%)] dark:text-gold",
    warning: "text-amber-700 dark:text-amber-400",
    danger: "text-rose-700 dark:text-rose-400",
    neutral: "text-muted-foreground",
    info: "text-sky-700 dark:text-sky-400",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium tabular",
        styles[tone],
        className
      )}
    >
      <Star className="size-3.5 fill-current" />
      {rating.toFixed(1)}
    </span>
  )
}

export function PinnedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground",
        className
      )}
    >
      <Pin className="size-2.5" /> Pinned
    </span>
  )
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-gold/30 bg-gold-muted/40 px-1.5 py-0.5 text-[0.7rem] font-medium text-[color-mix(in_oklch,var(--gold),black_28%)] dark:bg-gold-muted/30 dark:text-gold",
        className
      )}
    >
      <Sparkles className="size-2.5" /> Featured
    </span>
  )
}
