import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface MediaPlaceholderProps {
  /** Announced to assistive tech in place of the future image's alt text. */
  label: string
  className?: string
}

/**
 * Stands in for art direction that has not shipped yet. Swapping this for
 * `next/image` later is a drop-in: the wrapper already owns the sizing box, so
 * a `fill` image slots straight in without touching any caller's layout.
 */
export function MediaPlaceholder({ label, className }: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center bg-neutral-200",
        className
      )}
    >
      <ImageIcon
        aria-hidden
        strokeWidth={1.25}
        className="w-6 h-6 text-neutral-400"
      />
    </div>
  )
}
