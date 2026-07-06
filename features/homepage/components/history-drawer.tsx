"use client"

import { toast } from "sonner"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatRelative } from "@/lib/constants"
import type { HomepageRevision } from "@/types"

export function HistoryDrawer({
  open,
  onOpenChange,
  revisions,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  revisions: HomepageRevision[]
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
          <SheetTitle className="font-display text-xl font-medium">Version History</SheetTitle>
          <SheetDescription>Restore any previously published homepage.</SheetDescription>
        </SheetHeader>

        <ol className="relative p-4 sm:p-5">
          {revisions.map((rev, i) => (
            <li key={rev.id} className="flex gap-3 pb-5 last:pb-0">
              <div className="relative flex flex-col items-center">
                <span className="z-10 mt-1 size-2.5 rounded-full bg-border ring-4 ring-popover" />
                {i < revisions.length - 1 ? (
                  <span className="absolute top-4 h-[calc(100%-0.5rem)] w-px bg-border" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{rev.label}</p>
                  {rev.published ? (
                    <StatusBadge label="Published" tone="success" />
                  ) : (
                    <StatusBadge label="Draft" tone="neutral" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {rev.author} · {formatRelative(rev.at)}
                </p>
                <Button
                  variant="outline"
                  size="xs"
                  className="mt-2"
                  onClick={() => {
                    toast.success("Version restored", { description: rev.label })
                    onOpenChange(false)
                  }}
                >
                  <RotateCcw className="size-3" /> Restore
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </SheetContent>
    </Sheet>
  )
}
