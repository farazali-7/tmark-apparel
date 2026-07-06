"use client"

import type { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { COLLECTIONS } from "@/lib/constants"
import type { HomepageGlobals } from "@/types"

interface GlobalSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  globals: HomepageGlobals
  onChange: (patch: Partial<HomepageGlobals>) => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export function GlobalSettings({
  open,
  onOpenChange,
  globals,
  onChange,
}: GlobalSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
          <SheetTitle className="font-display text-xl font-medium">Global Settings</SheetTitle>
          <SheetDescription>
            Site-wide elements that frame every homepage section.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="space-y-3">
            <ToggleRow
              label="Announcement bar"
              description="Thin promo strip above the header"
              checked={globals.announcementEnabled}
              onCheckedChange={(v) => onChange({ announcementEnabled: v })}
            />
            {globals.announcementEnabled ? (
              <Field label="Announcement text">
                <Textarea
                  value={globals.announcementText}
                  onChange={(e) => onChange({ announcementText: e.target.value })}
                  className="min-h-14"
                />
              </Field>
            ) : null}
            <ToggleRow
              label="Sticky header"
              description="Header stays visible on scroll"
              checked={globals.stickyHeader}
              onCheckedChange={(v) => onChange({ stickyHeader: v })}
            />
          </div>

          <div className="space-y-4">
            <Field label="Featured collection">
              <Select value={globals.featuredCollection} onValueChange={(v) => onChange({ featuredCollection: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLLECTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Homepage theme">
                <Select value={globals.theme} onValueChange={(v) => onChange({ theme: v as HomepageGlobals["theme"] })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Seasonal theme">
                <Input value={globals.seasonalTheme} onChange={(e) => onChange({ seasonalTheme: e.target.value })} />
              </Field>
            </div>
          </div>

          <div className="space-y-3">
            <ToggleRow
              label="Newsletter"
              description="Show the email-capture block"
              checked={globals.newsletterEnabled}
              onCheckedChange={(v) => onChange({ newsletterEnabled: v })}
            />
            <Field label="Instagram handle">
              <Input value={globals.instagramHandle} onChange={(e) => onChange({ instagramHandle: e.target.value })} />
            </Field>
            <Field label="Footer note">
              <Input value={globals.footerNote} onChange={(e) => onChange({ footerNote: e.target.value })} />
            </Field>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
