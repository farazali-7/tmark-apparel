"use client"

import * as React from "react"
import { toast } from "sonner"

import { defaultSettings, type SettingsState } from "@/lib/mock-data/settings"
import type { UpdateFn } from "@/features/settings/panel-context"

/**
 * Owns the settings draft with dirty-tracking and save/discard. Immutable
 * per-group updates keep the change surface small and comparisons cheap.
 */
export function useSettings() {
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings)
  const [baseline, setBaseline] = React.useState<SettingsState>(defaultSettings)
  const [saving, setSaving] = React.useState(false)

  const update = React.useCallback<UpdateFn>((group, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }))
  }, [])

  const dirty = React.useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(baseline),
    [settings, baseline]
  )

  const save = React.useCallback(() => {
    setSaving(true)
    setTimeout(() => {
      setBaseline(settings)
      setSaving(false)
      toast.success("Settings saved")
    }, 550)
  }, [settings])

  const discard = React.useCallback(() => {
    setSettings(baseline)
    toast("Changes discarded")
  }, [baseline])

  return { settings, update, dirty, saving, save, discard }
}
