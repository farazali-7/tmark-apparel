import type { LucideIcon } from "lucide-react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  Globe2,
  Repeat,
  Scissors,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import type { Metric, TrendPoint } from "@/types"

const spark = (seed: number[]): TrendPoint[] => seed.map((value) => ({ value }))

/* ── Executive summary KPIs ──────────────────────────────────────────── */
export const executiveMetrics: Metric[] = [
  {
    id: "revenue",
    label: "Revenue",
    value: "PKR 24.8M",
    rawChange: 18.2,
    trend: "up",
    comparison: "vs previous period",
    spark: spark([1.6, 1.8, 1.7, 2.1, 2.0, 2.3, 2.48].map((v) => v * 1_000_000)),
  },
  {
    id: "profit",
    label: "Gross Profit",
    value: "PKR 11.2M",
    rawChange: 14.6,
    trend: "up",
    comparison: "45% margin",
    spark: spark([0.7, 0.82, 0.79, 0.95, 0.9, 1.05, 1.12].map((v) => v * 1_000_000)),
  },
  {
    id: "orders",
    label: "Orders",
    value: "1,284",
    rawChange: 9.4,
    trend: "up",
    comparison: "vs previous period",
    spark: spark([158, 172, 168, 190, 186, 205, 214]),
  },
  {
    id: "aov",
    label: "Avg Order Value",
    value: "PKR 19,320",
    rawChange: 12.1,
    trend: "up",
    comparison: "vs previous period",
    spark: spark([16.8, 17.2, 17.9, 18.1, 18.6, 19.0, 19.3].map((v) => v * 1000)),
  },
  {
    id: "customers",
    label: "Customers",
    value: "3,942",
    rawChange: 9.7,
    trend: "up",
    comparison: "412 new",
    spark: spark([3200, 3380, 3510, 3620, 3740, 3850, 3942]),
  },
  {
    id: "returning",
    label: "Returning Rate",
    value: "38%",
    rawChange: 4.3,
    trend: "up",
    comparison: "of all buyers",
    spark: spark([31, 33, 32, 35, 36, 37, 38]),
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "3.6%",
    rawChange: 0.4,
    trend: "up",
    comparison: "storefront",
    spark: spark([3.0, 3.1, 3.2, 3.2, 3.4, 3.5, 3.6]),
  },
  {
    id: "custom-orders",
    label: "Custom Orders",
    value: "186",
    rawChange: 6.5,
    trend: "up",
    comparison: "in production",
    spark: spark([120, 134, 140, 155, 168, 178, 186]),
    intent: "warning",
  },
  {
    id: "international",
    label: "International",
    value: "34%",
    rawChange: 5.2,
    trend: "up",
    comparison: "of revenue",
    spark: spark([26, 28, 29, 31, 32, 33, 34]),
  },
]

/* ── Revenue over time (monthly, current vs previous year) ───────────── */
export interface RevenuePoint {
  month: string
  revenue: number
  previous: number
}
export const revenueByMonth: RevenuePoint[] = [
  { month: "Jan", revenue: 1_420_000, previous: 1_180_000 },
  { month: "Feb", revenue: 1_610_000, previous: 1_240_000 },
  { month: "Mar", revenue: 1_880_000, previous: 1_520_000 },
  { month: "Apr", revenue: 1_740_000, previous: 1_600_000 },
  { month: "May", revenue: 2_120_000, previous: 1_690_000 },
  { month: "Jun", revenue: 2_480_000, previous: 1_910_000 },
  { month: "Jul", revenue: 2_680_000, previous: 2_040_000 },
  { month: "Aug", revenue: 2_260_000, previous: 1_980_000 },
  { month: "Sep", revenue: 2_040_000, previous: 1_820_000 },
  { month: "Oct", revenue: 2_310_000, previous: 1_760_000 },
  { month: "Nov", revenue: 2_720_000, previous: 2_010_000 },
  { month: "Dec", revenue: 3_180_000, previous: 2_360_000 },
]

/* ── Breakdown items (shared shape for the bar lists) ────────────────── */
export interface BreakdownItem {
  label: string
  value: number
  meta?: string
  flag?: string
}

export const revenueByCategory: BreakdownItem[] = [
  { label: "Sherwanis", value: 8_420_000, meta: "412 orders" },
  { label: "Western Suits", value: 5_180_000, meta: "296 orders" },
  { label: "Prince Coats", value: 4_020_000, meta: "184 orders" },
  { label: "Waistcoats", value: 3_260_000, meta: "231 orders" },
  { label: "Kurtas", value: 2_140_000, meta: "148 orders" },
  { label: "Shalwar Kameez", value: 1_780_000, meta: "132 orders" },
]

