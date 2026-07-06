"use client"

import { Copy, MousePointerSquareDashed, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SECTION_META } from "@/lib/constants"
import {
  SECTION_FIELDS,
  type FieldDescriptor,
} from "@/features/homepage/section-config"
import type { HomepageSection, SectionSettings } from "@/types"

interface SectionEditorProps {
  section: HomepageSection | null
  onChange: (id: string, patch: Partial<SectionSettings>) => void
  onRename: (id: string, name: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function ControlRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor
  value: string | number | undefined
  onChange: (value: string | number) => void
}) {
  const str = value == null ? "" : String(value)

  switch (field.control) {
    case "textarea":
      return (
        <Textarea
          value={str}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-16"
        />
      )
    case "select":
      return (
        <Select value={str} onValueChange={(v) => onChange(field.numeric ? Number(v) : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "segmented":
      return (
        <ToggleGroup
          type="single"
          value={str}
          onValueChange={(v) => v && onChange(field.numeric ? Number(v) : v)}
          variant="outline"
          size="sm"
          className="h-8 w-full [&>*]:flex-1"
        >
          {field.options?.map((o) => (
            <ToggleGroupItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )
    default:
      return (
        <Input
          value={str}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
}

export function SectionEditor({
  section,
  onChange,
  onRename,
  onDuplicate,
  onDelete,
}: SectionEditorProps) {
  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl border border-dashed bg-muted/40 text-muted-foreground">
          <MousePointerSquareDashed className="size-5" strokeWidth={1.5} />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium">No section selected</p>
          <p className="mx-auto max-w-[14rem] text-xs text-muted-foreground">
            Pick a section from the list or the preview to edit its content and style.
          </p>
        </div>
      </div>
    )
  }

  const meta = SECTION_META[section.type]
  const fields = SECTION_FIELDS[section.type]
  const Icon = meta.icon

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b px-4 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{meta.label}</p>
          <input
            value={section.name}
            onChange={(e) => onRename(section.id, e.target.value)}
            className="w-full truncate bg-transparent text-sm font-medium outline-none focus-visible:underline"
            aria-label="Section name"
          />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{field.label}</Label>
            <ControlRenderer
              field={field}
              value={section.settings[field.key] as string | number | undefined}
              onChange={(value) => onChange(section.id, { [field.key]: value })}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t p-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onDuplicate(section.id)}>
          <Copy className="size-4" /> Duplicate
        </Button>
        {!section.locked ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        ) : null}
      </div>
    </div>
  )
}
