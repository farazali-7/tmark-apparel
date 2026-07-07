"use client"

import { toast } from "sonner"
import { Copy, Laptop, MonitorSmartphone, Plus, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SettingsSection,
  StatusIndicator,
} from "@/features/settings/components/settings-primitives"
import { SelectRow, ToggleRow } from "@/features/settings/components/setting-controls"
import { formatDate, formatRelative } from "@/lib/constants"
import { apiKeys, auditLog, sessions } from "@/lib/mock-data/settings"
import type { PanelProps } from "@/features/settings/panel-context"

export function AuthPanel({ settings, update }: PanelProps) {
  const s = settings.security
  return (
    <div className="space-y-5">
      <SettingsSection title="Authentication" description="Protect admin access to your business.">
        <ToggleRow label="Two-factor authentication" description="Require a second factor at sign-in." checked={s.twoFactor} onCheckedChange={(v) => update("security", "twoFactor", v)} />
        <ToggleRow label="Login alerts" description="Email me about sign-ins from new devices." checked={s.loginAlerts} onCheckedChange={(v) => update("security", "loginAlerts", v)} />
        <SelectRow label="Password policy" value={s.passwordPolicy} onValueChange={(v) => update("security", "passwordPolicy", v)} options={["Standard (8+ chars)", "Strong (12+ chars, mixed case, symbol)", "Maximum (16+ chars, rotated 90d)"]} />
        <SelectRow label="Session timeout" description="Sign out inactive sessions automatically." value={s.sessionTimeout} onValueChange={(v) => update("security", "sessionTimeout", v)} options={["7 days", "14 days", "30 days", "90 days"]} />
      </SettingsSection>
    </div>
  )
}

export function SessionsPanel() {
  return (
    <SettingsSection
      title="Active sessions"
      description="Devices currently signed in to this account."
      action={<Button variant="outline" size="sm" onClick={() => toast.success("Signed out everywhere else")}>Sign out all</Button>}
    >
      {sessions.map((session) => {
        const Icon = session.device.includes("iPhone") ? Smartphone : session.device.includes("iPad") ? MonitorSmartphone : Laptop
        return (
          <div key={session.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{session.device}</p>
                {session.current ? <StatusIndicator label="This device" tone="success" /> : null}
              </div>
              <p className="truncate text-xs text-muted-foreground tabular">
                {session.browser} · {session.location} · {session.ip}
              </p>
            </div>
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              {session.current ? "Active now" : formatRelative(session.lastActive)}
            </div>
            {!session.current ? (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast(`${session.device} signed out`)}>
                Revoke
              </Button>
            ) : null}
          </div>
        )
      })}
    </SettingsSection>
  )
}

export function ApiKeysPanel() {
  return (
    <SettingsSection
      title="API keys"
      description="Programmatic access to your store data."
      action={<Button size="sm" onClick={() => toast.success("New API key generated")}><Plus className="size-4" /> New key</Button>}
    >
      {apiKeys.map((key) => (
        <div key={key.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{key.label}</p>
              <span className="rounded-md border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">{key.scope}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{key.prefix}••••••••</code>
              <button
                type="button"
                onClick={() => toast.success("Key prefix copied")}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Copy key"
              >
                <Copy className="size-3" />
              </button>
            </div>
          </div>
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <p>Used {formatRelative(key.lastUsed)}</p>
            <p className="text-[0.7rem]">Created {formatDate(key.created)}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast("API key revoked")}>Revoke</Button>
        </div>
      ))}
    </SettingsSection>
  )
}

export function AuditPanel() {
  return (
    <SettingsSection
      title="Audit log"
      description="A record of sensitive changes across the admin."
      action={<Button variant="outline" size="sm" onClick={() => toast.success("Audit log exported")}>Export</Button>}
    >
      <ol className="p-4 sm:p-5">
        {auditLog.map((entry, i) => (
          <li key={entry.id} className="flex gap-3 pb-5 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span className="z-10 mt-1 size-2 rounded-full bg-border ring-4 ring-card" />
              {i < auditLog.length - 1 ? (
                <span className="absolute top-3 h-[calc(100%-0.5rem)] w-px bg-border" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{entry.actor}</span> {entry.action}
              </p>
              <p className="text-xs text-muted-foreground">{entry.target}</p>
              <p className="mt-0.5 text-[0.7rem] text-muted-foreground tabular">{formatRelative(entry.at)}</p>
            </div>
          </li>
        ))}
      </ol>
    </SettingsSection>
  )
}
