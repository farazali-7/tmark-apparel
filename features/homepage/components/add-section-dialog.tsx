"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SECTION_META } from "@/lib/constants"
import type { HomepageSectionType } from "@/types"

const ADDABLE: HomepageSectionType[] = [
  "hero",
  "featured_categories",
  "featured_collections",
  "featured_products",
  "brand_story",
  "custom_tailoring",
  "testimonials",
  "instagram",
  "newsletter",
]

export function AddSectionDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (type: HomepageSectionType) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a section</DialogTitle>
          <DialogDescription>
            Choose a block to add to your homepage. You can reorder and edit it
            afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ADDABLE.map((type) => {
            const meta = SECTION_META[type]
            const Icon = meta.icon
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(type)
                  onOpenChange(false)
                }}
                className="flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{meta.label}</span>
                  <span className="block text-xs text-muted-foreground">{meta.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
