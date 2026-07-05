"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  CalendarClock,
  Eye,
  Monitor,
  Pencil,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react"

import { CampaignCover } from "@/components/shared/campaign-cover"
import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  COLLECTION_STATUS_META,
  VISIBILITY_META,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/constants"
import { products } from "@/lib/mock-data/products"
import { cn } from "@/lib/utils"
import type { Collection } from "@/types"

interface CollectionDetailsDrawerProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (collection: Collection) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function matchProducts(collection: Collection) {
  return products.filter((p) =>
    collection.categories.some(
      (c) =>
        c === p.category ||
        c.startsWith(p.category.slice(0, 6)) ||
        p.category.startsWith(c.slice(0, 6))
    )
  )
}

const DEVICE_WIDTH = {
  desktop: "max-w-full",
  tablet: "max-w-[22rem]",
  mobile: "max-w-[15rem]",
} as const

type Device = keyof typeof DEVICE_WIDTH

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-lg font-medium tabular">{value}</p>
    </div>
  )
}

export function CollectionDetailsDrawer({
  collection,
  open,
  onOpenChange,
  onDelete,
}: CollectionDetailsDrawerProps) {
  const [device, setDevice] = React.useState<Device>("desktop")
  const matched = collection ? matchProducts(collection) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {collection ? (
          <>
            <SheetHeader className="gap-0 border-b p-0">
              <div className="relative h-32 overflow-hidden">
                <CampaignCover
                  seed={collection.cover}
                  label={collection.season}
                  className="absolute inset-0 size-full"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <StatusBadge
                    label={COLLECTION_STATUS_META[collection.status].label}
                    tone={COLLECTION_STATUS_META[collection.status].tone}
                    className="bg-background/90 backdrop-blur"
                  />
                  {collection.featured ? (
                    <StatusBadge label="Featured" tone="gold" />
                  ) : null}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <SheetTitle className="font-display text-xl leading-tight font-medium text-white">
                    {collection.name}
                  </SheetTitle>
                  <SheetDescription className="text-white/75">
                    {collection.subtitle}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => toast.success(`Editing ${collection.name}`)}
                >
                  <Pencil className="size-4" /> Edit campaign
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Opened storefront preview")}
                >
                  <Eye className="size-4" /> Live preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => onDelete(collection)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="gap-0">
              <div className="border-b px-4 pt-3">
                <TabsList className="h-9 bg-transparent p-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-5 p-4 sm:p-5">
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>

                {/* Storefront preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Storefront preview
                    </p>
                    <ToggleGroup
                      type="single"
                      value={device}
                      onValueChange={(v) => v && setDevice(v as Device)}
                      variant="outline"
                      size="sm"
                    >
                      <ToggleGroupItem value="desktop" aria-label="Desktop" className="px-2">
                        <Monitor className="size-3.5" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tablet" aria-label="Tablet" className="px-2">
                        <Tablet className="size-3.5" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="mobile" aria-label="Mobile" className="px-2">
                        <Smartphone className="size-3.5" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3">
                    <div
                      className={cn(
                        "mx-auto overflow-hidden rounded-lg border bg-background shadow-sm transition-all",
                        DEVICE_WIDTH[device]
                      )}
                    >
                      <div className="flex items-center gap-1 border-b bg-muted/60 px-2.5 py-1.5">
                        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                        <span className="ml-2 truncate text-[0.65rem] text-muted-foreground tabular">
                          tmarkapparel.com/collections/{collection.slug}
                        </span>
                      </div>
                      <div className="relative aspect-16/7">
                        <CampaignCover
                          seed={collection.cover}
                          className="absolute inset-0 size-full"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                          <p className="font-display text-sm font-medium">
                            {collection.name}
                          </p>
                          <p className="text-[0.6rem] text-white/70">
                            {collection.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-2.5">
                        {matched.slice(0, 3).map((p) => (
                          <div key={p.id} className="space-y-1">
                            <ProductThumb
                              seed={p.image}
                              name={p.name}
                              className="aspect-3/4 w-full"
                              iconClassName="size-5"
                            />
                            <div className="h-1.5 w-3/4 rounded-full bg-muted" />
                            <div className="h-1.5 w-1/2 rounded-full bg-muted" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divide-y rounded-lg border px-3">
                  <Row label="Season" value={collection.season} />
                  <Row
                    label="Visibility"
                    value={
                      <StatusBadge
                        label={VISIBILITY_META[collection.visibility].label}
                        tone={VISIBILITY_META[collection.visibility].tone}
                      />
                    }
                  />
                  {collection.scheduledFor ? (
                    <Row
                      label="Scheduled for"
                      value={
                        <span className="flex items-center justify-end gap-1">
                          <CalendarClock className="size-3.5" />
                          {formatDate(collection.scheduledFor)}
                        </span>
                      }
                    />
                  ) : null}
                  <Row label="Created" value={formatDate(collection.createdAt)} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Categories included
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {collection.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products" className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {formatNumber(collection.productCount)} products
                  </p>
                  <Button variant="outline" size="xs">
                    Manage products
                  </Button>
                </div>
                <ul className="divide-y">
                  {matched.slice(0, 6).map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                      <span className="w-4 text-center text-xs text-muted-foreground tabular">
                        {i + 1}
                      </span>
                      <ProductThumb seed={p.image} name={p.name} className="size-9" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                      </div>
                      <span className="text-sm font-medium tabular">
                        {formatCurrency(p.salePrice ?? p.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="Revenue" value={formatCurrency(collection.revenue)} />
                  <StatTile label="Products" value={formatNumber(collection.productCount)} />
                  <StatTile label="Views" value={formatNumber(collection.views)} />
                  <StatTile
                    label="Conversion"
                    value={`${collection.conversion.toFixed(1)}%`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Views and conversion are placeholders until storefront analytics
                  is connected.
                </p>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 p-4 sm:p-5">
                <div className="divide-y rounded-lg border px-3">
                  <Row label="URL slug" value={`/collections/${collection.slug}`} />
                  <Row label="Meta title" value={`${collection.name} | T-Mark`} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Open Graph preview
                  </p>
                  <div className="overflow-hidden rounded-lg border">
                    <div className="relative aspect-16/8">
                      <CampaignCover
                        seed={collection.cover}
                        label={collection.season}
                        className="absolute inset-0 size-full"
                      />
                    </div>
                    <div className="space-y-0.5 p-3">
                      <p className="text-[0.7rem] text-muted-foreground tabular uppercase">
                        tmarkapparel.com
                      </p>
                      <p className="text-sm font-medium">{collection.name}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-4 sm:p-5">
                <ol className="space-y-4">
                  {collection.activity.map((event) => (
                    <li key={event.id} className="flex gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border ring-4 ring-card" />
                      <div>
                        <p className="text-sm">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
