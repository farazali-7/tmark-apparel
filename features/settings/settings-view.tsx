"use client"

import * as React from "react"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ALL_NAV_ITEMS,
  SETTINGS_GROUP_OF,
} from "@/config/settings-nav"
import { SaveBar } from "@/features/settings/components/save-bar"
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar"
import { StatusIndicator } from "@/features/settings/components/settings-primitives"
import { PANEL_REGISTRY } from "@/features/settings/panel-registry"
import { useSettings } from "@/features/settings/use-settings"

export function SettingsView() {
  const { settings, update, dirty, saving, save, discard } = useSettings()
  const [active, setActive] = React.useState("store")
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (dirty) save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dirty, save])

  const activeItem = ALL_NAV_ITEMS.find((i) => i.id === active) ?? ALL_NAV_ITEMS[0]
  const renderPanel = PANEL_REGISTRY[active]

  return (
    <PageContainer className="space-y-6 pb-16">
      <PageHeader
        eyebrow="System / Settings"
        title="System Settings"
        description="Manage your business, storefront, users and integrations."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={discard} disabled={!dirty || saving}>
              Discard
            </Button>
            <Button size="sm" onClick={save} disabled={!dirty || saving}>
              Save Changes
            </Button>
          </>
        }
      />

      {/* Mobile section picker */}
      <div className="md:hidden">
        <Select value={active} onValueChange={setActive}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_NAV_ITEMS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {SETTINGS_GROUP_OF[item.id]} · {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-[15rem_1fr] lg:grid-cols-[16rem_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-4">
            <SettingsSidebar activeId={active} onSelect={setActive} query={query} onQueryChange={setQuery} />
          </div>
        </aside>

        {/* Panel content */}
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{SETTINGS_GROUP_OF[activeItem.id]}</p>
              <h2 className="font-display text-xl font-medium">{activeItem.label}</h2>
            </div>
            <StatusIndicator
              label={saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}
              tone={saving ? "info" : dirty ? "warning" : "success"}
            />
          </div>

          {loading ? (
            <div className="space-y-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-xl border bg-card p-5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                  <div className="space-y-3 pt-2">
                    {Array.from({ length: 3 }).map((__, j) => (
                      <div key={j} className="flex items-center justify-between gap-4">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-8 w-48 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderPanel?.({ settings, update })
          )}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </PageContainer>
  )
}
