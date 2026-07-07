"use client"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
}: {
  dirty: boolean
  saving: boolean
  onSave: () => void
  onDiscard: () => void
}) {
  if (!dirty && !saving) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div
        className={cn(
          "animate-in fade-in slide-in-from-bottom-2 pointer-events-auto flex items-center gap-3 rounded-full border bg-popover/95 py-1.5 pr-1.5 pl-4 shadow-lg backdrop-blur"
        )}
      >
        <span className="flex items-center gap-2 text-sm">
          <span className="size-1.5 rounded-full bg-amber-500" />
          <span className="font-medium">Unsaved changes</span>
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={onDiscard} disabled={saving}>
            Discard
          </Button>
          <Button size="sm" className="rounded-full" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
