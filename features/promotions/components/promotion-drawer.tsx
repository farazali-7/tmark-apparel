"use client"

import * as React from "react"
import { toast } from "sonner"
import { Copy, Crown, Pause, Pencil, Play, Trash2 } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
import { Sparkline } from "@/components/shared/sparkline"
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
import {
  PROMOTION_SCOPE_META,
  PROMOTION_TYPE_META,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/constants"
import type { Promotion } from "@/types"
import {
  CountdownBadge,
  CouponCode,
  DiscountBadge,
  PromotionStatusBadge,
} from "@/features/promotions/components/promotion-badges"
import { PromotionTimeline } from "@/features/promotions/components/promotion-timeline"
import { UsageProgress } from "@/features/promotions/components/usage-progress"

interface PromotionDrawerProps {
  promotion: Promotion | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium">{value}</span>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="font-display text-xl leading-none font-medium tabular">{value}</p>
      <p className="mt-1 text-[0.7rem] tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="rounded-md border px-2 py-0.5 text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function PromotionDrawer({
  promotion,
  open,
  onOpenChange,
  onDelete,
  onToggleStatus,
}: PromotionDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        {promotion ? (
          <PromotionDrawerBody
            key={promotion.id}
            promotion={promotion}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function PromotionDrawerBody({
  promotion,
  onDelete,
  onToggleStatus,
}: {
  promotion: Promotion
  onDelete: (promotion: Promotion) => void
  onToggleStatus: (promotion: Promotion) => void
}) {
  const p = promotion
  const typeMeta = PROMOTION_TYPE_META[p.type]
  const scopeMeta = PROMOTION_SCOPE_META[p.scope]
  const isActive = p.status === "active"
  const canActivate = p.status === "paused" || p.status === "draft" || p.status === "scheduled"
  const positive = p.redemptionTrend.at(-1)!.value >= p.redemptionTrend[0].value

  return (
    <>
      <SheetHeader className="gap-0 border-b p-0">
        {p.featured ? <span className="h-1 bg-gold/70" /> : null}
        <div className="flex items-start justify-between gap-3 p-4 pr-14 sm:p-5 sm:pr-14">
          <div className="min-w-0 space-y-2">
            <SheetTitle className="font-display text-xl leading-tight font-medium">
              {p.name}
            </SheetTitle>
            <div className="flex flex-wrap items-center gap-1.5">
              <DiscountBadge promotion={p} />
              <PromotionStatusBadge status={p.status} />
              <CountdownBadge startDate={p.startDate} endDate={p.endDate} status={p.status} />
            </div>
            <SheetDescription className="flex items-center gap-2 text-xs">
              <CouponCode code={p.code} /> · {typeMeta.label} · {scopeMeta.label}
            </SheetDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-5">
          {isActive ? (
            <Button size="sm" variant="outline" onClick={() => onToggleStatus(p)}>
              <Pause className="size-4" /> Pause
            </Button>
          ) : canActivate ? (
            <Button size="sm" onClick={() => onToggleStatus(p)}>
              <Play className="size-4" /> Activate
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={() => toast.success(`Editing ${p.code}`)}>
            <Pencil className="size-4" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`Duplicated ${p.code}`)}
          >
            <Copy className="size-4" /> Duplicate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => onDelete(p)}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-popover px-4 pt-3 sm:px-5">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-5 p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">{p.description}</p>

          <div className="rounded-xl border bg-muted/20 p-4">
            <UsageProgress used={p.usedCount} cap={p.maxUses} />
          </div>

          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row label="Discount type" value={typeMeta.label} />
              <Row
                label="Value"
                value={
                  p.type === "percentage"
                    ? `${p.value}%`
                    : p.type === "fixed"
                      ? formatCurrency(p.value)
                      : p.type === "free_shipping"
                        ? "Free shipping"
                        : `Buy ${p.buyX} get ${p.getY ?? p.value + "%"}`
                }
              />
              <Row label="Applies to" value={p.scopeLabel} />
              <Row
                label="Minimum order"
                value={p.minOrder ? formatCurrency(p.minOrder) : "None"}
              />
              <Row
                label="Usage limit"
                value={p.maxUses ? `${formatNumber(p.maxUses)} total` : "Unlimited"}
              />
              <Row
                label="Per customer"
                value={p.perCustomerLimit ? `${p.perCustomerLimit}×` : "Unlimited"}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Eligibility ──────────────────────────────────────────── */}
        <TabsContent value="eligibility" className="space-y-4 p-4 sm:p-5">
          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row
                label="Scope"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <scopeMeta.icon className="size-3.5" />
                    {scopeMeta.label}
                  </span>
                }
              />
              <Row
                label="VIP only"
                value={
                  p.vipOnly ? (
                    <span className="inline-flex items-center gap-1 text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold">
                      <Crown className="size-3.5" /> Yes
                    </span>
                  ) : (
                    "No"
                  )
                }
              />
              <Row
                label="Minimum order"
                value={p.minOrder ? formatCurrency(p.minOrder) : "None"}
              />
              <Row
                label="Max uses"
                value={p.maxUses ? formatNumber(p.maxUses) : "Unlimited"}
              />
            </div>
          </div>
          <TagList label="Categories" items={p.eligibility.categories} />
          <TagList label="Collections" items={p.eligibility.collections} />
          <TagList label="Products" items={p.eligibility.products} />
          <TagList label="Customer groups" items={p.eligibility.customerGroups} />
        </TabsContent>

        {/* ── Analytics ────────────────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-5 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="Times used" value={formatNumber(p.usedCount)} />
            <StatTile label="Revenue" value={formatCompactCurrency(p.revenue)} />
            <StatTile
              label="Avg order"
              value={p.avgOrderValue ? formatCompactCurrency(p.avgOrderValue) : "—"}
            />
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Redemption trend
              </p>
              <span className="text-xs text-muted-foreground">Last 7 periods</span>
            </div>
            <Sparkline data={p.redemptionTrend} positive={positive} className="mt-3 h-16 w-full" />
          </div>

          {p.topProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Top products
              </p>
              <ul className="divide-y">
                {p.topProducts.map((tp) => (
                  <li key={tp.name} className="flex items-center gap-3 py-2 first:pt-0">
                    <ProductThumb seed={tp.image} name={tp.name} className="size-9" iconClassName="size-4" />
                    <span className="min-w-0 flex-1 truncate text-sm">{tp.name}</span>
                    <span className="text-sm font-medium tabular">{formatNumber(tp.uses)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {p.topCustomers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Top customers
              </p>
              <ul className="divide-y">
                {p.topCustomers.map((tc) => (
                  <li key={tc.name} className="flex items-center gap-3 py-2 first:pt-0">
                    <EntityAvatar initials={tc.initials} seed={tc.name} className="size-8" />
                    <span className="min-w-0 flex-1 truncate text-sm">{tc.name}</span>
                    <span className="text-sm font-medium tabular">
                      {formatCompactCurrency(tc.spend)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </TabsContent>

        {/* ── Publishing ───────────────────────────────────────────── */}
        <TabsContent value="publishing" className="space-y-4 p-4 sm:p-5">
          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row label="Status" value={<PromotionStatusBadge status={p.status} />} />
              <Row label="Start date" value={formatDate(p.startDate)} />
              <Row label="End date" value={p.endDate ? formatDate(p.endDate) : "No expiry"} />
              <Row label="Auto-expire" value={p.autoExpire ? "On" : "Off"} />
              <Row
                label="Visibility"
                value={p.visibility === "public" ? "Public code" : "Hidden / automatic"}
              />
              <Row label="Featured" value={p.featured ? "Yes" : "No"} />
            </div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Created {formatDate(p.createdAt)} · Last updated {formatDate(p.updatedAt)}
          </p>
        </TabsContent>

        {/* ── Activity ─────────────────────────────────────────────── */}
        <TabsContent value="activity" className="p-4 sm:p-5">
          <PromotionTimeline activity={p.activity} />
        </TabsContent>
      </Tabs>
    </>
  )
}
