"use client"

import type { ReactNode } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type PreviewDevice = "desktop" | "tablet" | "mobile"

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: "max-w-full",
  tablet: "max-w-[46rem]",
  mobile: "max-w-[22rem]",
}

/** Standalone device switcher — shared by the Homepage Builder and Banner Manager. */
export function PreviewSwitcher({
  device,
  onDeviceChange,
  className,
  size = "sm",
}: {
  device: PreviewDevice
  onDeviceChange: (device: PreviewDevice) => void
  className?: string
  size?: "sm" | "default"
}) {
  return (
    <ToggleGroup
      type="single"
      value={device}
      onValueChange={(v) => v && onDeviceChange(v as PreviewDevice)}
      variant="outline"
      size={size}
      className={cn("h-8", className)}
    >
      <ToggleGroupItem value="desktop" aria-label="Desktop preview" className="px-2.5">
        <Monitor className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tablet" aria-label="Tablet preview" className="px-2.5">
        <Tablet className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="mobile" aria-label="Mobile preview" className="px-2.5">
        <Smartphone className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

/**
 * A browser-chrome frame that constrains its content to the selected device
 * width. Content scales responsively inside — the same markup previews across
 * desktop, tablet and mobile.
 */
export function DeviceFrame({
  device,
  url = "tmarkapparel.com",
  children,
  className,
  contentClassName,
}: {
  device: PreviewDevice
  url?: string
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <div className={cn("rounded-xl border bg-muted/30 p-3 sm:p-4", className)}>
      <div
        className={cn(
          "mx-auto overflow-hidden rounded-lg border bg-background shadow-sm transition-all duration-300",
          DEVICE_WIDTH[device]
        )}
      >
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
          <span className="size-2 rounded-full bg-muted-foreground/25" />
          <span className="size-2 rounded-full bg-muted-foreground/25" />
          <span className="size-2 rounded-full bg-muted-foreground/25" />
          <span className="mx-auto flex items-center gap-1.5 rounded-md bg-background px-2.5 py-0.5 text-[0.65rem] text-muted-foreground tabular">
            {url}
          </span>
        </div>
        <div className={cn("min-h-40", contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
