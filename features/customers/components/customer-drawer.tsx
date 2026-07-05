"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Archive,
  BellRing,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Plus,
  Printer,
  Ruler,
  Scissors,
  Star,
} from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { ProductThumb } from "@/components/shared/product-thumb"
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
  CUSTOMER_FIT_META,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatRelative,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type {
  CustomerActivityType,
  CustomerDetail,
  MeasurementProfile,
} from "@/types"
import {
  CustomerStatusBadge,
  RelationshipChips,
  VIPBadge,
} from "@/features/customers/components/customer-badges"
import { CustomerTimeline } from "@/features/customers/components/customer-timeline"
import { MeasurementCard } from "@/features/orders/components/measurement-card"
import {
  OrderTypeBadge,
  StageBadge,
} from "@/features/orders/components/order-badges"

interface CustomerDrawerProps {
  customer: CustomerDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onArchive: (customer: CustomerDetail) => void
}

const ACTIVITY_DOT: Record<CustomerActivityType, string> = {
  registered: "bg-sky-500",
  order: "bg-foreground",
  measurement: "bg-gold",
  email: "bg-muted-foreground",
  whatsapp: "bg-emerald-500",
  status: "bg-amber-500",
  profile: "bg-muted-foreground",
  review: "bg-gold",
  vip: "bg-gold",
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="font-display text-lg leading-none font-medium tabular">{value}</p>
      <p className="mt-1 text-[0.7rem] tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium">{value}</span>
    </div>
  )
}

