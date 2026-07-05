import type {
  CategoryStatus,
  CollectionStatus,
  CustomerFit,
  CustomerStatus,
  CustomerTier,
  OrderPriority,
  OrderStage,
  OrderStatus,
  OrderType,
  PaymentState,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  ShippingState,
  Visibility,
} from "@/types"
import type { LucideIcon } from "lucide-react"
import {
  Ban,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Truck as CourierTruck,
  Layers as FabricIcon,
  PackageCheck,
  PackageOpen,
  Ruler,
  ScanLine,
  Scissors,
  ShieldCheck,
  Sparkles as SparklesIcon,
  Undo2,
} from "lucide-react"

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "gold"

export interface StatusMeta {
  label: string
  tone: StatusTone
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  tailoring: { label: "Tailoring", tone: "gold" },
  ready: { label: "Ready", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
}

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  paid: { label: "Paid", tone: "success" },
  unpaid: { label: "Unpaid", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
}

export const PRODUCT_STATUS_META: Record<ProductStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  archived: { label: "Archived", tone: "danger" },
}

export const REVIEW_STATUS_META: Record<ReviewStatus, StatusMeta> = {
  approved: { label: "Approved", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
}

export const CATEGORY_STATUS_META: Record<CategoryStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
}

export const VISIBILITY_META: Record<Visibility, StatusMeta> = {
  visible: { label: "Visible", tone: "info" },
  hidden: { label: "Hidden", tone: "warning" },
}

export const COLLECTION_STATUS_META: Record<CollectionStatus, StatusMeta> = {
  published: { label: "Published", tone: "success" },
  scheduled: { label: "Scheduled", tone: "gold" },
  draft: { label: "Draft", tone: "neutral" },
  archived: { label: "Archived", tone: "danger" },
}

/* ── Orders ──────────────────────────────────────────────────────────────
 * Single source of truth for stage vocabulary, ordering, icons and tones.
 * Every order badge, the pipeline and the timeline read from these maps so
 * they can never drift apart.
 * ─────────────────────────────────────────────────────────────────────── */

export interface StageMeta extends StatusMeta {
  /** Compact label for the dense pipeline rail. */
  short: string
  icon: LucideIcon
}

export const ORDER_STAGE_META: Record<OrderStage, StageMeta> = {
  pending: { label: "Pending", short: "Pending", tone: "warning", icon: Clock },
  confirmed: { label: "Confirmed", short: "Confirmed", tone: "info", icon: CheckCircle2 },
  measurements: { label: "Measurements", short: "Measured", tone: "info", icon: Ruler },
  fabric: { label: "Fabric Selection", short: "Fabric", tone: "gold", icon: FabricIcon },
  tailoring: { label: "Tailoring", short: "Tailoring", tone: "gold", icon: Scissors },
  quality_check: { label: "Quality Check", short: "QC", tone: "info", icon: ShieldCheck },
  ready: { label: "Ready", short: "Ready", tone: "info", icon: ClipboardCheck },
  packed: { label: "Packed", short: "Packed", tone: "info", icon: PackageOpen },
  shipped: { label: "Shipped", short: "Shipped", tone: "info", icon: CourierTruck },
  delivered: { label: "Delivered", short: "Delivered", tone: "success", icon: PackageCheck },
  cancelled: { label: "Cancelled", short: "Cancelled", tone: "danger", icon: Ban },
  refund_requested: { label: "Refund Requested", short: "Refund", tone: "warning", icon: Undo2 },
  refunded: { label: "Refunded", short: "Refunded", tone: "neutral", icon: Undo2 },
}

/** The ten happy-path stages, in production order, used by the pipeline & timeline. */
export const ORDER_PIPELINE: OrderStage[] = [
  "pending",
  "confirmed",
  "measurements",
  "fabric",
  "tailoring",
  "quality_check",
  "ready",
  "packed",
  "shipped",
  "delivered",
]

export const ORDER_TERMINAL_STAGES: OrderStage[] = [
  "cancelled",
  "refund_requested",
  "refunded",
]

export function stageIndex(stage: OrderStage): number {
  return ORDER_PIPELINE.indexOf(stage)
}

export interface OrderTypeMeta {
  label: string
  short: string
  tone: StatusTone
  icon: LucideIcon
  /** Whether this order type carries measurements & a tailoring workflow. */
  bespoke: boolean
}

