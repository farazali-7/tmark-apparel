"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/features/settings/components/settings-primitives"
import type { Integration } from "@/lib/mock-data/settings"

export function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-foreground/15">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 font-display text-sm font-medium">
        {integration.name.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{integration.name}</p>
          {integration.connected ? (
            <StatusIndicator label="Connected" tone="success" />
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {integration.connected && integration.detail
            ? integration.detail
            : integration.description}
        </p>
      </div>
      <Button
        variant={integration.connected ? "outline" : "default"}
        size="sm"
        onClick={() =>
          toast.success(
            integration.connected
              ? `${integration.name} disconnected`
              : `${integration.name} connected`
          )
        }
      >
        {integration.connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  )
}
