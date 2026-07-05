"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { ChipMultiSelect } from "@/components/shared/chip-multi-select"
import { FormSection } from "@/components/shared/form-section"
import { ImageUploader } from "@/components/shared/image-uploader"
import { ProductPicker } from "@/components/shared/product-picker"
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
import { CATEGORIES, SEASONS } from "@/lib/constants"
import { products } from "@/lib/mock-data/products"
import { cn } from "@/lib/utils"

const pickerProducts = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  image: p.image,
  price: p.price,
  salePrice: p.salePrice,
}))

const schema = z
  .object({
    name: z.string().min(2, "Collection name is required"),
    subtitle: z.string().max(80, "Keep it short").optional(),
    slug: z.string().min(2, "Slug is required"),
    description: z.string().max(280, "Keep it under 280 characters").optional(),
    season: z.string().min(1, "Select a season"),
    categories: z.array(z.string()),
    productIds: z.array(z.string()).min(1, "Add at least one product"),
    featured: z.boolean(),
    status: z.enum(["draft", "published", "scheduled"]),
    scheduledFor: z.string().optional(),
    visibility: z.enum(["visible", "hidden"]),
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160, "Keep it under 160 characters").optional(),
  })
  .superRefine((val, ctx) => {
    if (val.status === "scheduled" && !val.scheduledFor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledFor"],
        message: "Pick a publish date",
      })
    }
  })

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: "",
  subtitle: "",
  slug: "",
  description: "",
  season: "",
  categories: [],
  productIds: [],
  featured: false,
  status: "draft",
  scheduledFor: "",
  visibility: "visible",
  metaTitle: "",
  metaDescription: "",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface CreateCollectionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCollectionForm({
  open,
  onOpenChange,
}: CreateCollectionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
  })

  const slug = useWatch({ control: form.control, name: "slug" }) ?? ""
  const description = useWatch({ control: form.control, name: "description" }) ?? ""
  const status = useWatch({ control: form.control, name: "status" })

  React.useEffect(() => {
    if (!open) form.reset(DEFAULTS)
  }, [open, form])

  function onSubmit(values: FormValues) {
    const verb =
      values.status === "published"
        ? "Published"
        : values.status === "scheduled"
          ? "Scheduled"
          : "Saved draft"
    toast.success(`${verb} collection "${values.name}"`)
    onOpenChange(false)
  }

  function onError() {
    toast.error("Please fix the highlighted fields")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="font-display text-lg font-medium">
            Create Collection
          </SheetTitle>
          <SheetDescription>
            Build a merchandising campaign — curate products, set the season and
            schedule the drop.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <FormSection
                title="General"
                description="The campaign's name and story."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. The Wedding Edit"
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
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ceremonial tailoring for the modern groom"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="wedding-collection" {...field} />
                      </FormControl>
                      <FormDescription>
                        /collections/{field.value || "…"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Description</FormLabel>
                        <span className="text-xs text-muted-foreground tabular">
                          {description.length}/280
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Tell the story behind this campaign…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection
                title="Media"
                description="Cover art and an optional wide campaign banner."
              >
                <div>
                  <p className="mb-2 text-sm font-medium">Cover image</p>
                  <ImageUploader />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Campaign banner{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </p>
                  <ImageUploader />
                </div>
              </FormSection>

              <FormSection
                title="Merchandising"
                description="Curate the products and categories this campaign features."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SEASONS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
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
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex h-full items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Featured campaign</FormLabel>
                          <FormDescription>Spotlight on storefront</FormDescription>
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
                </div>
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories included</FormLabel>
                      <ChipMultiSelect
                        options={CATEGORIES}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Products *</FormLabel>
                      <FormDescription>
                        Add products and drag to reorder — the first becomes the
                        featured hero.
                      </FormDescription>
                      <ProductPicker
                        products={pickerProducts}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection
                title="Publishing"
                description="Decide when and where this goes live."
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
                          {(["draft", "published", "scheduled"] as const).map(
                            (s) => (
                              <label
                                key={s}
                                htmlFor={`col-status-${s}`}
                                className={cn(
                                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm capitalize transition-colors",
                                  field.value === s
                                    ? "border-foreground bg-muted/50"
                                    : "hover:border-foreground/30"
                                )}
                              >
                                <RadioGroupItem id={`col-status-${s}`} value={s} />
                                {s}
                              </label>
                            )
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {status === "scheduled" ? (
                    <FormField
                      control={form.control}
                      name="scheduledFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publish date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="visible">Visible</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection title="SEO" description="How this campaign appears in search & social.">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta title</FormLabel>
                      <FormControl>
                        <Input placeholder="The Wedding Edit | T-Mark Apparel" {...field} />
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
                      <FormLabel>Meta description</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="Search & social summary…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Slug preview</p>
                  <p className="mt-0.5 truncate text-sm tabular">
                    tmarkapparel.com/collections/
                    <span className="text-foreground">{slug || "your-slug"}</span>
                  </p>
                </div>
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
                onClick={() => {
                  if (form.getValues("status") !== "scheduled") {
                    form.setValue("status", "published")
                  }
                }}
              >
                Publish collection
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
