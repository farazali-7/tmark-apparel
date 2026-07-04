import type { StatusTone } from "@/lib/constants"
import { cn } from "@/lib/utils"

const TONE_STYLES: Record<StatusTone, string> = {
  neutral:
    "bg-muted text-muted-foreground ring-border",
  success:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400 dark:ring-emerald-400/20",
  warning:
    "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400 dark:ring-amber-400/20",
  info:
    "bg-sky-500/10 text-sky-700 ring-sky-600/20 dark:text-sky-400 dark:ring-sky-400/20",
  danger:
    "bg-rose-500/10 text-rose-700 ring-rose-600/20 dark:text-rose-400 dark:ring-rose-400/20",
  gold:
    "bg-gold-muted/60 text-[color-mix(in_oklch,var(--gold),black_28%)] ring-gold/30 dark:bg-gold-muted/40 dark:text-gold",
}

interface StatusBadgeProps {
  label: string
  tone: StatusTone
  className?: string
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_STYLES[tone],
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "neutral" ? "bg-muted-foreground/60" : "bg-current"
        )}
      />
      {label}
    </span>
  )
}
