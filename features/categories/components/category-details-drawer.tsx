"use client"

import { toast } from "sonner"
import { PackageX, Pencil, Star, Trash2 } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
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
  CATEGORY_STATUS_META,
  VISIBILITY_META,
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelative,
} from "@/lib/constants"
import { products } from "@/lib/mock-data/products"
import type { Category } from "@/types"

interface CategoryDetailsDrawerProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (category: Category) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function matchProducts(category: Category) {
  const key = category.name.slice(0, 6)
  return products.filter(
    (p) => p.category === category.name || p.category.startsWith(key)
  )
}

export function CategoryDetailsDrawer({
  category,
  open,
  onOpenChange,
  onDelete,
}: CategoryDetailsDrawerProps) {
  const matched = category ? matchProducts(category) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg"
      >
        {category ? (
          <>
            <SheetHeader className="gap-0 border-b p-0">
              <div className="flex gap-4 p-5">
                <ProductThumb
                  seed={category.image}
                  name={category.name}
                  className="size-24 shrink-0"
                  iconClassName="size-10"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge
                      label={CATEGORY_STATUS_META[category.status].label}
                      tone={CATEGORY_STATUS_META[category.status].tone}
                    />
                    <StatusBadge
                      label={VISIBILITY_META[category.visibility].label}
                      tone={VISIBILITY_META[category.visibility].tone}
                    />
                    {category.featured ? (
                      <StatusBadge label="Featured" tone="gold" />
                    ) : null}
                  </div>
                  <SheetTitle className="font-display text-lg leading-tight font-medium">
                    {category.name}
                  </SheetTitle>
                  <SheetDescription className="tabular">
                    /{category.slug}
                    {category.parent ? ` · under ${category.parent}` : ""}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 pb-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => toast.success(`Editing ${category.name}`)}
                >
                  <Pencil className="size-4" /> Edit category
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      category.featured ? "Unfeatured" : "Marked as featured"
                    )
                  }
                >
                  <Star className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="gap-0">
              <div className="border-b px-5 pt-3">
                <TabsList className="h-9 bg-transparent p-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="publishing">Publishing</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-5 p-5">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    General
                  </p>
                  <div className="divide-y rounded-lg border px-3">
                    <Row label="Parent category" value={category.parent ?? "None"} />
                    <Row label="Display order" value={category.displayOrder} />
                    <Row
                      label="Products"
                      value={formatNumber(category.productCount)}
                    />
                    <Row label="Created" value={formatDate(category.createdAt)} />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Collections
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.collections.map((col) => (
                      <span
                        key={col}
                        className="rounded-md border px-2.5 py-1 text-xs font-medium"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products" className="p-5">
                {matched.length > 0 ? (
                  <ul className="divide-y">
                    {matched.slice(0, 6).map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 py-3 first:pt-0"
                      >
                        <ProductThumb
                          seed={product.image}
                          name={product.name}
                          className="size-10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground tabular">
                            {product.sku}
                          </p>
                        </div>
                        <span className="text-sm font-medium tabular">
                          {formatCurrency(product.salePrice ?? product.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={PackageX}
                    title="No products yet"
                    description="Assign products to this category to see them here."
                    compact
                  />
                )}
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 p-5">
                <div className="divide-y rounded-lg border px-3">
                  <Row label="URL slug" value={`/category/${category.slug}`} />
                  <Row label="Meta title" value={category.metaTitle} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Meta description
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {category.metaDescription}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="publishing" className="space-y-5 p-5">
                <div className="divide-y rounded-lg border px-3">
                  <Row
                    label="Status"
                    value={
                      <StatusBadge
                        label={CATEGORY_STATUS_META[category.status].label}
                        tone={CATEGORY_STATUS_META[category.status].tone}
                      />
                    }
                  />
                  <Row
                    label="Visibility"
                    value={
                      <StatusBadge
                        label={VISIBILITY_META[category.visibility].label}
                        tone={VISIBILITY_META[category.visibility].tone}
                      />
                    }
                  />
                  <Row
                    label="Featured"
                    value={category.featured ? "Yes" : "No"}
                  />
                  <Row label="Display order" value={category.displayOrder} />
                  <Row label="Last updated" value={formatDate(category.updatedAt)} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Hidden categories remain fully manageable here but are removed
                  from storefront navigation and search.
                </p>
              </TabsContent>

              <TabsContent value="activity" className="p-5">
                <ol className="space-y-4">
                  {category.activity.map((event) => (
                    <li key={event.id} className="flex gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border ring-4 ring-card" />
                      <div>
                        <p className="text-sm">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelative(event.timestamp)}
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