export const revenueByCollection: BreakdownItem[] = [
  { label: "Wedding Collection", value: 9_640_000, meta: "38% of revenue" },
  { label: "Best Sellers", value: 4_820_000, meta: "19%" },
  { label: "Eid Collection", value: 3_910_000, meta: "16%" },
  { label: "Summer Collection", value: 2_460_000, meta: "10%" },
  { label: "New Arrivals", value: 1_980_000, meta: "8%" },
]

export const revenueByCountry: BreakdownItem[] = [
  { label: "Pakistan", value: 16_320_000, meta: "66%", flag: "🇵🇰" },
  { label: "United Kingdom", value: 2_940_000, meta: "12%", flag: "🇬🇧" },
  { label: "UAE", value: 2_180_000, meta: "9%", flag: "🇦🇪" },
  { label: "Saudi Arabia", value: 1_460_000, meta: "6%", flag: "🇸🇦" },
  { label: "United States", value: 1_020_000, meta: "4%", flag: "🇺🇸" },
  { label: "Canada", value: 880_000, meta: "3%", flag: "🇨🇦" },
]

export const topCities: BreakdownItem[] = [
  { label: "Lahore", value: 6_820_000, meta: "Pakistan" },
  { label: "Karachi", value: 4_960_000, meta: "Pakistan" },
  { label: "Islamabad", value: 3_140_000, meta: "Pakistan" },
  { label: "London", value: 2_540_000, meta: "United Kingdom" },
  { label: "Dubai", value: 1_980_000, meta: "UAE" },
]

export const topFabrics: BreakdownItem[] = [
  { label: "Jamawar", value: 384, meta: "PKR 7.2M" },
  { label: "Raw Silk", value: 296, meta: "PKR 4.8M" },
  { label: "Wool Blend", value: 268, meta: "PKR 5.1M" },
  { label: "Velvet", value: 214, meta: "PKR 4.4M" },
  { label: "Egyptian Cotton", value: 188, meta: "PKR 1.9M" },
]

export const topSizes: BreakdownItem[] = [
  { label: "M", value: 428 },
  { label: "L", value: 392 },
  { label: "Bespoke", value: 286 },
  { label: "XL", value: 214 },
  { label: "S", value: 132 },
  { label: "XXL", value: 78 },
]

export const mostRequestedFits: BreakdownItem[] = [
  { label: "Classic Fit", value: 142 },
  { label: "Regular Fit", value: 118 },
  { label: "Slim Fit", value: 96 },
  { label: "Wedding Fit", value: 74 },
]

/* ── Donut datasets ──────────────────────────────────────────────────── */
export interface DonutSlice {
  key: string
  label: string
  value: number
  color: string
}

export const revenueByOrderType: DonutSlice[] = [
  { key: "rtw", label: "Ready to Wear", value: 9_920_000, color: "var(--chart-2)" },
  { key: "mtm", label: "Made to Measure", value: 8_180_000, color: "var(--chart-3)" },
  { key: "custom", label: "Custom Tailoring", value: 6_700_000, color: "var(--gold)" },
]

export const newVsReturning: DonutSlice[] = [
  { key: "returning", label: "Returning", value: 61, color: "var(--chart-1)" },
  { key: "new", label: "New", value: 39, color: "var(--chart-4)" },
]

export const domesticVsInternational: DonutSlice[] = [
  { key: "domestic", label: "Domestic", value: 66, color: "var(--chart-2)" },
  { key: "international", label: "International", value: 34, color: "var(--gold)" },
]

export const productionStatus: DonutSlice[] = [
  { key: "measurements", label: "Measurements", value: 28, color: "var(--chart-3)" },
  { key: "fabric", label: "Fabric", value: 22, color: "var(--chart-4)" },
  { key: "tailoring", label: "Tailoring", value: 64, color: "var(--gold)" },
  { key: "quality", label: "Quality Check", value: 34, color: "var(--chart-2)" },
  { key: "ready", label: "Ready", value: 38, color: "var(--chart-1)" },
]

