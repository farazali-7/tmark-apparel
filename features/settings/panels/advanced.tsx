"use client"

import { toast } from "sonner"
import { Download, FileDown, FileUp, RotateCcw, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SettingsSection,
  StatusIndicator,
} from "@/features/settings/components/settings-primitives"
import { SelectRow, ToggleRow } from "@/features/settings/components/setting-controls"
import { formatRelative } from "@/lib/constants"
import { backups } from "@/lib/mock-data/settings"
import type { PanelProps } from "@/features/settings/panel-context"

export function BackupsPanel({ settings, update }: PanelProps) {
  const a = settings.advanced
  return (
    <div className="space-y-5">
      <SettingsSection title="Automatic backups" description="Keep a safe copy of your store data.">
        <ToggleRow label="Automatic backups" description="Back up the store on a schedule." checked={a.autoBackup} onCheckedChange={(v) => update("advanced", "autoBackup", v)} />
        <SelectRow label="Frequency" value={a.backupFrequency} onValueChange={(v) => update("advanced", "backupFrequency", v)} options={["Hourly", "Daily", "Weekly"]} />
      </SettingsSection>

      <SettingsSection
        title="Recent backups"
        description="Restore or download a previous snapshot."
        action={<Button variant="outline" size="sm" onClick={() => toast.success("Backup started")}>Back up now</Button>}
      >
        {backups.map((b) => (
          <div key={b.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{b.label}</p>
              <p className="text-xs text-muted-foreground tabular">{b.size} · {formatRelative(b.at)}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => toast.success("Backup downloading")} aria-label="Download backup">
              <Download className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toast("Restore requested")}>
              <RotateCcw className="size-3.5" /> Restore
            </Button>
          </div>
        ))}
      </SettingsSection>
    </div>
  )
}

export function DataPanel() {
  return (
    <SettingsSection title="Import & export" description="Move catalog, customer and order data in and out.">
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <button
          type="button"
          onClick={() => toast.success("Import wizard opened")}
          className="flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:border-foreground/20"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><FileUp className="size-4" /></span>
          <span>
            <span className="block text-sm font-medium">Import data</span>
            <span className="block text-xs text-muted-foreground">Upload a CSV to add products or customers.</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => toast.success("Export queued")}
          className="flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:border-foreground/20"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><FileDown className="size-4" /></span>
          <span>
            <span className="block text-sm font-medium">Export data</span>
            <span className="block text-xs text-muted-foreground">Download a full CSV of any dataset.</span>
          </span>
        </button>
      </div>
    </SettingsSection>
  )
}

export function MaintenancePanel({ settings, update }: PanelProps) {
  const a = settings.advanced
  return (
    <div className="space-y-5">
      <SettingsSection title="Maintenance mode" description="Temporarily take the storefront offline.">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Maintenance mode</p>
              <StatusIndicator label={a.maintenanceMode ? "Storefront offline" : "Storefront live"} tone={a.maintenanceMode ? "warning" : "success"} />
            </div>
            <p className="text-xs text-muted-foreground">Shoppers see a branded holding page; the admin stays accessible.</p>
          </div>
          <Button
            variant={a.maintenanceMode ? "default" : "outline"}
            size="sm"
            onClick={() => update("advanced", "maintenanceMode", !a.maintenanceMode)}
          >
            {a.maintenanceMode ? "Bring online" : "Enable"}
          </Button>
        </div>
      </SettingsSection>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5">
        <div className="flex items-start gap-3 border-b border-destructive/20 px-4 py-3.5 sm:px-5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
            <p className="text-xs text-muted-foreground">Irreversible and destructive actions.</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div>
            <p className="text-sm font-medium">Reset storefront</p>
            <p className="text-xs text-muted-foreground">Clears homepage layout and campaign data.</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => toast("This would open a confirmation")}>Reset</Button>
        </div>
      </div>
    </div>
  )
}
