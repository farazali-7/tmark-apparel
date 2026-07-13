"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { ChipMultiSelect } from "@/components/shared/chip-multi-select"
import { FormSection } from "@/components/shared/form-section"
import { ImageUploader } from "@/components/shared/image-uploader"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { CATEGORIES, COLLECTIONS, COLORS, FABRICS, SIZES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const numeric = (msg: string) =>
  z.string().refine((v) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0, msg)

const schema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().max(160, "Keep it under 160 characters").optional(),
  longDescription: z.string().optional(),
  price: numeric("Enter a valid price"),
  salePrice: z.string().optional(),
  costPrice: z.string().optional(),
  sku: z.string().min(2, "SKU is required"),
  stock: numeric("Enter available stock"),
  lowStockThreshold: numeric("Set a threshold"),
  trackInventory: z.boolean(),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  colors: z.array(z.string()).min(1, "Select at least one color"),
  fabric: z.string().min(1, "Select a fabric"),
  careInstructions: z.string().optional(),
  category: z.string().min(1, "Select a category"),
  collection: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, "Keep it under 160 characters").optional(),
  status: z.enum(["active", "draft", "archived"]),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  price: "",
  salePrice: "",
  costPrice: "",
  sku: "",
  stock: "",
  lowStockThreshold: "10",
  trackInventory: true,
  sizes: [],
  colors: [],
  fabric: "",
  careInstructions: "",
  category: "",
  collection: "",
  tags: "",
  featured: false,
  metaTitle: "",
  metaDescription: "",
  status: "draft",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface AddProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductForm({ open, onOpenChange }: AddProductFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
  })

  const shortDesc =
    useWatch({ control: form.control, name: "shortDescription" }) ?? ""
  const metaDesc =
    useWatch({ control: form.control, name: "metaDescription" }) ?? ""

  React.useEffect(() => {
    if (!open) form.reset(DEFAULTS)
  }, [open, form])

  function onSubmit(values: FormValues) {
    toast.success(
      values.status === "active"
        ? `Published "${values.name}"`
        : `Saved draft "${values.name}"`
    )
    onOpenChange(false)
  }

  function onError() {
    toast.error("Please fix the highlighted fields")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="font-display text-lg font-medium">
            Add Product
          </SheetTitle>
          <SheetDescription>
            Create a new listing for the T-Mark catalog. Draft now, publish when
            ready.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <FormSection
                title="Basic Information"
                description="The essentials shown to customers."
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Maroon Velvet Sherwani"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (!form.getFieldState("slug").isDirty) {
                              form.setValue("slug", slugify(e.target.value))
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="maroon-velvet-sherwani" {...field} />
                      </FormControl>
                      <FormDescription>
                        Used in the product URL: /products/{field.value || "…"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Short description</FormLabel>
                        <span className="text-xs text-muted-foreground tabular">
                          {shortDesc.length}/160
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="A one-line summary for cards and previews."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Fabric, fit, craftsmanship and styling notes…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Pricing" description="All values in PKR.">
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale price</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost price</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Inventory"
                description="Track stock and get low-stock alerts."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input placeholder="SHW-MRN-42" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock *</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low-stock alert</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trackInventory"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Track inventory</FormLabel>
                        <FormDescription>
                          Automatically reduce stock as orders are placed.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection
                title="Media"
                description="First image becomes the thumbnail."
              >
                <ImageUploader />
              </FormSection>

              <FormSection
                title="Attributes"
                description="Sizing, colorways and fabric details."
              >
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes *</FormLabel>
                      <ChipMultiSelect
                        options={SIZES}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors *</FormLabel>
                      <ChipMultiSelect
                        options={COLORS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fabric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fabric" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FABRICS.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="careInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Care instructions</FormLabel>
                        <FormControl>
                          <Input placeholder="Dry clean only" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Organization"
                description="Where this product lives in the catalog."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="collection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COLLECTIONS.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="wedding, embroidered, groom" {...field} />
                      </FormControl>
                      <FormDescription>Separate tags with commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Feature this product</FormLabel>
                        <FormDescription>
                          Highlight it on the storefront homepage.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="SEO" description="How this appears in search.">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta title</FormLabel>
                      <FormControl>
                        <Input placeholder="Maroon Velvet Sherwani | T-Mark Apparel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Meta description</FormLabel>
                        <span className="text-xs text-muted-foreground tabular">
                          {metaDesc.length}/160
                        </span>
                      </div>
                      <FormControl>
                        <Textarea rows={2} placeholder="Search-friendly summary…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection
                title="Publishing"
                description="Control visibility of this product."
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-2 sm:grid-cols-3"
                        >
                          {(["draft", "active", "archived"] as const).map((status) => (
                            <label
                              key={status}
                              htmlFor={`status-${status}`}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm capitalize transition-colors",
                                field.value === status
                                  ? "border-foreground bg-muted/50"
                                  : "hover:border-foreground/30"
                              )}
                            >
                              <RadioGroupItem id={`status-${status}`} value={status} />
                              {status}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
            </div>

            <div className="flex items-center justify-end gap-2 border-t bg-background p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                onClick={() => form.setValue("status", "draft")}
              >
                Save draft
              </Button>
              <Button
                type="submit"
                onClick={() => form.setValue("status", "active")}
              >
                Publish product
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
