"use client"

import { Eye, EyeOff, Pencil, Search, ShoppingBag } from "lucide-react"

import { DeviceFrame, type PreviewDevice } from "@/components/shared/device-preview"
import { SECTION_META } from "@/lib/constants"
import { SectionPreview } from "@/features/homepage/components/section-preview"
import { cn } from "@/lib/utils"
import type { HomepageDraft } from "@/types"

interface HomepagePreviewProps {
  draft: HomepageDraft
  device: PreviewDevice
  selectedId: string | null
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
}

export function HomepagePreview({
  draft,
  device,
  selectedId,
  onSelect,
  onToggleVisible,
}: HomepagePreviewProps) {
  const visible = draft.sections.filter((s) => s.visible)

  return (
    <DeviceFrame device={device} contentClassName="max-h-[70vh] overflow-y-auto">
      {/* Announcement bar */}
      {draft.globals.announcementEnabled ? (
        <div className="bg-foreground px-4 py-1.5 text-center text-[0.65rem] font-medium tracking-wide text-background">
          {draft.globals.announcementText}
        </div>
      ) : null}

      {/* Storefront header */}
      <div className="flex items-center justify-between border-b bg-background/95 px-4 py-2.5">
        <span className="font-display text-sm font-medium tracking-tight">T-Mark Apparel</span>
        <nav className="hidden items-center gap-3 text-[0.7rem] text-muted-foreground sm:flex">
          <span>Ready to Wear</span>
          <span>Made to Measure</span>
          <span>Collections</span>
          <span>Atelier</span>
        </nav>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="size-3.5" />
          <ShoppingBag className="size-3.5" />
        </div>
      </div>

      {/* Sections */}
      {visible.map((section) => {
        const isSelected = section.id === selectedId
        return (
          <div
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={cn(
              "group/section relative cursor-pointer outline-none ring-inset transition-all",
              isSelected ? "ring-2 ring-gold" : "hover:ring-2 hover:ring-gold/40"
            )}
          >
            {/* Hover/selected toolbar */}
            <div
              className={cn(
                "absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-foreground/90 px-1.5 py-1 text-background opacity-0 backdrop-blur transition-opacity",
                isSelected ? "opacity-100" : "group-hover/section:opacity-100"
              )}
            >
              <span className="flex items-center gap-1 px-1 text-[0.65rem] font-medium">
                <Pencil className="size-2.5" /> {SECTION_META[section.type].label}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisible(section.id)
                }}
                aria-label="Hide section"
                className="flex size-5 items-center justify-center rounded hover:bg-background/20"
              >
                {section.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
              </button>
            </div>
            <SectionPreview section={section} />
          </div>
        )
      })}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-20 text-center">
          <p className="text-sm font-medium">Your homepage is empty</p>
          <p className="text-xs text-muted-foreground">Enable a section to start building.</p>
        </div>
      ) : null}
    </DeviceFrame>
  )
}
