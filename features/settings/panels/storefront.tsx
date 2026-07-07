"use client"

import {
  SettingInput,
  SettingRow,
  SettingsSection,
} from "@/features/settings/components/settings-primitives"
import { ToggleRow } from "@/features/settings/components/setting-controls"
import { IntegrationCard } from "@/features/settings/components/integration-card"
import { Textarea } from "@/components/ui/textarea"
import { analyticsIntegrations } from "@/lib/mock-data/settings"
import type { PanelProps } from "@/features/settings/panel-context"

export function SeoPanel({ settings, update }: PanelProps) {
  const s = settings.seo
  return (
    <div className="space-y-5">
      <SettingsSection title="Search engine listing" description="How your store appears in Google results.">
        <SettingRow label="Meta title" description="50–60 characters recommended." stacked>
          <SettingInput value={s.metaTitle} onChange={(v) => update("seo", "metaTitle", v)} />
        </SettingRow>
        <div className="px-4 py-4 sm:px-5">
          <label className="mb-1.5 block text-sm font-medium">Meta description</label>
          <p className="mb-2 text-xs text-muted-foreground">150–160 characters recommended.</p>
          <Textarea value={s.metaDescription} onChange={(e) => update("seo", "metaDescription", e.target.value)} className="min-h-16" />
        </div>
        {/* Google preview */}
        <div className="px-4 py-4 sm:px-5">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Preview</p>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground tabular">tmarkapparel.com</p>
            <p className="mt-0.5 truncate text-base text-[color:oklch(0.45_0.12_265)] dark:text-sky-400">{s.metaTitle}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{s.metaDescription}</p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Sharing & indexing" description="Social cards and crawler access.">
        <ToggleRow label="Open Graph" description="Rich previews on Facebook, WhatsApp & LinkedIn." checked={s.openGraph} onCheckedChange={(v) => update("seo", "openGraph", v)} />
        <ToggleRow label="Twitter cards" description="Large-image previews on X." checked={s.twitterCard} onCheckedChange={(v) => update("seo", "twitterCard", v)} />
        <ToggleRow label="Allow search indexing" description="Let engines index the storefront." checked={s.robotsIndex} onCheckedChange={(v) => update("seo", "robotsIndex", v)} />
      </SettingsSection>
    </div>
  )
}

const SOCIALS = [
  { key: "instagram", label: "Instagram", prefix: "@" },
  { key: "facebook", label: "Facebook", prefix: "/" },
  { key: "tiktok", label: "TikTok", prefix: "@" },
  { key: "pinterest", label: "Pinterest", prefix: "/" },
  { key: "youtube", label: "YouTube", prefix: "@" },
  { key: "linkedin", label: "LinkedIn", prefix: "/" },
] as const

export function SocialPanel({ settings, update }: PanelProps) {
  const s = settings.social
  return (
    <SettingsSection title="Social profiles" description="Linked in the storefront footer and share cards.">
      {SOCIALS.map((social) => (
        <SettingRow key={social.key} label={social.label}>
          <SettingInput
            prefix={social.prefix}
            value={s[social.key]}
            onChange={(v) => update("social", social.key, v)}
            placeholder={social.key === "youtube" || social.key === "linkedin" ? "Not connected" : undefined}
          />
        </SettingRow>
      ))}
    </SettingsSection>
  )
}

export function IntegrationsPanel() {
  return (
    <SettingsSection title="Analytics & marketing" description="Connect the tools that measure and grow your storefront.">
      <div className="grid gap-3 p-4 sm:p-5">
        {analyticsIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </SettingsSection>
  )
}
