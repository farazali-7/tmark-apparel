"use client"

import { HardDrive } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import {
  SettingInput,
  SettingRow,
  SettingsSection,
} from "@/features/settings/components/settings-primitives"
import { ToggleRow } from "@/features/settings/components/setting-controls"
import type { PanelProps } from "@/features/settings/panel-context"

export function MediaPanel({ settings, update }: PanelProps) {
  const m = settings.media
  return (
    <div className="space-y-5">
      <SettingsSection title="Storage" description="Where product and campaign media is stored.">
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
            <HardDrive className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Media library</p>
              <p className="text-xs text-muted-foreground tabular">18.4 GB of 50 GB</p>
            </div>
            <Progress value={37} className="mt-2 h-1.5" />
          </div>
        </div>
        <ToggleRow label="Serve via CDN" description="Deliver images from edge locations worldwide." checked={m.cdn} onCheckedChange={(v) => update("media", "cdn", v)} />
      </SettingsSection>

      <SettingsSection title="Optimization" description="Keep the storefront fast without sacrificing quality.">
        <ToggleRow label="Automatic optimization" description="Compress images on upload." checked={m.autoOptimize} onCheckedChange={(v) => update("media", "autoOptimize", v)} />
        <ToggleRow label="Convert to WebP" description="Serve modern formats where supported." checked={m.webp} onCheckedChange={(v) => update("media", "webp", v)} />
        <ToggleRow label="Lazy loading" description="Load images as they enter the viewport." checked={m.lazyLoad} onCheckedChange={(v) => update("media", "lazyLoad", v)} />
        <SettingRow label="Max upload size" description="Per-file limit for uploads.">
          <SettingInput prefix="MB" value={m.maxUpload} onChange={(v) => update("media", "maxUpload", v)} />
        </SettingRow>
      </SettingsSection>
    </div>
  )
}
