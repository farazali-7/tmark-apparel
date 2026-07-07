"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { SETTINGS_NAV } from "@/config/settings-nav"
import { cn } from "@/lib/utils"

interface SettingsSidebarProps {
  activeId: string
  onSelect: (id: string) => void
  query: string
  onQueryChange: (value: string) => void
}

export function SettingsSidebar({
  activeId,
  onSelect,
  query,
  onQueryChange,
}: SettingsSidebarProps) {
  const q = query.trim().toLowerCase()

  const groups = React.useMemo(() => {
    if (!q) return SETTINGS_NAV
    return SETTINGS_NAV.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
      ),
    })).filter((group) => group.items.length > 0)
  }, [q])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search settings…"
          className="h-9 pl-9"
          aria-label="Search settings"
        />
      </div>

      <nav className="space-y-4">
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-2 text-[0.65rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = item.id === activeId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        active
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      {active ? (
                        <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                      ) : null}
                      <Icon className={cn("size-4 shrink-0", active ? "text-foreground" : "text-muted-foreground")} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {groups.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No settings match “{query}”.
          </p>
        ) : null}
      </nav>
    </div>
  )
}
