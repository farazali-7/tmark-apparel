"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HorizontalScrollerProps {
  children: React.ReactNode
  className?: string
  itemClassName?: string
  ariaLabel?: string
}

export function HorizontalScroller({
  children,
  className,
  itemClassName,
  ariaLabel = "Scrollable content",
}: HorizontalScrollerProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  function scrollBy(direction: 1 | -1) {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <div className={cn("group/scroller relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
      >
        {React.Children.map(children, (child) => (
          <div className={cn("snap-start shrink-0", itemClassName)}>{child}</div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute top-1/2 -left-3 hidden -translate-y-1/2 rounded-full bg-background opacity-0 shadow-sm transition-opacity group-hover/scroller:opacity-100 md:flex"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute top-1/2 -right-3 hidden -translate-y-1/2 rounded-full bg-background opacity-0 shadow-sm transition-opacity group-hover/scroller:opacity-100 md:flex"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
