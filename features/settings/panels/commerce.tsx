"use client"

import { toast } from "sonner"
import { Banknote, CreditCard, Landmark, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SettingInput,
  SettingRow,
  SettingsSection,
  StatusIndicator,
} from "@/features/settings/components/settings-primitives"
import { SelectRow, ToggleRow } from "@/features/settings/components/setting-controls"
import type { PanelProps } from "@/features/settings/panel-context"

export function ShippingPanel({ settings, update }: PanelProps) {
  const s = settings.shipping
  return (
    <div className="space-y-5">
      <SettingsSection title="Shipping zones" description="Where you deliver and the base rates that apply.">
        <ToggleRow label="Domestic shipping" description="Deliver within Pakistan." checked={s.domestic} onCheckedChange={(v) => update("shipping", "domestic", v)} />
        <ToggleRow label="International shipping" description="Ship worldwide via courier partners." checked={s.international} onCheckedChange={(v) => update("shipping", "international", v)} />
      </SettingsSection>

      <SettingsSection title="Rates & delivery" description="Base charges and estimated windows shown at checkout.">
        <SettingRow label="Domestic rate" description="Flat rate for local orders.">
          <SettingInput prefix="PKR" value={s.domesticRate} onChange={(v) => update("shipping", "domesticRate", v)} />
        </SettingRow>
        <SettingRow label="International rate">
          <SettingInput prefix="PKR" value={s.intlRate} onChange={(v) => update("shipping", "intlRate", v)} />
        </SettingRow>
        <SettingRow label="Free shipping threshold" description="Orders above this ship free.">
          <SettingInput prefix="PKR" value={s.freeShippingThreshold} onChange={(v) => update("shipping", "freeShippingThreshold", v)} />
        </SettingRow>
        <SelectRow label="Domestic estimate" value={s.estDomestic} onValueChange={(v) => update("shipping", "estDomestic", v)} options={["1–2 days", "2–4 days", "3–5 days"]} />
        <SelectRow label="International estimate" value={s.estIntl} onValueChange={(v) => update("shipping", "estIntl", v)} options={["3–6 days", "5–9 days", "7–14 days"]} />
      </SettingsSection>
    </div>
  )
}

const PAYMENT_METHODS = [
  { key: "stripe", name: "Stripe", description: "Cards, Apple Pay & Google Pay", icon: CreditCard },
  { key: "paypal", name: "PayPal", description: "PayPal balance & cards", icon: Wallet },
  { key: "cod", name: "Cash on Delivery", description: "Pay on receipt (domestic)", icon: Banknote },
  { key: "bankTransfer", name: "Bank Transfer", description: "Manual bank deposit", icon: Landmark },
] as const

export function PaymentsPanel({ settings, update }: PanelProps) {
  const p = settings.payments
  return (
    <div className="space-y-5">
      <SettingsSection
        title="Payment methods"
        description="Enable how customers can pay at checkout."
        action={<StatusIndicator label={p.testMode ? "Test mode" : "Live"} tone={p.testMode ? "warning" : "success"} />}
      >
        {PAYMENT_METHODS.map((m) => {
          const enabled = p[m.key]
          const Icon = m.icon
          return (
            <div key={m.key} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusIndicator label={enabled ? "Active" : "Off"} tone={enabled ? "success" : "neutral"} />
                <Button variant="ghost" size="sm" onClick={() => update("payments", m.key, !enabled)}>
                  {enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          )
        })}
      </SettingsSection>

      <SettingsSection title="Developer" description="Simulate transactions without charging real cards.">
        <ToggleRow label="Test mode" description="Route all payments through provider sandboxes." checked={p.testMode} onCheckedChange={(v) => update("payments", "testMode", v)} />
      </SettingsSection>
    </div>
  )
}

export function TaxPanel({ settings, update }: PanelProps) {
  const t = settings.tax
  return (
    <SettingsSection title="Taxes & currency" description="How tax and multi-currency are handled at checkout.">
      <ToggleRow label="Prices include tax" description="Display tax-inclusive pricing on the storefront." checked={t.pricesIncludeTax} onCheckedChange={(v) => update("tax", "pricesIncludeTax", v)} />
      <SettingRow label="Default tax rate" description="Applied where no regional rate is set.">
        <SettingInput prefix="%" value={t.taxRate} onChange={(v) => update("tax", "taxRate", v)} />
      </SettingRow>
      <ToggleRow label="Automatic currency" description="Convert prices to the visitor's local currency." checked={t.autoCurrency} onCheckedChange={(v) => update("tax", "autoCurrency", v)} />
      <ToggleRow label="Round up converted prices" description="Round to the nearest whole unit for a premium feel." checked={t.roundingUp} onCheckedChange={(v) => update("tax", "roundingUp", v)} />
    </SettingsSection>
  )
}

export function CheckoutPanel({ settings, update }: PanelProps) {
  const c = settings.checkout
  return (
    <SettingsSection title="Checkout behaviour" description="Control the fields and steps buyers see." action={<Button variant="outline" size="xs" onClick={() => toast.success("Opened checkout preview")}>Preview</Button>}>
      <ToggleRow label="Guest checkout" description="Allow purchases without an account." checked={c.guestCheckout} onCheckedChange={(v) => update("checkout", "guestCheckout", v)} />
      <ToggleRow label="Require phone number" description="Needed for courier coordination." checked={c.phoneRequired} onCheckedChange={(v) => update("checkout", "phoneRequired", v)} />
      <ToggleRow label="Order notes" description="Let customers add delivery instructions." checked={c.orderNotes} onCheckedChange={(v) => update("checkout", "orderNotes", v)} />
      <ToggleRow label="Require terms acceptance" description="Customer must accept terms before paying." checked={c.termsRequired} onCheckedChange={(v) => update("checkout", "termsRequired", v)} />
      <ToggleRow label="Address validation" description="Verify shipping addresses in real time." checked={c.addressValidation} onCheckedChange={(v) => update("checkout", "addressValidation", v)} />
    </SettingsSection>
  )
}
