"use client"

import * as React from "react"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"

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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PROMOTION_TYPE_META, formatCurrency } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { PromotionScope, PromotionType } from "@/types"
import { DiscountBadge } from "@/features/promotions/components/promotion-badges"

interface CreatePromotionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  presetType?: PromotionType | null
  presetScope?: PromotionScope | null
}

const STEPS = ["General", "Discount", "Eligibility", "Schedule", "Publish"] as const

const TYPES = Object.keys(PROMOTION_TYPE_META) as PromotionType[]

interface FormState {
  name: string
  code: string
  description: string
  type: PromotionType
  value: string
  buyX: string
  getY: string
  scope: PromotionScope
  vipOnly: boolean
  minOrder: string
  maxUses: string
  perCustomer: string
  startDate: string
  endDate: string
  autoExpire: boolean
  status: string
  visibility: string
}

const INITIAL: FormState = {
  name: "",
  code: "",
  description: "",
  type: "percentage",
  value: "",
  buyX: "2",
  getY: "1",
  scope: "entire_store",
  vipOnly: false,
  minOrder: "",
  maxUses: "",
  perCustomer: "1",
  startDate: "",
  endDate: "",
  autoExpire: true,
  status: "draft",
  visibility: "public",
}

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-[0.7rem] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function CreatePromotionSheet({
  open,
  onOpenChange,
  presetType,
  presetScope,
}: CreatePromotionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        {/* Remounts on each open (Radix unmounts closed content), so the form
            resets and picks up the latest quick-create preset without effects. */}
        <PromotionForm
          presetType={presetType ?? "percentage"}
          presetScope={presetScope ?? "entire_store"}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

function PromotionForm({
  presetType,
  presetScope,
  onClose,
}: {
  presetType: PromotionType
  presetScope: PromotionScope
  onClose: () => void
}) {
  const [step, setStep] = React.useState(0)
  const [form, setForm] = React.useState<FormState>(() => ({
    ...INITIAL,
    type: presetType,
    scope: presetScope,
  }))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const canProceed = step !== 0 || (form.name.trim() && form.code.trim())
  const isLast = step === STEPS.length - 1

  function handleGenerateCode() {
    const base = form.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
    set("code", base || "PROMO" + Math.floor(Math.random() * 900 + 100))
  }

  function handleSubmit() {
    toast.success("Promotion created", {
      description: `${form.code || "New promotion"} saved as ${form.status}.`,
    })
    onClose()
  }

  return (
    <>
      <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
          <SheetTitle className="font-display text-xl font-medium">
            Create Promotion
          </SheetTitle>
          <SheetDescription>
            A guided setup — general details, discount, who it applies to, and
            when it runs.
          </SheetDescription>

          {/* Stepper */}
          <ol className="mt-3 flex items-center gap-1.5">
            {STEPS.map((label, i) => {
              const done = i < step
              const current = i === step
              return (
                <li key={label} className="flex flex-1 items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-medium transition-colors",
                      done
                        ? "bg-foreground text-background"
                        : current
                          ? "bg-gold text-gold-foreground"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden truncate text-xs sm:block",
                      current ? "font-medium text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span className="h-px flex-1 bg-border" />
                  ) : null}
                </li>
              )
            })}
          </ol>
        </SheetHeader>

        <div className="h-[calc(100%-13.5rem)] overflow-y-auto p-4 sm:p-5">
          {step === 0 ? (
            <div className="space-y-4">
              <Field label="Promotion name" htmlFor="p-name">
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Wedding Season 2026"
                />
              </Field>
              <Field label="Coupon code" htmlFor="p-code">
                <div className="flex gap-2">
                  <Input
                    id="p-code"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value.toUpperCase())}
                    placeholder="WEDDING25"
                    className="font-mono uppercase"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleGenerateCode}>
                    <Sparkles className="size-4" /> Generate
                  </Button>
                </div>
              </Field>
              <Field label="Description" htmlFor="p-desc">
                <Textarea
                  id="p-desc"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Internal description of this campaign…"
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <Field label="Discount type">
                <Select value={form.type} onValueChange={(v) => set("type", v as PromotionType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {PROMOTION_TYPE_META[t].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {form.type === "percentage" || form.type === "bundle" ? (
                <Field label="Percentage off" htmlFor="p-value">
                  <Input
                    id="p-value"
                    type="number"
                    value={form.value}
                    onChange={(e) => set("value", e.target.value)}
                    placeholder="25"
                    className="tabular"
                  />
                </Field>
              ) : null}
              {form.type === "fixed" ? (
                <Field label="Amount off (PKR)" htmlFor="p-value">
                  <Input
                    id="p-value"
                    type="number"
                    value={form.value}
                    onChange={(e) => set("value", e.target.value)}
                    placeholder="5000"
                    className="tabular"
                  />
                </Field>
              ) : null}
              {form.type === "buy_x_get_y" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Buy quantity" htmlFor="p-buyx">
                    <Input
                      id="p-buyx"
                      type="number"
                      value={form.buyX}
                      onChange={(e) => set("buyX", e.target.value)}
                      className="tabular"
                    />
                  </Field>
                  <Field label="Get free" htmlFor="p-gety">
                    <Input
                      id="p-gety"
                      type="number"
                      value={form.getY}
                      onChange={(e) => set("getY", e.target.value)}
                      className="tabular"
                    />
                  </Field>
                </div>
              ) : null}
              {form.type === "free_shipping" ? (
                <p className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
                  Free shipping applies at checkout. Set a minimum order in the
                  next step to protect margins.
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <Field label="Applies to">
                <Select value={form.scope} onValueChange={(v) => set("scope", v as PromotionScope)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire_store">Entire store</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                    <SelectItem value="product">Specific products</SelectItem>
                    <SelectItem value="vip">VIP customers</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">VIP customers only</p>
                  <p className="text-xs text-muted-foreground">
                    Restrict redemption to VIP tiers.
                  </p>
                </div>
                <Switch checked={form.vipOnly} onCheckedChange={(v) => set("vipOnly", v)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Minimum order (PKR)" htmlFor="p-min">
                  <Input
                    id="p-min"
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => set("minOrder", e.target.value)}
                    placeholder="0"
                    className="tabular"
                  />
                </Field>
                <Field label="Max total uses" htmlFor="p-max">
                  <Input
                    id="p-max"
                    type="number"
                    value={form.maxUses}
                    onChange={(e) => set("maxUses", e.target.value)}
                    placeholder="Unlimited"
                    className="tabular"
                  />
                </Field>
              </div>
              <Field label="Per-customer limit" htmlFor="p-per">
                <Input
                  id="p-per"
                  type="number"
                  value={form.perCustomer}
                  onChange={(e) => set("perCustomer", e.target.value)}
                  className="tabular"
                />
              </Field>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date" htmlFor="p-start">
                  <Input
                    id="p-start"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                  />
                </Field>
                <Field label="End date" htmlFor="p-end">
                  <Input
                    id="p-end"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => set("endDate", e.target.value)}
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Auto-expire</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically deactivate after the end date.
                  </p>
                </div>
                <Switch checked={form.autoExpire} onCheckedChange={(v) => set("autoExpire", v)} />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <Select value={form.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as draft</SelectItem>
                      <SelectItem value="scheduled">Schedule</SelectItem>
                      <SelectItem value="active">Activate now</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Visibility">
                  <Select value={form.visibility} onValueChange={(v) => set("visibility", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public code</SelectItem>
                      <SelectItem value="hidden">Hidden / automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Live preview */}
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Preview
                </p>
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <DiscountBadge
                      promotion={{
                        type: form.type,
                        value: Number(form.value) || 0,
                        buyX: Number(form.buyX) || null,
                        getY: Number(form.getY) || null,
                      }}
                    />
                    <span className="font-mono text-xs font-medium tracking-wide">
                      {form.code || "CODE"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {form.name || "Untitled promotion"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {form.minOrder
                      ? `Min. order ${formatCurrency(Number(form.minOrder))}`
                      : "No minimum order"}
                    {form.vipOnly ? " · VIP only" : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <>
                <ArrowLeft className="size-4" /> Back
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular">
              Step {step + 1} of {STEPS.length}
            </span>
            {isLast ? (
              <Button size="sm" onClick={handleSubmit}>
                <Check className="size-4" /> Create promotion
              </Button>
            ) : (
              <Button size="sm" disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
    </>
  )
}
