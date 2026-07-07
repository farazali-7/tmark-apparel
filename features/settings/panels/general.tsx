"use client"

import { toast } from "sonner"
import { ImagePlus, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SettingInput,
  SettingRow,
  SettingsSection,
} from "@/features/settings/components/settings-primitives"
import { SelectRow } from "@/features/settings/components/setting-controls"
import type { PanelProps } from "@/features/settings/panel-context"

export function StorePanel({ settings, update }: PanelProps) {
  const g = settings.general
  return (
    <div className="space-y-5">
      <SettingsSection title="Store profile" description="How your store appears to customers and couriers.">
        <SettingRow label="Store name" htmlFor="store-name" description="Shown across the storefront and receipts.">
          <SettingInput id="store-name" value={g.storeName} onChange={(v) => update("general", "storeName", v)} />
        </SettingRow>
        <SettingRow label="Contact email" htmlFor="store-email">
          <SettingInput id="store-email" type="email" value={g.email} onChange={(v) => update("general", "email", v)} />
        </SettingRow>
        <SettingRow label="Phone" htmlFor="store-phone">
          <SettingInput id="store-phone" value={g.phone} onChange={(v) => update("general", "phone", v)} />
        </SettingRow>
        <SettingRow label="Address" htmlFor="store-address" description="Primary business location." stacked>
          <SettingInput id="store-address" value={g.address} onChange={(v) => update("general", "address", v)} />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Regional" description="Defaults for pricing, dates and language.">
        <SelectRow label="Timezone" value={g.timezone} onValueChange={(v) => update("general", "timezone", v)} options={["Asia/Karachi (GMT+5)", "Asia/Dubai (GMT+4)", "Europe/London (GMT+1)", "America/New_York (GMT-4)"]} />
        <SelectRow label="Currency" description="Store display currency." value={g.currency} onValueChange={(v) => update("general", "currency", v)} options={["PKR", "USD", "GBP", "AED", "SAR"]} />
        <SelectRow label="Language" value={g.language} onValueChange={(v) => update("general", "language", v)} options={["English", "Urdu", "Arabic"]} />
      </SettingsSection>
    </div>
  )
}

export function BusinessPanel({ settings, update }: PanelProps) {
  const b = settings.business
  return (
    <SettingsSection title="Legal & tax" description="Details used on invoices and compliance documents.">
      <SettingRow label="Legal business name" htmlFor="legal-name">
        <SettingInput id="legal-name" value={b.legalName} onChange={(v) => update("business", "legalName", v)} />
      </SettingRow>
      <SettingRow label="Registration number" htmlFor="reg-no">
        <SettingInput id="reg-no" value={b.registration} onChange={(v) => update("business", "registration", v)} />
      </SettingRow>
      <SettingRow label="Tax number (NTN)" htmlFor="tax-no">
        <SettingInput id="tax-no" value={b.taxNumber} onChange={(v) => update("business", "taxNumber", v)} />
      </SettingRow>
      <SettingRow label="Support email" htmlFor="support-email">
        <SettingInput id="support-email" type="email" value={b.supportEmail} onChange={(v) => update("business", "supportEmail", v)} />
      </SettingRow>
      <SettingRow label="Support phone" htmlFor="support-phone">
        <SettingInput id="support-phone" value={b.supportPhone} onChange={(v) => update("business", "supportPhone", v)} />
      </SettingRow>
      <SettingRow label="Registered address" htmlFor="biz-address" stacked>
        <SettingInput id="biz-address" value={b.address} onChange={(v) => update("business", "address", v)} />
      </SettingRow>
    </SettingsSection>
  )
}

export function BrandPanel() {
  return (
    <SettingsSection title="Brand assets" description="Logo, wordmark and favicon used across the storefront.">
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        {[
          { label: "Primary logo", hint: "SVG or PNG, transparent · 512×512" },
          { label: "Favicon", hint: "ICO or PNG · 64×64" },
        ].map((asset) => (
          <div key={asset.label} className="space-y-2">
            <p className="text-sm font-medium">{asset.label}</p>
            <button
              type="button"
              onClick={() => toast.success(`${asset.label} uploaded`)}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground">
                {asset.label === "Favicon" ? <ImagePlus className="size-5" /> : <UploadCloud className="size-5" />}
              </span>
              <span className="text-sm font-medium">Upload {asset.label.toLowerCase()}</span>
              <span className="text-xs text-muted-foreground">{asset.hint}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div>
          <p className="text-sm font-medium">Brand wordmark</p>
          <p className="text-xs text-muted-foreground">Currently using the built-in Fraunces display type.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast("Wordmark editor coming soon")}>
          Change
        </Button>
      </div>
    </SettingsSection>
  )
}
