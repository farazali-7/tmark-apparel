"use client"

import { toast } from "sonner"
import { Pencil, Star, Trash2 } from "lucide-react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PRODUCT_STATUS_META, formatCurrency, formatDate } from "@/lib/constants"
import type { Product } from "@/types"

interface ProductDetailsDrawerProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (product: Product) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function ProductDetailsDrawer({
  product,
  open,
  onOpenChange,
  onDelete,
}: ProductDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg"
      >
        {product ? (
          <>
            <SheetHeader className="gap-0 border-b p-0">
              <div className="flex gap-4 p-5">
                <ProductThumb
                  seed={product.image}
                  name={product.name}
                  className="size-24 shrink-0"
                  iconClassName="size-10"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      label={PRODUCT_STATUS_META[product.status].label}
                      tone={PRODUCT_STATUS_META[product.status].tone}
                    />
                    {product.featured ? (
                      <StatusBadge label="Featured" tone="gold" />
                    ) : null}
                  </div>
                  <SheetTitle className="font-display text-lg leading-tight font-medium">
                    {product.name}
                  </SheetTitle>
                  <SheetDescription className="tabular">
                    {product.sku} · {product.category}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 pb-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => toast.success(`Editing ${product.name}`)}
                >
                  <Pencil className="size-4" /> Edit product
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      product.featured ? "Unfeatured" : "Marked as featured"
                    )
                  }
                >
                  <Star className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="gap-0">
              <div className="border-b px-5 pt-3">
                <TabsList className="h-9 bg-transparent p-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-5 p-5">
                <p className="text-sm text-muted-foreground">
                  {product.shortDescription}
                </p>
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Pricing
                  </p>
                  <div className="divide-y rounded-lg border px-3">
                    <Row label="Price" value={formatCurrency(product.price)} />
                    {product.salePrice ? (
                      <Row
                        label="Sale price"
                        value={formatCurrency(product.salePrice)}
                      />
                    ) : null}
                    {product.costPrice ? (
                      <Row
                        label="Cost price"
                        value={formatCurrency(product.costPrice)}
                      />
                    ) : null}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Inventory
                  </p>
                  <div className="divide-y rounded-lg border px-3">
                    <Row label="In stock" value={`${product.stock} units`} />
                    <Row
                      label="Low-stock alert"
                      value={`${product.lowStockThreshold} units`}
                    />
                    <Row label="Collection" value={product.collection} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Sizes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Colors
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="divide-y rounded-lg border px-3">
                  <Row label="Fabric" value={product.fabric} />
                  <Row label="Variants" value={`${product.variants.length}`} />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 p-5">
                <div className="divide-y rounded-lg border px-3">
                  <Row label="URL slug" value={`/${product.slug}`} />
                  <Row label="Meta title" value={product.name} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.shortDescription}
                </p>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 p-5">
                <div className="divide-y rounded-lg border px-3">
                  <Row label="Created" value={formatDate(product.createdAt)} />
                  <Row label="Last updated" value={formatDate(product.updatedAt)} />
                </div>
                <p className="text-xs text-muted-foreground">
                  A full audit trail will appear here once the product is live.
                </p>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
