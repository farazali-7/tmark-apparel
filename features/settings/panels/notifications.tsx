"use client"

import { SettingsSection } from "@/features/settings/components/settings-primitives"
import { ToggleRow } from "@/features/settings/components/setting-controls"
import type { PanelProps } from "@/features/settings/panel-context"

export function NotificationsPanel({ settings, update }: PanelProps) {
  const n = settings.notifications
  return (
    <div className="space-y-5">
      <SettingsSection title="Channels" description="How notifications are delivered to your team and customers.">
        <ToggleRow label="Email" description="Transactional and admin emails." checked={n.email} onCheckedChange={(v) => update("notifications", "email", v)} />
        <ToggleRow label="WhatsApp" description="Order updates via WhatsApp Business." checked={n.whatsapp} onCheckedChange={(v) => update("notifications", "whatsapp", v)} />
        <ToggleRow label="SMS" description="Text alerts (coming soon)." checked={n.sms} onCheckedChange={(v) => update("notifications", "sms", v)} />
      </SettingsSection>

      <SettingsSection title="Order & customer events" description="Choose which activity triggers a notification.">
        <ToggleRow label="Order placed" description="Notify staff and confirm to the customer." checked={n.orderPlaced} onCheckedChange={(v) => update("notifications", "orderPlaced", v)} />
        <ToggleRow label="Order shipped" description="Send tracking details on dispatch." checked={n.orderShipped} onCheckedChange={(v) => update("notifications", "orderShipped", v)} />
        <ToggleRow label="New customer sign-up" description="Alert when an account is created." checked={n.customerSignup} onCheckedChange={(v) => update("notifications", "customerSignup", v)} />
        <ToggleRow label="Refund requested" description="Flag refund requests to admins immediately." checked={n.refundRequest} onCheckedChange={(v) => update("notifications", "refundRequest", v)} />
      </SettingsSection>

      <SettingsSection title="Admin alerts" description="Operational notifications for the team only.">
        <ToggleRow label="Low stock" description="When a product drops below its threshold." checked={n.lowStock} onCheckedChange={(v) => update("notifications", "lowStock", v)} />
        <ToggleRow label="New review" description="When a customer leaves a review to moderate." checked={n.newReview} onCheckedChange={(v) => update("notifications", "newReview", v)} />
      </SettingsSection>
    </div>
  )
}
