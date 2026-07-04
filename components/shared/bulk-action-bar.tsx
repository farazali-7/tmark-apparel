"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
  count: number
  onClear: () => void
  children: ReactNode
  className?: string
}

export function BulkActionBar({
  count,
  onClear,
  children,
  className,
}: BulkActionBarProps) {
  if (count === 0) return null

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4",
        className
      )}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-center gap-1.5 rounded-full border bg-popover/95 p-1.5 pl-4 shadow-lg backdrop-blur">
        <span className="text-sm font-medium tabular">
          {count} selected
        </span>
        <Separator orientation="vertical" className="mx-1 h-5" />
        {children}
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={onClear}
        >
          <X className="size-4" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>
    </div>
  )
}
