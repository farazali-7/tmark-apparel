import type { SettingsState } from "@/lib/mock-data/settings"

export type UpdateFn = <G extends keyof SettingsState>(
  group: G,
  key: keyof SettingsState[G],
  value: SettingsState[G][keyof SettingsState[G]]
) => void

export interface PanelProps {
  settings: SettingsState
  update: UpdateFn
}
