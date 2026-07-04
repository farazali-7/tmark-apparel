import { Shirt } from "lucide-react"

import { cn } from "@/lib/utils"

/** Seed keyword -> a tasteful fabric-tone gradient standing in for photography. */
const SWATCHES: Record<string, string> = {
  maroon: "from-[oklch(0.42_0.11_20)] to-[oklch(0.3_0.09_20)] text-white/90",
  ivory: "from-[oklch(0.94_0.02_90)] to-[oklch(0.88_0.03_85)] text-[oklch(0.35_0.03_70)]",
  charcoal: "from-[oklch(0.36_0.006_65)] to-[oklch(0.24_0.006_65)] text-white/85",
  navy: "from-[oklch(0.36_0.06_255)] to-[oklch(0.26_0.05_255)] text-white/85",
  emerald: "from-[oklch(0.44_0.09_160)] to-[oklch(0.32_0.08_160)] text-white/90",
  sand: "from-[oklch(0.88_0.04_80)] to-[oklch(0.8_0.05_75)] text-[oklch(0.38_0.05_65)]",
  black: "from-[oklch(0.28_0.004_65)] to-[oklch(0.16_0.004_65)] text-white/85",
}

interface ProductThumbProps {
  seed: string
  name: string
  className?: string
  iconClassName?: string
}

export function ProductThumb({
  seed,
  name,
  className,
  iconClassName,
}: ProductThumbProps) {
  const swatch = SWATCHES[seed] ?? SWATCHES.charcoal
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ring-1 ring-black/5",
        swatch,
        className
      )}
    >
      <div className="absolute inset-0 opacity-[0.15] [background:repeating-linear-gradient(45deg,transparent,transparent_6px,currentColor_6px,currentColor_7px)]" />
      <Shirt className={cn("relative size-1/2 opacity-90", iconClassName)} strokeWidth={1.25} />
    </div>
  )
}
