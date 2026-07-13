import type {
  BannerPriority,
  BannerStatus,
  BannerType,
  CategoryStatus,
  CollectionStatus,
  CollectionType,
  CustomerFit,
  CustomerStatus,
  CustomerTier,
  FitFeedback,
  HomepageSectionType,
  OrderPriority,
  OrderStage,
  OrderStatus,
  OrderType,
  PaymentState,
  PaymentStatus,
  ProductStatus,
  PromotionScope,
  PromotionStatus,
  PromotionType,
  ReviewModerationStatus,
  ReviewStatus,
  ShippingState,
  SmartRule,
  SmartRuleField,
  SmartRuleOperator,
  Visibility,
} from "@/types"
import type { LucideIcon } from "lucide-react"
import {
  Ban,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Truck as CourierTruck,
  Crown as CrownIcon,
  FolderTree,
  Gift,
  Camera,
  Grid2x2,
  Hand,
  Image as ImageIcon,
  Layers as FabricIcon,
  LayoutTemplate,
  Mail,
  Megaphone,
  MessageSquareQuote,
  Package,
  PackageCheck,
  PackageOpen,
  PanelBottom,
  Percent,
  Ruler,
  ScanLine,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles as SparklesIcon,
  Store,
  Tag,
  Truck,
  Undo2,
  Zap,
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

/* ── Collections ─────────────────────────────────────────────────────────
 * Manual vs smart is the load-bearing business distinction: manual campaigns
 * are curated by a person, smart ones maintain themselves from rules. The
 * rule vocabulary below is the single source for the builder, the table and
 * the details drawer.
 * ─────────────────────────────────────────────────────────────────────── */

export interface CollectionTypeMeta {
  label: string
  tone: StatusTone
  icon: LucideIcon
  description: string
}

export const COLLECTION_TYPE_META: Record<CollectionType, CollectionTypeMeta> = {
  manual: {
    label: "Manual",
    tone: "neutral",
    icon: Hand,
    description: "You pick and order every product yourself.",
  },
  smart: {
    label: "Smart",
    tone: "info",
    icon: Zap,
    description: "Products join automatically when they match your rules.",
  },
}

export interface SmartRuleFieldMeta {
  label: string
  /** Operators that make sense for this field, in display order. */
  operators: SmartRuleOperator[]
  /** Which control the rule builder renders for the value. */
  input: "category" | "fabric" | "text" | "number"
  unit?: string
}

export const SMART_RULE_FIELD_META: Record<SmartRuleField, SmartRuleFieldMeta> = {
  category: { label: "Category", operators: ["is", "is_not"], input: "category" },
  fabric: { label: "Fabric", operators: ["is", "is_not"], input: "fabric" },
  tag: { label: "Product tag", operators: ["is", "is_not"], input: "text" },
  price: {
    label: "Price",
    operators: ["greater_than", "less_than"],
    input: "number",
    unit: "PKR",
  },
  days_since_added: {
    label: "Days since added",
    operators: ["less_than", "greater_than"],
    input: "number",
    unit: "days",
  },
}

export const SMART_RULE_OPERATOR_META: Record<SmartRuleOperator, { label: string }> = {
  is: { label: "is" },
  is_not: { label: "is not" },
  greater_than: { label: "is greater than" },
  less_than: { label: "is less than" },
}

/** One-line human reading of a rule, e.g. "Price is greater than PKR 150,000". */
export function formatSmartRule(rule: SmartRule): string {
  if (rule.field === "price") {
    return `Price ${SMART_RULE_OPERATOR_META[rule.operator].label} ${formatCurrency(
      Number(rule.value) || 0
    )}`
  }
  if (rule.field === "days_since_added") {
    return rule.operator === "less_than"
      ? `Added within the last ${rule.value} days`
      : `Added more than ${rule.value} days ago`
  }
  return `${SMART_RULE_FIELD_META[rule.field].label} ${
    SMART_RULE_OPERATOR_META[rule.operator].label
  } “${rule.value}”`
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

/* ── Banners ─────────────────────────────────────────────────────────── */

export const BANNER_STATUS_META: Record<BannerStatus, StatusMeta> = {
  published: { label: "Published", tone: "success" },
  scheduled: { label: "Scheduled", tone: "gold" },
  draft: { label: "Draft", tone: "neutral" },
  expired: { label: "Expired", tone: "neutral" },
  archived: { label: "Archived", tone: "warning" },
}

export interface BannerTypeMeta {
  label: string
  icon: LucideIcon
}

export const BANNER_TYPE_META: Record<BannerType, BannerTypeMeta> = {
  homepage: { label: "Homepage", icon: LayoutTemplate },
  category: { label: "Category", icon: FolderTree },
  collection: { label: "Collection", icon: SparklesIcon },
  popup: { label: "Popup", icon: ImageIcon },
  announcement: { label: "Announcement", icon: Megaphone },
}

export const BANNER_PRIORITY_META: Record<BannerPriority, { label: string; tone: StatusTone }> = {
  high: { label: "High", tone: "danger" },
  medium: { label: "Medium", tone: "warning" },
  low: { label: "Low", tone: "neutral" },
}

/* ── Homepage Builder ────────────────────────────────────────────────── */

export interface SectionMeta {
  label: string
  description: string
  icon: LucideIcon
}

export const SECTION_META: Record<HomepageSectionType, SectionMeta> = {
  hero: { label: "Hero Banner", description: "Full-width opening statement", icon: ImageIcon },
  featured_categories: { label: "Featured Categories", description: "Shop-by-category grid", icon: Grid2x2 },
  featured_collections: { label: "Featured Collections", description: "Merchandising campaigns", icon: SparklesIcon },
  featured_products: { label: "Featured Products", description: "Hand-picked pieces", icon: ShoppingBag },
  brand_story: { label: "Brand Story", description: "Editorial about the house", icon: LayoutTemplate },
  custom_tailoring: { label: "Custom Tailoring", description: "Made-to-measure invitation", icon: Ruler },
  testimonials: { label: "Testimonials", description: "Client words & ratings", icon: MessageSquareQuote },
  instagram: { label: "Instagram Feed", description: "Latest social posts", icon: Camera },
  newsletter: { label: "Newsletter", description: "Email capture", icon: Mail },
  footer: { label: "Footer", description: "Global site footer", icon: PanelBottom },
}

export const ANNOUNCEMENT_ICON = Bell

/* ── Promotions ──────────────────────────────────────────────────────── */

export const PROMOTION_STATUS_META: Record<PromotionStatus, StatusMeta> = {
  active: { label: "Active", tone: "success" },
  scheduled: { label: "Scheduled", tone: "gold" },
  paused: { label: "Paused", tone: "warning" },
  expired: { label: "Expired", tone: "neutral" },
  draft: { label: "Draft", tone: "neutral" },
}

export interface PromotionTypeMeta {
  label: string
  short: string
  icon: LucideIcon
}

export const PROMOTION_TYPE_META: Record<PromotionType, PromotionTypeMeta> = {
  percentage: { label: "Percentage Discount", short: "Percentage", icon: Percent },
  fixed: { label: "Fixed Amount", short: "Fixed", icon: Tag },
  free_shipping: { label: "Free Shipping", short: "Shipping", icon: Truck },
  buy_x_get_y: { label: "Buy X Get Y", short: "BXGY", icon: Gift },
  bundle: { label: "Bundle Offer", short: "Bundle", icon: Package },
}

export interface PromotionScopeMeta {
  label: string
  icon: LucideIcon
}

export const PROMOTION_SCOPE_META: Record<PromotionScope, PromotionScopeMeta> = {
  entire_store: { label: "Entire store", icon: Store },
  category: { label: "Category", icon: FolderTree },
  collection: { label: "Collection", icon: SparklesIcon },
  product: { label: "Products", icon: Package },
  vip: { label: "VIP customers", icon: CrownIcon },
}

/** Human discount label, e.g. "25% off", "PKR 5,000 off", "Free shipping". */
export function formatDiscount(p: {
  type: PromotionType
  value: number
  buyX: number | null
  getY: number | null
}): string {
  switch (p.type) {
    case "percentage":
      return `${p.value}% off`
    case "fixed":
      return `${formatCurrency(p.value)} off`
    case "free_shipping":
      return "Free shipping"
    case "buy_x_get_y":
      return `Buy ${p.buyX ?? 0} get ${p.getY ?? 0}`
    case "bundle":
      return `Bundle · ${p.value}% off`
    default:
      return "—"
  }
}

export interface Countdown {
  label: string
  state: "upcoming" | "soon" | "active" | "ended"
}

/**
 * Lifecycle-aware countdown: counts down to start for scheduled promos, to end
 * for live ones, and flags the final week as "soon" so it can be highlighted.
 */
export function getCountdown(
  startDate: string,
  endDate: string | null,
  now: number = Date.now()
): Countdown {
  const start = new Date(startDate).getTime()
  if (now < start) {
    return { label: `Starts in ${humanizeDuration(start - now)}`, state: "upcoming" }
  }
  if (!endDate) return { label: "No expiry", state: "active" }
  const end = new Date(endDate).getTime()
  if (now >= end) return { label: "Expired", state: "ended" }
  const remaining = end - now
  const soon = remaining <= 7 * 86_400_000
  return {
    label: `${humanizeDuration(remaining)} left`,
    state: soon ? "soon" : "active",
  }
}

function humanizeDuration(ms: number): string {
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const mins = Math.floor((ms % 3_600_000) / 60_000)
  if (days >= 1) return `${days}d ${hours}h`
  if (hours >= 1) return `${hours}h ${mins}m`
  return `${mins}m`
}

/* ── Reviews ─────────────────────────────────────────────────────────── */

export const REVIEW_MODERATION_META: Record<ReviewModerationStatus, StatusMeta> = {
  approved: { label: "Approved", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
  hidden: { label: "Hidden", tone: "neutral" },
  flagged: { label: "Flagged", tone: "danger" },
}

export const FIT_FEEDBACK_META: Record<
  FitFeedback,
  { label: string; tone: StatusTone }
> = {
  runs_small: { label: "Runs Small", tone: "warning" },
  true_to_size: { label: "True to Size", tone: "success" },
  runs_large: { label: "Runs Large", tone: "warning" },
}

/** Rating → tone, for star clusters and rating chips. */
export function ratingTone(rating: number): StatusTone {
  if (rating >= 4.5) return "success"
  if (rating >= 4) return "gold"
  if (rating >= 3) return "warning"
  return "danger"
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
