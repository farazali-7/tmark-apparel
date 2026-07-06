"use client"

import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { HomepageDraft } from "@/types"

export function PublishDialog({
  open,
  onOpenChange,
  draft,
  onPublish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: HomepageDraft
  onPublish: () => void
}) {
  const visible = draft.sections.filter((s) => s.visible).length
  const hidden = draft.sections.length - visible

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish homepage?</DialogTitle>
          <DialogDescription>
            Your changes will go live on tmarkapparel.com immediately. You can
            restore a previous version from history at any time.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Visible sections</span>
            <span className="font-medium tabular">{visible}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Hidden sections</span>
            <span className="font-medium tabular">{hidden}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Theme</span>
            <span className="font-medium capitalize">{draft.globals.theme}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Announcement bar</span>
            <span className="font-medium">{draft.globals.announcementEnabled ? "On" : "Off"}</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              onPublish()
              onOpenChange(false)
            }}
          >
            <Rocket className="size-4" /> Publish now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