export const orderStatusDistribution: DonutSlice[] = [
  { key: "delivered", label: "Delivered", value: 612, color: "var(--chart-1)" },
  { key: "shipped", label: "Shipped", value: 214, color: "var(--chart-2)" },
  { key: "tailoring", label: "In Production", value: 186, color: "var(--gold)" },
  { key: "confirmed", label: "Confirmed", value: 141, color: "var(--chart-3)" },
  { key: "pending", label: "Pending", value: 68, color: "var(--chart-4)" },
  { key: "cancelled", label: "Cancelled", value: 63, color: "var(--chart-5)" },
]

/* ── Best-selling products ───────────────────────────────────────────── */
export interface ProductPerformance {
  id: string
  name: string
  category: string
  image: string
  units: number
  revenue: number
  trend: "up" | "down"
  change: number
  spark: TrendPoint[]
}
export const bestSellers: ProductPerformance[] = [
  { id: "p1", name: "Ivory Embroidered Sherwani", category: "Sherwanis", image: "ivory", units: 142, revenue: 5_964_000, trend: "up", change: 22, spark: spark([60, 72, 68, 90, 84, 118, 142]) },
  { id: "p2", name: "Maroon Bespoke Sherwani", category: "Sherwanis", image: "maroon", units: 118, revenue: 6_136_000, trend: "up", change: 16, spark: spark([54, 66, 72, 80, 96, 104, 118]) },
  { id: "p3", name: "Navy Three-Piece Suit", category: "Western Suits", image: "navy", units: 96, revenue: 4_464_000, trend: "up", change: 9, spark: spark([48, 55, 61, 70, 78, 88, 96]) },
  { id: "p4", name: "Black Velvet Prince Coat", category: "Prince Coats", image: "black", units: 74, revenue: 4_292_000, trend: "down", change: 4, spark: spark([80, 78, 76, 79, 72, 76, 74]) },
  { id: "p5", name: "Charcoal Wool Waistcoat", category: "Waistcoats", image: "charcoal", units: 128, revenue: 1_139_000, trend: "up", change: 12, spark: spark([70, 82, 88, 96, 104, 118, 128]) },
  { id: "p6", name: "Emerald Silk Kurta", category: "Kurtas", image: "emerald", units: 96, revenue: 998_000, trend: "up", change: 7, spark: spark([60, 66, 71, 78, 84, 90, 96]) },
]

export const noSalesProducts = [
  { id: "n1", name: "Slate Peak-Lapel Waistcoat", category: "Waistcoats", image: "charcoal", days: 62 },
  { id: "n2", name: "Sand Nehru Jacket", category: "Prince Coats", image: "sand", days: 48 },
  { id: "n3", name: "Winter Tweed Blazer", category: "Western Suits", image: "navy", days: 41 },
]

export const lowStockAlerts = [
  { id: "l1", name: "Ivory Embroidered Sherwani", category: "Sherwanis", image: "ivory", stock: 2 },
  { id: "l2", name: "Navy Formal Kurta", category: "Kurtas", image: "navy", stock: 3 },
  { id: "l3", name: "Maroon Velvet Waistcoat", category: "Waistcoats", image: "maroon", stock: 4 },
]

/* ── Customer analytics ──────────────────────────────────────────────── */
export interface GrowthPoint {
  month: string
  customers: number
  returning: number
}
export const customerGrowth: GrowthPoint[] = [
  { month: "Jan", customers: 3200, returning: 980 },
  { month: "Feb", customers: 3380, returning: 1080 },
  { month: "Mar", customers: 3510, returning: 1180 },
  { month: "Apr", customers: 3620, returning: 1290 },
  { month: "May", customers: 3740, returning: 1380 },
  { month: "Jun", customers: 3850, returning: 1440 },
  { month: "Jul", customers: 3942, returning: 1498 },
]

export interface TopCustomer {
  id: string
  name: string
  initials: string
  country: string
  flag: string
  orders: number
  spend: number
  vip: boolean
}
export const topCustomers: TopCustomer[] = [
  { id: "c1", name: "Imran Yousaf", initials: "IY", country: "United Kingdom", flag: "🇬🇧", orders: 9, spend: 612_000, vip: true },
  { id: "c2", name: "Yousaf Nawaz", initials: "YN", country: "Qatar", flag: "🇶🇦", orders: 8, spend: 540_000, vip: true },
  { id: "c3", name: "Ahsan Raza", initials: "AR", country: "Pakistan", flag: "🇵🇰", orders: 7, spend: 486_000, vip: true },
  { id: "c4", name: "Abdullah Al-Rashid", initials: "AA", country: "Saudi Arabia", flag: "🇸🇦", orders: 6, spend: 331_000, vip: true },
  { id: "c5", name: "Usman Tariq", initials: "UT", country: "Pakistan", flag: "🇵🇰", orders: 9, spend: 231_000, vip: false },
]

