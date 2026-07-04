import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const TONES = [
  "bg-[oklch(0.92_0.03_75)] text-[oklch(0.35_0.05_65)]",
  "bg-[oklch(0.9_0.03_150)] text-[oklch(0.35_0.05_150)]",
  "bg-[oklch(0.9_0.03_250)] text-[oklch(0.35_0.05_250)]",
  "bg-[oklch(0.91_0.03_20)] text-[oklch(0.38_0.06_20)]",
  "bg-[oklch(0.9_0.03_300)] text-[oklch(0.36_0.05_300)]",
]

function toneFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return TONES[Math.abs(hash) % TONES.length]
}

interface EntityAvatarProps {
  initials: string
  seed?: string
  className?: string
}

export function EntityAvatar({ initials, seed, className }: EntityAvatarProps) {
  return (
    <Avatar className={cn("size-8 rounded-lg", className)}>
      <AvatarFallback
        className={cn(
          "rounded-lg text-xs font-semibold",
          toneFor(seed ?? initials)
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
