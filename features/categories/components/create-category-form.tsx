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
import { COLLECTIONS } from "@/lib/constants"
import { PARENT_OPTIONS } from "@/lib/mock-data/categories"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().max(240, "Keep it under 240 characters").optional(),
  parent: z.string(),
  displayOrder: z
    .string()
    .refine((v) => v === "" || /^\d+$/.test(v), "Whole number only"),
  collections: z.array(z.string()),
  featured: z.boolean(),
  visibility: z.enum(["visible", "hidden"]),
  status: z.enum(["active", "draft"]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, "Keep it under 160 characters").optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: "",
  slug: "",
  description: "",
  parent: "none",
  displayOrder: "",
  collections: [],
  featured: false,
  visibility: "visible",
  status: "draft",
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

interface CreateCategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryForm({
  open,
  onOpenChange,
}: CreateCategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
  })

  const slug = useWatch({ control: form.control, name: "slug" }) ?? ""
  const description = useWatch({ control: form.control, name: "description" }) ?? ""
  const metaDesc = useWatch({ control: form.control, name: "metaDescription" }) ?? ""

  React.useEffect(() => {
    if (!open) form.reset(DEFAULTS)
  }, [open, form])

  function onSubmit(values: FormValues) {
    toast.success(
      values.status === "active"
        ? `Published category "${values.name}"`
        : `Saved draft category "${values.name}"`
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
            Create Category
          </SheetTitle>
          <SheetDescription>
            Organize your catalog. Draft now, publish to the storefront when
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
                title="General Information"
                description="Name, hierarchy and how it's ordered."
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sherwanis"
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
                        <Input placeholder="sherwanis" {...field} />
                      </FormControl>
                      <FormDescription>
                        Storefront URL: /category/{field.value || "…"}
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
                          {description.length}/240
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Describe what belongs in this category…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (top level)</SelectItem>
                            {PARENT_OPTIONS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
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
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display order</FormLabel>
                        <FormControl>
                          <Input inputMode="numeric" placeholder="e.g. 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Media"
                description="Category thumbnail and an optional wide banner."
              >
                <div>
                  <p className="mb-2 text-sm font-medium">Category image</p>
                  <ImageUploader />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Banner image{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </p>
                  <ImageUploader />
                </div>
              </FormSection>

              <FormSection
                title="Organization"
                description="Collections, visibility and publishing."
              >
                <FormField
                  control={form.control}
                  name="collections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collections</FormLabel>
                      <ChipMultiSelect
                        options={COLLECTIONS}
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
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex h-full items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>Pin to homepage</FormDescription>
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-2 sm:grid-cols-2"
                        >
                          {(["draft", "active"] as const).map((status) => (
                            <label
                              key={status}
                              htmlFor={`cat-status-${status}`}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm capitalize transition-colors",
                                field.value === status
                                  ? "border-foreground bg-muted/50"
                                  : "hover:border-foreground/30"
                              )}
                            >
                              <RadioGroupItem
                                id={`cat-status-${status}`}
                                value={status}
                              />
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

              <FormSection title="SEO" description="How this appears in search.">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta title</FormLabel>
                      <FormControl>
                        <Input placeholder="Sherwanis | T-Mark Apparel" {...field} />
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
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Slug preview</p>
                  <p className="mt-0.5 truncate text-sm tabular">
                    tmarkapparel.com/category/
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
                onClick={() => form.setValue("status", "active")}
              >
                Publish category
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
