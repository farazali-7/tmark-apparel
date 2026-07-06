"use client"

import * as React from "react"
import { toast } from "sonner"
import { Check } from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import {
  DeviceFrame,
  PreviewSwitcher,
  type PreviewDevice,
} from "@/components/shared/device-preview"
import { ImageUploader } from "@/components/shared/image-uploader"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BannerPreview } from "@/features/banners/components/banner-preview"
import { cn } from "@/lib/utils"
import type { Banner, BannerType } from "@/types"

interface CreateBannerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner: Banner | null
}

const COVER_SEEDS = [
  "wedding",
  "velvet",
  "summer",
  "festive",
  "premium",
  "newarrivals",
  "bestsellers",
  "winter",
  "editor",
  "limited",
]

interface FormState {
  name: string
  type: BannerType
  targetPage: string
  headline: string
  subtitle: string
  cta: string
  buttonLink: string
  cover: string
  align: "left" | "center" | "right"
  status: string
  priority: string
  visibility: string
  startDate: string
  endDate: string
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  )
}

export function CreateBannerDrawer({
  open,
  onOpenChange,
  banner,
}: CreateBannerDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl lg:max-w-2xl">
        <BannerForm banner={banner} onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}

function BannerForm({
  banner,
  onClose,
}: {
  banner: Banner | null
  onClose: () => void
}) {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop")
  const [form, setForm] = React.useState<FormState>(() => ({
    name: banner?.name ?? "",
    type: banner?.type ?? "homepage",
    targetPage: banner?.targetPage ?? "Homepage",
    headline: banner?.headline ?? "Your headline here",
    subtitle: banner?.subtitle ?? "A short supporting line",
    cta: banner?.cta ?? "Shop now",
    buttonLink: banner?.buttonLink ?? "/collections/new-arrivals",
    cover: banner?.cover ?? "wedding",
    align: "left",
    status: banner?.status ?? "draft",
    priority: banner?.priority ?? "medium",
    visibility: banner?.visibility ?? "public",
    startDate: banner?.startDate?.slice(0, 10) ?? "",
    endDate: banner?.endDate?.slice(0, 10) ?? "",
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    toast.success(banner ? "Campaign updated" : "Campaign created", {
      description: `${form.name || "Untitled"} saved as ${form.status}.`,
    })
    onClose()
  }

  return (
    <>
      <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
        <SheetTitle className="font-display text-xl font-medium">
          {banner ? "Edit Campaign" : "Create Banner"}
        </SheetTitle>
        <SheetDescription>
          Craft the campaign and preview exactly how it appears on the storefront.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 p-4 sm:p-5">
        {/* Live preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <SectionTitle>Live preview</SectionTitle>
            <div className="flex items-center gap-2">
              <ToggleGroup
                type="single"
                value={form.align}
                onValueChange={(v) => v && set("align", v as FormState["align"])}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <ToggleGroupItem value="left" className="px-2 text-xs">L</ToggleGroupItem>
                <ToggleGroupItem value="center" className="px-2 text-xs">C</ToggleGroupItem>
                <ToggleGroupItem value="right" className="px-2 text-xs">R</ToggleGroupItem>
              </ToggleGroup>
              <PreviewSwitcher device={device} onDeviceChange={setDevice} />
            </div>
          </div>
          <DeviceFrame device={device} url={`tmarkapparel.com${form.buttonLink}`}>
            <BannerPreview
              cover={form.cover}
              headline={form.headline || "Your headline here"}
              subtitle={form.subtitle}
              cta={form.cta}
              align={form.align}
              className="aspect-[16/7]"
            />
          </DeviceFrame>
        </div>

        {/* General */}
        <div className="space-y-4">
          <SectionTitle>General</SectionTitle>
          <Field label="Campaign name" htmlFor="b-name">
            <Input id="b-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Wedding Season Hero" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Banner type">
              <Select value={form.type} onValueChange={(v) => set("type", v as BannerType)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Homepage</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Target page" htmlFor="b-target">
              <Input id="b-target" value={form.targetPage} onChange={(e) => set("targetPage", e.target.value)} placeholder="Homepage" />
            </Field>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-3">
          <SectionTitle>Media</SectionTitle>
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Campaign backdrop</p>
            <div className="flex flex-wrap gap-2">
              {COVER_SEEDS.map((seed) => (
                <button
                  key={seed}
                  type="button"
                  onClick={() => set("cover", seed)}
                  aria-label={`Use ${seed} backdrop`}
                  aria-pressed={form.cover === seed}
                  className={cn(
                    "relative size-12 overflow-hidden rounded-lg ring-1 ring-black/5 transition-transform hover:scale-105",
                    form.cover === seed && "ring-2 ring-gold"
                  )}
                >
                  <CampaignCover seed={seed} className="size-full" />
                  {form.cover === seed ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="size-4 text-white" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <ImageUploader />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <SectionTitle>Content</SectionTitle>
          <Field label="Headline" htmlFor="b-headline">
            <Input id="b-headline" value={form.headline} onChange={(e) => set("headline", e.target.value)} />
          </Field>
          <Field label="Subtitle" htmlFor="b-sub">
            <Input id="b-sub" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text" htmlFor="b-cta">
              <Input id="b-cta" value={form.cta} onChange={(e) => set("cta", e.target.value)} />
            </Field>
            <Field label="Button link" htmlFor="b-link">
              <Input id="b-link" value={form.buttonLink} onChange={(e) => set("buttonLink", e.target.value)} className="font-mono text-xs" />
            </Field>
          </div>
        </div>

        {/* Publishing */}
        <div className="space-y-4">
          <SectionTitle>Publishing</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Visibility">
              <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" htmlFor="b-start">
              <Input id="b-start" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </Field>
            <Field label="End date" htmlFor="b-end">
              <Input id="b-end" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      <SheetFooter className="flex-row justify-end gap-2 border-t p-4 sm:p-5">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {banner ? "Save changes" : "Create campaign"}
        </Button>
      </SheetFooter>
    </>
  )
}