export interface StatTileData {
  label: string
  value: string
  sub: string
}
export const customerStats: StatTileData[] = [
  { label: "Lifetime Value", value: "PKR 62,400", sub: "avg per customer" },
  { label: "Repeat Purchase Rate", value: "38%", sub: "buy again within 90d" },
  { label: "New This Month", value: "412", sub: "+9.7% MoM" },
  { label: "VIP Customers", value: "128", sub: "3.2% of base" },
]

/* ── Tailoring analytics ─────────────────────────────────────────────── */
export const tailoringStats: StatTileData[] = [
  { label: "Custom Orders", value: "186", sub: "in production" },
  { label: "Avg Completion", value: "14.2 days", sub: "measurement → ship" },
  { label: "On-Time Rate", value: "92%", sub: "vs deadline" },
  { label: "Atelier Load", value: "82%", sub: "capacity used" },
]

export interface TailorWorkload {
  name: string
  initials: string
  active: number
  capacity: number
}
export const tailorWorkload: TailorWorkload[] = [
  { name: "Master Yousuf", initials: "MY", active: 18, capacity: 20 },
  { name: "Master Iqbal", initials: "MI", active: 15, capacity: 20 },
  { name: "Master Rehman", initials: "MR", active: 12, capacity: 18 },
  { name: "Master Nadeem", initials: "MN", active: 16, capacity: 18 },
]

export interface UpcomingDelivery {
  reference: string
  customer: string
  initials: string
  deadline: string
  daysLeft: number
}
export const upcomingDeliveries: UpcomingDelivery[] = [
  { reference: "TMK-10482", customer: "Ahsan Raza", initials: "AR", deadline: "Jul 18", daysLeft: 2 },
  { reference: "TMK-10474", customer: "Abdullah Al-Rashid", initials: "AA", deadline: "Jul 26", daysLeft: 10 },
  { reference: "TMK-10473", customer: "Daniyal Ahmed", initials: "DA", deadline: "Jul 16", daysLeft: 0 },
  { reference: "TMK-10466", customer: "Ali Raza Bukhari", initials: "AB", deadline: "Jul 21", daysLeft: 5 },
]

/* ── Order analytics tiles ───────────────────────────────────────────── */
export const orderStats: StatTileData[] = [
  { label: "Cancelled Orders", value: "63", sub: "4.9% of orders" },
  { label: "Refund Requests", value: "18", sub: "1.4% of orders" },
  { label: "Avg Processing", value: "1.8 days", sub: "order → dispatch" },
  { label: "On-Time Shipping", value: "94%", sub: "vs promised" },
]

/* ── AI-style insights ───────────────────────────────────────────────── */
export interface Insight {
  id: string
  text: string
  detail: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}
export const insights: Insight[] = [
  { id: "i1", text: "Revenue is up 18% this period", detail: "Driven by the Wedding Collection and stronger international orders.", change: "+18%", trend: "up", icon: TrendingUp },
  { id: "i2", text: "Wedding Collection leads revenue", detail: "PKR 9.64M — 38% of total, your highest-earning campaign.", change: "38%", trend: "up", icon: Sparkles },
  { id: "i3", text: "Sherwanis outperform every category", detail: "PKR 8.42M across 412 orders, ahead of Western Suits by 63%.", change: "+63%", trend: "up", icon: Crown },
  { id: "i4", text: "Returning customers drive 61% of revenue", detail: "Loyalty is compounding — repeat purchase rate rose to 38%.", change: "61%", trend: "up", icon: Repeat },
  { id: "i5", text: "International revenue climbed to 34%", detail: "UK, UAE and Saudi Arabia are your fastest-growing markets.", change: "+5.2%", trend: "up", icon: Globe2 },
  { id: "i6", text: "Custom tailoring AOV is 3.4× ready-to-wear", detail: "Bespoke commissions average PKR 54,000 vs PKR 15,800.", change: "3.4×", trend: "up", icon: Scissors },
]

/* ── Quick reports ───────────────────────────────────────────────────── */
export interface ReportDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const insightTrendIcon = { up: ArrowUpRight, down: ArrowDownRight }