export function CustomerDrawer({
  customer,
  open,
  onOpenChange,
  onArchive,
}: CustomerDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        {customer ? (
          <CustomerDrawerBody customer={customer} onArchive={onArchive} />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function CustomerDrawerBody({
  customer,
  onArchive,
}: {
  customer: CustomerDetail
  onArchive: (customer: CustomerDetail) => void
}) {
  return (
    <>
      <SheetHeader className="gap-0 border-b p-0">
        {customer.vip ? <span className="h-1 bg-gold/70" /> : null}
        <div className="flex items-start gap-3 p-4 pr-14 sm:p-5 sm:pr-14">
          <EntityAvatar
            initials={customer.initials}
            seed={customer.id}
            className="size-14 text-base"
          />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="font-display text-xl leading-tight font-medium">
                {customer.name}
              </SheetTitle>
              {customer.vip ? <VIPBadge tier={customer.tier} /> : null}
              <CustomerStatusBadge status={customer.status} />
            </div>
            <SheetDescription className="text-xs">
              {customer.reference} · {customer.flag} {customer.city},{" "}
              {customer.country} · Client for {customer.yearsCustomer}{" "}
              {customer.yearsCustomer === 1 ? "year" : "years"}
            </SheetDescription>
            <RelationshipChips customer={customer} className="pt-0.5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-5">
          <Button size="sm" onClick={() => toast.success(`New order for ${customer.name}`)}>
            <Plus className="size-4" /> Create order
          </Button>
          {customer.tailoringClient || customer.hasMeasurements ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`Started custom order for ${customer.name}`)}
            >
              <Scissors className="size-4" /> Start custom
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`WhatsApp opened for ${customer.name}`)}
          >
            <MessageCircle className="size-4" /> WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`Email drafted to ${customer.name}`)}
          >
            <Mail className="size-4" /> Email
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => onArchive(customer)}
          >
            <Archive className="size-4" /> Archive
          </Button>
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-popover px-4 pt-3 sm:px-5">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="profile">Addresses</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-5 p-4 sm:p-5">
          {customer.followUp ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-dashed bg-amber-500/5 p-3">
              <BellRing className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium">Flagged for follow-up</p>
                <p className="text-xs text-muted-foreground">
                  This customer needs proactive outreach from the concierge team.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Lifetime" value={formatCompactCurrency(customer.lifetimeValue)} />
            <StatTile label="Orders" value={String(customer.ordersCount)} />
            <StatTile label="Avg order" value={formatCompactCurrency(customer.avgOrderValue)} />
            <StatTile
              label="Last order"
              value={customer.lastOrderAt ? formatRelative(customer.lastOrderAt) : "—"}
            />
          </div>

          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-3.5" /> Email
                </span>
                <a
                  href={`mailto:${customer.email}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {customer.email}
                </a>
              </div>
              <Row
                label={
                  <span className="flex items-center gap-2">
                    <MessageCircle className="size-3.5" /> Phone
                  </span>
                }
                value={<span className="tabular">{customer.phone}</span>}
              />
              <Row
                label={
                  <span className="flex items-center gap-2">
                    <MapPin className="size-3.5" /> Location
                  </span>
                }
                value={`${customer.city}, ${customer.country}`}
              />
              {customer.preferredTailor ? (
                <Row
                  label={
                    <span className="flex items-center gap-2">
                      <Scissors className="size-3.5" /> Preferred tailor
                    </span>
                  }
                  value={customer.preferredTailor}
                />
              ) : null}
            </div>
          </div>

          {customer.note ? (
            <div className="rounded-xl border bg-muted/20 p-3">
              <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Internal note
              </p>
              <p className="text-sm">{customer.note}</p>
            </div>
          ) : null}
        </TabsContent>

        {/* ── Orders ───────────────────────────────────────────────── */}
        <TabsContent value="orders" className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {customer.ordersCount} orders ·{" "}
              {formatCurrency(customer.lifetimeValue)} lifetime
            </p>
            <Button variant="outline" size="xs">
              All orders
            </Button>
          </div>
          {customer.orderHistory.map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-foreground/15"
            >
              <ProductThumb
                seed={o.image}
                name={o.itemName}
                className="size-12"
                iconClassName="size-5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{o.itemName}</p>
                <p className="text-xs text-muted-foreground tabular">
                  {o.reference} · {formatDate(o.date)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium tabular">
                  {formatCurrency(o.total)}
                </span>
                <div className="flex items-center gap-1">
                  <OrderTypeBadge type={o.type} />
                  <StageBadge stage={o.stage} />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ── Measurements ─────────────────────────────────────────── */}
        <TabsContent value="measurements" className="space-y-4 p-4 sm:p-5">
          {customer.measurementProfiles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
              <span className="flex size-11 items-center justify-center rounded-xl border border-dashed bg-muted/40 text-muted-foreground">
                <Ruler className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-medium">No measurement profiles</p>
                <p className="mx-auto max-w-xs text-xs text-muted-foreground">
                  Capture measurements to unlock made-to-measure and bespoke
                  orders for this client.
                </p>
              </div>
              <Button size="sm" onClick={() => toast.success("New measurement profile")}>
                <Plus className="size-4" /> Add profile
              </Button>
            </div>
          ) : (
            customer.measurementProfiles.map((profile) => (
              <MeasurementProfileCard key={profile.id} profile={profile} />
            ))
          )}
        </TabsContent>

        {/* ── Addresses & Preferences ──────────────────────────────── */}
        <TabsContent value="profile" className="space-y-5 p-4 sm:p-5">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Addresses
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {customer.addresses.map((a) => (
                <div key={a.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{a.label}</span>
                    {a.isDefault ? (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">
                        Default {a.type}
                      </span>
                    ) : (
                      <span className="text-[0.7rem] text-muted-foreground capitalize">
                        {a.type}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.line}
                    <br />
                    {a.flag} {a.city}, {a.country}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Palette className="size-3.5" /> Preferences
            </p>
            <div className="rounded-xl border px-4">
              <div className="divide-y">
                <Row label="Preferred fabric" value={customer.preferences.fabric} />
                <Row label="Preferred colour" value={customer.preferences.color} />
                <Row
                  label="Preferred fit"
                  value={CUSTOMER_FIT_META[customer.preferences.fit].label}
                />
                <Row label="Favourite tailor" value={customer.preferences.tailor ?? "—"} />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[...customer.preferences.categories, ...customer.preferences.collections].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <TabsContent value="timeline" className="p-4 sm:p-5">
          <CustomerTimeline milestones={customer.timeline} />
        </TabsContent>

        {/* ── Activity ─────────────────────────────────────────────── */}
        <TabsContent value="activity" className="p-4 sm:p-5">
          <ol className="space-y-4">
            {customer.activity.map((event) => (
              <li key={event.id} className="flex gap-3">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-popover",
                    ACTIVITY_DOT[event.type]
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground tabular">
                    {event.meta} ·{" "}
                    {new Date(event.at).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </>
  )
}

function MeasurementProfileCard({ profile }: { profile: MeasurementProfile }) {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Star className="size-4 text-gold" />
          <p className="text-sm font-medium">{profile.name}</p>
          <span className="rounded-md border px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">
            {CUSTOMER_FIT_META[profile.fit].label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Updated {formatRelative(profile.updatedAt)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Print measurements"
            onClick={() => toast.success("Measurements sent to printer")}
          >
            <Printer className="size-4" />
          </Button>
        </div>
      </div>
      <Separator />
      <MeasurementCard measurements={profile.measurements} />
    </div>
  )
}
