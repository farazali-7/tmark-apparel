import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface QuickActionCardProps {
  icon: LucideIcon
  label: string
  description?: string
  onClick?: () => void
  className?: string
}

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  onClick,
  className,
}: QuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{label}</span>
        {description ? (
          <span className="block truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:text-foreground" />
    </button>
  )
}
