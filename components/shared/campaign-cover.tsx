import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Editorial campaign cover — a duotone, magazine-style backdrop for
 * collections. Intentionally distinct from ProductThumb (which reads as a
 * garment swatch) so merchandising never looks like the product catalog.
 */
const CAMPAIGNS: Record<string, { gradient: string; ink: string }> = {
  wedding: {
    gradient: "from-[oklch(0.32_0.09_18)] via-[oklch(0.26_0.08_20)] to-[oklch(0.2_0.05_30)]",
    ink: "text-[oklch(0.82_0.09_75)]",
  },
  velvet: {
    gradient: "from-[oklch(0.3_0.09_350)] via-[oklch(0.24_0.08_355)] to-[oklch(0.18_0.05_20)]",
    ink: "text-[oklch(0.84_0.06_350)]",
  },
  winter: {
    gradient: "from-[oklch(0.4_0.05_240)] via-[oklch(0.32_0.04_235)] to-[oklch(0.24_0.03_230)]",
    ink: "text-[oklch(0.88_0.04_230)]",
  },
  bestsellers: {
    gradient: "from-[oklch(0.4_0.06_60)] via-[oklch(0.3_0.05_50)] to-[oklch(0.22_0.03_45)]",
    ink: "text-[oklch(0.86_0.07_75)]",
  },
  newarrivals: {
    gradient: "from-[oklch(0.44_0.03_220)] via-[oklch(0.34_0.02_215)] to-[oklch(0.26_0.02_210)]",
    ink: "text-[oklch(0.9_0.02_215)]",
  },
  premium: {
    gradient: "from-[oklch(0.3_0.006_65)] via-[oklch(0.22_0.005_65)] to-[oklch(0.15_0.004_65)]",
    ink: "text-[oklch(0.82_0.07_78)]",
  },
  festive: {
    gradient: "from-[oklch(0.38_0.09_160)] via-[oklch(0.3_0.08_160)] to-[oklch(0.22_0.05_150)]",
    ink: "text-[oklch(0.85_0.08_150)]",
  },
  editor: {
    gradient: "from-[oklch(0.34_0.006_270)] via-[oklch(0.26_0.006_270)] to-[oklch(0.18_0.005_270)]",
    ink: "text-[oklch(0.88_0.02_270)]",
  },
  summer: {
    gradient: "from-[oklch(0.86_0.05_80)] via-[oklch(0.78_0.06_75)] to-[oklch(0.68_0.06_70)]",
    ink: "text-[oklch(0.36_0.05_60)]",
  },
  limited: {
    gradient: "from-[oklch(0.26_0.01_90)] via-[oklch(0.18_0.008_85)] to-[oklch(0.12_0.006_85)]",
    ink: "text-[oklch(0.82_0.09_82)]",
  },
}

interface CampaignCoverProps {
  seed: string
  label?: string
  className?: string
  wordmarkClassName?: string
  children?: ReactNode
}

export function CampaignCover({
  seed,
  label,
  className,
  wordmarkClassName,
  children,
}: CampaignCoverProps) {
  const theme = CAMPAIGNS[seed] ?? CAMPAIGNS.premium

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        theme.gradient,
        className
      )}
    >
      {/* soft light source */}
      <div className="absolute -top-1/3 -right-1/4 size-2/3 rounded-full bg-white/10 blur-3xl" />
      {/* fine grain */}
      <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(0deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)]" />
      {/* ghosted editorial wordmark */}
      {label ? (
        <span
          className={cn(
            "pointer-events-none absolute -bottom-3 left-3 font-display text-[3.25rem] leading-none font-medium tracking-tight opacity-25 select-none",
            theme.ink,
            wordmarkClassName
          )}
        >
          {label}
        </span>
      ) : null}
      {/* bottom vignette for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent" />
      {children}
    </div>
  )
}
