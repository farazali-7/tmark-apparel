"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  Copy,
  Crown,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Printer,
  Scissors,
  Truck,
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
  ORDER_PIPELINE,
  ORDER_STAGE_META,
  ORDER_TYPE_META,
  formatCurrency,
  formatDate,
  formatDeadline,
  stageIndex,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { OrderDetail, OrderStage } from "@/types"
import {
  OrderTypeBadge,
  PaymentBadge,
  PriorityBadge,
  ShippingBadge,
  StageBadge,
} from "@/features/orders/components/order-badges"
import { MeasurementCard } from "@/features/orders/components/measurement-card"
import { ProductionTimeline } from "@/features/orders/components/production-timeline"

interface OrderDrawerProps {
  order: OrderDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: (order: OrderDetail) => void
}

function nextStage(stage: OrderStage): OrderStage | null {
  const idx = stageIndex(stage)
  if (idx < 0 || idx >= ORDER_PIPELINE.length - 1) return null
  return ORDER_PIPELINE[idx + 1]
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium">{value}</span>
    </div>
  )
}

const CHECKLIST: { label: string; reachedAt: OrderStage }[] = [
  { label: "Measurements approved", reachedAt: "measurements" },
  { label: "Fabric sourced & cut", reachedAt: "fabric" },
  { label: "Tailoring complete", reachedAt: "tailoring" },
  { label: "Quality check passed", reachedAt: "quality_check" },
  { label: "Pressed & packed", reachedAt: "packed" },
]

export function OrderDrawer({
  order,
  open,
  onOpenChange,
  onCancel,
}: OrderDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        {order ? <OrderDrawerBody order={order} onCancel={onCancel} /> : null}
      </SheetContent>
    </Sheet>
  )
}