export const ORDER_TYPE_META: Record<OrderType, OrderTypeMeta> = {
  ready_to_wear: { label: "Ready to Wear", short: "RTW", tone: "neutral", icon: ScanLine, bespoke: false },
  made_to_measure: { label: "Made to Measure", short: "MTM", tone: "info", icon: Ruler, bespoke: true },
  custom_tailoring: { label: "Custom Tailoring", short: "Bespoke", tone: "gold", icon: SparklesIcon, bespoke: true },
}

export const PAYMENT_STATE_META: Record<PaymentState, StatusMeta> = {
  paid: { label: "Paid", tone: "success" },
  partially_paid: { label: "Partially Paid", tone: "warning" },
  unpaid: { label: "Unpaid", tone: "danger" },
  refund_requested: { label: "Refund Requested", tone: "warning" },
  refunded: { label: "Refunded", tone: "neutral" },
}

export const SHIPPING_STATE_META: Record<ShippingState, StatusMeta> = {
  not_shipped: { label: "Not Shipped", tone: "neutral" },
  processing: { label: "Processing", tone: "info" },
  in_transit: { label: "In Transit", tone: "info" },
  out_for_delivery: { label: "Out for Delivery", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  returned: { label: "Returned", tone: "danger" },
}

export interface PriorityMeta {
  label: string
  tone: StatusTone
}

export const PRIORITY_META: Record<OrderPriority, PriorityMeta> = {
  standard: { label: "Standard", tone: "neutral" },
  high: { label: "High", tone: "warning" },
  urgent: { label: "Urgent", tone: "danger" },
}

/* ── Customers ───────────────────────────────────────────────────────── */

export const CUSTOMER_STATUS_META: Record<CustomerStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "warning" },
  archived: { label: "Archived", tone: "neutral" },
}

export interface CustomerTierMeta {
  label: string
  tone: StatusTone
}

export const CUSTOMER_TIER_META: Record<CustomerTier, CustomerTierMeta> = {
  member: { label: "Member", tone: "neutral" },
  gold: { label: "Gold", tone: "gold" },
  platinum: { label: "Platinum", tone: "gold" },
}

export const CUSTOMER_FIT_META: Record<CustomerFit, { label: string }> = {
  regular: { label: "Regular Fit" },
  slim: { label: "Slim Fit" },
  classic: { label: "Classic Fit" },
  wedding: { label: "Wedding Fit" },
}

/** Compact currency for large lifetime-value figures — e.g. "PKR 1.2M". */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000)
    return `PKR ${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  if (value >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`
  return formatCurrency(value)
}

export const TAILORS = [
  "Master Yousuf",
  "Master Iqbal",
  "Master Rehman",
  "Master Nadeem",
  "Atelier Team",
] as const

export const COURIERS = ["TCS", "Leopards", "DHL Express", "FedEx", "M&P"] as const

/** Short, human deadline pressure — e.g. "in 3 days", "2 days overdue". */
export function formatDeadline(iso: string | null): {
  label: string
  overdue: boolean
  soon: boolean
} | null {
  if (!iso) return null
  const diffMs = new Date(iso).getTime() - Date.now()
  const days = Math.round(diffMs / 86_400_000)
  if (days < 0)
    return { label: `${Math.abs(days)}d overdue`, overdue: true, soon: false }
  if (days === 0) return { label: "Due today", overdue: false, soon: true }
  if (days === 1) return { label: "Due tomorrow", overdue: false, soon: true }
  return { label: `Due in ${days}d`, overdue: false, soon: days <= 5 }
}

export const SEASONS = [
  "Wedding",
  "Festive",
  "Winter 2026",
  "Summer 2026",
  "Evergreen",
  "Limited Edition",
] as const

export const CATEGORIES = [
  "Sherwanis",
  "Waistcoats",
  "Prince Coats",
  "Western Suits",
  "Shalwar Kameez",
  "Kurtas",
] as const

export const COLLECTIONS = [
  "Wedding Collection",
  "Eid Collection",
  "Summer Collection",
  "Best Sellers",
  "New Arrivals",
] as const

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const

export const COLORS = [
  "Ivory",
  "Charcoal",
  "Navy",
  "Maroon",
  "Black",
  "Sand",
  "Emerald",
] as const

export const FABRICS = [
  "Wool Blend",
  "Raw Silk",
  "Velvet",
  "Egyptian Cotton",
  "Linen",
  "Jamawar",
] as const

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace("PKR", "PKR ")
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}
