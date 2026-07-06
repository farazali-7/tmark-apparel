"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SECTION_META } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { HomepageSection } from "@/types"

interface SectionListProps {
  sections: HomepageSection[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (from: number, to: number) => void
  onToggleVisible: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function SectionList({
  sections,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisible,
  onDuplicate,
  onDelete,
  onAdd,
}: SectionListProps) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [overIndex, setOverIndex] = React.useState<number | null>(null)

  function handleDrop() {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Homepage Structure</h2>
          <p className="text-xs text-muted-foreground">
            {sections.filter((s) => s.visible).length} of {sections.length} visible
          </p>
        </div>
        <Button variant="outline" size="icon-sm" onClick={onAdd} aria-label="Add section">
          <Plus className="size-4" />
        </Button>
      </div>

      <ol className="flex-1 space-y-1 overflow-y-auto p-2">
        {sections.map((section, i) => {
          const meta = SECTION_META[section.type]
          const Icon = meta.icon
          const isSelected = section.id === selectedId
          const isDragging = dragIndex === i
          const isOver = overIndex === i && dragIndex !== null && dragIndex !== i

          return (
            <li
              key={section.id}
              draggable={!section.locked}
              onDragStart={() => setDragIndex(i)}
              onDragEnter={() => setOverIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDrop}
              onDrop={handleDrop}
              className={cn(
                "group flex items-center gap-1.5 rounded-lg border px-2 py-2 transition-all",
                isSelected ? "border-gold/40 bg-accent" : "border-transparent hover:bg-accent/60",
                isDragging && "opacity-40",
                isOver && "border-gold/50 border-dashed"
              )}
            >
              <span
                className={cn(
                  "shrink-0 text-muted-foreground/40",
                  section.locked ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing group-hover:text-muted-foreground"
                )}
                aria-hidden
              >
                {section.locked ? <Lock className="size-3.5" /> : <GripVertical className="size-4" />}
              </span>

              <button
                type="button"
                onClick={() => onSelect(section.id)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                    isSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                    !section.visible && "opacity-50"
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className={cn("block truncate text-sm font-medium", !section.visible && "text-muted-foreground")}>
                    {section.name}
                  </span>
                  <span className="block truncate text-[0.7rem] text-muted-foreground">
                    {meta.label}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onToggleVisible(section.id)}
                aria-label={section.visible ? "Hide section" : "Show section"}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {section.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground data-[state=open]:bg-muted">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Section options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem disabled={i === 0} onSelect={() => onReorder(i, i - 1)}>
                    <ArrowUp /> Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={i === sections.length - 1 || section.locked}
                    onSelect={() => onReorder(i, i + 1)}
                  >
                    <ArrowDown /> Move down
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onToggleVisible(section.id)}>
                    {section.visible ? <EyeOff /> : <Eye />}
                    {section.visible ? "Hide" : "Show"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onDuplicate(section.id)}>
                    <Copy /> Duplicate
                  </DropdownMenuItem>
                  {!section.locked ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(section.id)}>
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