function OrderDrawerBody({
  order,
  onCancel,
}: {
  order: OrderDetail
  onCancel: (order: OrderDetail) => void
}) {
  const next = nextStage(order.stage)
  const isTerminal =
    order.stage === "cancelled" ||
    order.stage === "refunded" ||
    order.stage === "refund_requested"
  const bespoke = ORDER_TYPE_META[order.type].bespoke
  const balance = order.payment.total - order.payment.paid
  const deadline = formatDeadline(order.deliveryDeadline)

  return (
    <>
      <SheetHeader className="gap-0 border-b p-0">
        <div className="flex items-start justify-between gap-3 p-4 pr-14 sm:p-5 sm:pr-14">
          <div className="min-w-0 space-y-1.5">
            <SheetTitle className="font-display text-xl leading-tight font-medium">
              {order.reference}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Placed {formatDate(order.createdAt)} · {order.itemCount} item
              {order.itemCount === 1 ? "" : "s"}
            </SheetDescription>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <StageBadge stage={order.stage} />
              <OrderTypeBadge type={order.type} />
              <PaymentBadge status={order.payment.status} />
              {order.priority !== "standard" ? (
                <PriorityBadge priority={order.priority} />
              ) : null}
            </div>
          </div>
        </div>

        {/* Quick actions — the operational verbs, always one tap away */}
        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-5">
          {order.stage === "pending" ? (
            <Button size="sm" onClick={() => toast.success(`${order.reference} confirmed`)}>
              <CheckCircle2 className="size-4" /> Confirm order
            </Button>
          ) : next && !isTerminal ? (
            <Button
              size="sm"
              onClick={() =>
                toast.success(`Advanced to ${ORDER_STAGE_META[next].label}`)
              }
            >
              <ArrowRight className="size-4" /> Advance to {ORDER_STAGE_META[next].label}
            </Button>
          ) : null}

          {(order.stage === "ready" || order.stage === "packed") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`${order.reference} marked as shipped`)}
            >
              <Truck className="size-4" /> Ship
            </Button>
          )}
          {bespoke && !isTerminal ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`Assign tailor to ${order.reference}`)}
            >
              <Scissors className="size-4" /> Assign tailor
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Invoice sent to printer")}
          >
            <Printer className="size-4" /> Invoice
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`WhatsApp opened for ${order.customer.name}`)}
          >
            <MessageCircle className="size-4" /> WhatsApp
          </Button>
          {!isTerminal ? (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => onCancel(order)}
            >
              <Ban className="size-4" /> Cancel
            </Button>
          ) : null}
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-popover px-4 pt-3 sm:px-5">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            {bespoke ? (
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            ) : null}
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Overview ─────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-5 p-4 sm:p-5">
          {/* Customer */}
          <div className="rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <EntityAvatar
                initials={order.customer.initials}
                seed={order.customer.id}
                className="size-11"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-medium">{order.customer.name}</p>
                  <span title={order.customer.country}>{order.customer.flag}</span>
                  {order.customer.vip ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-muted/50 px-1.5 py-0.5 text-[0.65rem] font-medium text-[color-mix(in_oklch,var(--gold),black_25%)] dark:text-gold">
                      <Crown className="size-2.5" /> VIP
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.customer.ordersCount} orders ·{" "}
                  {formatCurrency(order.customer.lifetimeValue)} lifetime
                </p>
              </div>
              <Button variant="outline" size="xs">
                <ExternalLink className="size-3" /> Profile
              </Button>
            </div>
            <Separator className="my-3" />
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={`mailto:${order.customer.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{order.customer.email}</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="size-3.5 shrink-0" />
                <span className="tabular">{order.customer.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{order.shipment.address}</span>
              </div>
            </div>
          </div>

          {/* Invoice summary */}
          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row label="Subtotal" value={formatCurrency(order.payment.subtotal)} />
              <Row
                label="Shipping"
                value={
                  order.payment.shipping > 0
                    ? formatCurrency(order.payment.shipping)
                    : "Free"
                }
              />
              {order.payment.discount > 0 ? (
                <Row
                  label="Discount"
                  value={`− ${formatCurrency(order.payment.discount)}`}
                />
              ) : null}
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm font-medium">Total</span>
                <span className="font-display text-lg font-medium tabular">
                  {formatCurrency(order.payment.total)}
                </span>
              </div>
              {balance > 0 ? (
                <Row
                  label="Balance due"
                  value={
                    <span className="text-amber-600 dark:text-amber-400">
                      {formatCurrency(balance)}
                    </span>
                  }
                />
              ) : null}
            </div>
          </div>

          {/* Shipping + fulfilment */}
          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row
                label="Shipping status"
                value={<ShippingBadge status={order.shipment.status} />}
              />
              <Row label="Courier" value={order.shipment.courier} />
              <Row
                label="Tracking"
                value={
                  order.shipment.trackingNumber ? (
                    <span className="tabular">{order.shipment.trackingNumber}</span>
                  ) : (
                    <span className="text-muted-foreground/60">Not assigned</span>
                  )
                }
              />
              <Row
                label="Est. delivery"
                value={
                  order.shipment.estimatedDelivery
                    ? formatDate(order.shipment.estimatedDelivery)
                    : "—"
                }
              />
              {order.assignedTailor ? (
                <Row label="Assigned tailor" value={order.assignedTailor} />
              ) : null}
              {deadline ? (
                <Row
                  label="Deadline"
                  value={
                    <span
                      className={cn(
                        deadline.overdue
                          ? "text-rose-600 dark:text-rose-400"
                          : deadline.soon
                            ? "text-amber-600 dark:text-amber-400"
                            : undefined
                      )}
                    >
                      {order.deliveryDeadline
                        ? formatDate(order.deliveryDeadline)
                        : ""}{" "}
                      · {deadline.label}
                    </span>
                  }
                />
              ) : null}
            </div>
          </div>

          {/* Notes */}
          {(order.customerNote || order.internalNote) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {order.customerNote ? (
                <div className="rounded-xl border bg-muted/20 p-3">
                  <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Customer note
                  </p>
                  <p className="text-sm">{order.customerNote}</p>
                </div>
              ) : null}
              {order.internalNote ? (
                <div className="rounded-xl border border-dashed bg-amber-500/5 p-3">
                  <p className="mb-1 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
                    Internal note
                  </p>
                  <p className="text-sm">{order.internalNote}</p>
                </div>
              ) : null}
            </div>
          )}
        </TabsContent>

        {/* ── Products ─────────────────────────────────────────────── */}
        <TabsContent value="products" className="space-y-3 p-4 sm:p-5">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-xl border p-3 transition-colors hover:border-foreground/15"
            >
              <ProductThumb
                seed={item.image}
                name={item.name}
                className="size-16 sm:size-20"
                iconClassName="size-6"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <OrderTypeBadge type={item.type} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.fabric ? (
                    <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
                      {item.fabric}
                    </span>
                  ) : null}
                  <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
                    {item.color}
                  </span>
                  <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
                    Size {item.size}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="text-xs text-muted-foreground tabular">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                  <span className="font-medium tabular">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ── Measurements (bespoke only) ──────────────────────────── */}
        {bespoke ? (
          <TabsContent value="measurements" className="space-y-5 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Assigned tailor</p>
                <p className="mt-0.5 text-sm font-medium">
                  {order.assignedTailor ?? "Unassigned"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Event date</p>
                <p className="mt-0.5 text-sm font-medium">
                  {order.eventDate ? formatDate(order.eventDate) : "—"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="mt-0.5 text-sm font-medium">
                  {order.deliveryDeadline ? formatDate(order.deliveryDeadline) : "—"}
                </p>
              </div>
            </div>

            {order.measurements ? (
              <MeasurementCard measurements={order.measurements} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Measurements not yet captured.
              </p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Quality checklist
              </p>
              <ul className="space-y-1.5">
                {CHECKLIST.map((c) => {
                  const done = stageIndex(order.stage) > stageIndex(c.reachedAt)
                  return (
                    <li key={c.label} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full border",
                          done
                            ? "border-transparent bg-emerald-600 text-white"
                            : "border-dashed"
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="size-3" strokeWidth={3} />
                        ) : null}
                      </span>
                      <span className={cn(!done && "text-muted-foreground")}>
                        {c.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </TabsContent>
        ) : null}

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <TabsContent value="timeline" className="p-4 sm:p-5">
          <ProductionTimeline steps={order.timeline} />
        </TabsContent>

        {/* ── Payment ──────────────────────────────────────────────── */}
        <TabsContent value="payment" className="space-y-5 p-4 sm:p-5">
          <div className="rounded-xl border px-4">
            <div className="divide-y">
              <Row label="Method" value={order.payment.method} />
              <Row label="Status" value={<PaymentBadge status={order.payment.status} />} />
              <Row
                label="Transaction ID"
                value={<span className="tabular">{order.payment.transactionId}</span>}
              />
              <Row label="Amount paid" value={formatCurrency(order.payment.paid)} />
              {balance > 0 ? (
                <Row
                  label="Balance due"
                  value={
                    <span className="text-amber-600 dark:text-amber-400">
                      {formatCurrency(balance)}
                    </span>
                  }
                />
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Invoice downloaded")}
            >
              <Printer className="size-4" /> Download invoice
            </Button>
            {order.payment.status !== "refunded" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => toast(`Refund initiated for ${order.reference}`)}
              >
                <Copy className="size-4" /> Issue refund
              </Button>
            ) : null}
          </div>
        </TabsContent>

        {/* ── Activity ─────────────────────────────────────────────── */}
        <TabsContent value="activity" className="p-4 sm:p-5">
          <ol className="space-y-4">
            {order.activity.map((event) => (
              <li key={event.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border ring-4 ring-popover" />
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{event.actor}</span> {event.action}
                  </p>
                  <p className="text-xs text-muted-foreground tabular">
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
