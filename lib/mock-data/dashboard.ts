import type { ActivityEvent, Delivery, Metric, TrendPoint } from "@/types"
import { orders } from "@/lib/mock-data/orders"
import { products } from "@/lib/mock-data/products"

function spark(seed: number[]): TrendPoint[] {
  return seed.map((value) => ({ value }))
}

export const metrics: Metric[] = [
  {
    id: "today-revenue",
    label: "Today's Revenue",
    value: "PKR 84,500",
    rawChange: 12.4,
    trend: "up",
    comparison: "vs yesterday",
    spark: spark([40, 44, 41, 52, 48, 61, 84]),
  },
  {
    id: "monthly-revenue",
    label: "Monthly Revenue",
    value: "PKR 2.14M",
    rawChange: 8.1,
    trend: "up",
    comparison: "vs last month",
    spark: spark([120, 132, 128, 141, 150, 148, 162, 175]),
  },
  {
    id: "orders",
    label: "Orders",
    value: "1,284",
    rawChange: 5.6,
    trend: "up",
    comparison: "vs last month",
    spark: spark([38, 45, 31, 52, 67, 59, 74]),
  },
  {
    id: "pending-orders",
    label: "Pending Orders",
    value: "37",
    rawChange: 4.2,
    trend: "up",
    comparison: "awaiting action",
    spark: spark([22, 26, 24, 30, 28, 33, 37]),
    intent: "warning",
  },
  {
    id: "products",
    label: "Products",
    value: "312",
    rawChange: 2.3,
    trend: "up",
    comparison: "12 new this month",
    spark: spark([288, 292, 296, 300, 305, 308, 312]),
  },
  {
    id: "customers",
    label: "Customers",
    value: "3,942",
    rawChange: 9.7,
    trend: "up",
    comparison: "vs last month",
    spark: spark([3200, 3380, 3510, 3620, 3740, 3850, 3942]),
  },
  {
    id: "custom-orders",
    label: "Custom Orders",
    value: "48",
    rawChange: 6.5,
    trend: "up",
    comparison: "in tailoring",
    spark: spark([30, 34, 33, 39, 42, 45, 48]),
    intent: "warning",
  },
  {
    id: "low-stock",
    label: "Low Stock",
    value: "14",
    rawChange: 3.1,
    trend: "down",
    comparison: "items to restock",
    spark: spark([9, 11, 10, 13, 12, 15, 14]),
    intent: "warning",
  },
]

export interface RevenuePoint {
  date: string
  revenue: number
  previous: number
}

export const revenueSeries: RevenuePoint[] = Array.from({ length: 30 }).map(
  (_, i) => {
    const day = i + 1
    const base = 55000 + Math.sin(i / 3.2) * 16000 + i * 850
    const weekend = i % 7 === 5 || i % 7 === 6 ? 13000 : 0
    const previous = base * 0.86 + (weekend ? 8000 : 0)
    return {
      date: `Jun ${day}`,
      revenue: Math.round(base + weekend),
      previous: Math.round(previous),
    }
  }
)

export interface OrdersPoint {
  date: string
  orders: number
}

export const ordersSeries: OrdersPoint[] = [
  { date: "Mon", orders: 38 },
  { date: "Tue", orders: 45 },
  { date: "Wed", orders: 31 },
  { date: "Thu", orders: 52 },
  { date: "Fri", orders: 67 },
  { date: "Sat", orders: 81 },
  { date: "Sun", orders: 59 },
]

export interface CategorySlice {
  key: string
  label: string
  value: number
  fill: string
}

export const categorySales: CategorySlice[] = [
  { key: "sherwanis", label: "Sherwanis", value: 412, fill: "var(--color-sherwanis)" },
  { key: "waistcoats", label: "Waistcoats", value: 298, fill: "var(--color-waistcoats)" },
  { key: "princeCoats", label: "Prince Coats", value: 231, fill: "var(--color-princeCoats)" },
  { key: "westernSuits", label: "Western Suits", value: 184, fill: "var(--color-westernSuits)" },
  { key: "kurtas", label: "Kurtas", value: 143, fill: "var(--color-kurtas)" },
]

export const orderStatusSlices: CategorySlice[] = [
  { key: "delivered", label: "Delivered", value: 612, fill: "var(--color-delivered)" },
  { key: "shipped", label: "Shipped", value: 214, fill: "var(--color-shipped)" },
  { key: "tailoring", label: "Tailoring", value: 158, fill: "var(--color-tailoring)" },
  { key: "confirmed", label: "Confirmed", value: 141, fill: "var(--color-confirmed)" },
  { key: "pending", label: "Pending", value: 96, fill: "var(--color-pending)" },
  { key: "cancelled", label: "Cancelled", value: 63, fill: "var(--color-cancelled)" },
]

export interface TopProduct {
  id: string
  name: string
  category: string
  image: string
  unitsSold: number
  revenue: number
  share: number
}

export const topProducts: TopProduct[] = [
  { id: "prd_01", name: "Maroon Velvet Sherwani", category: "Sherwanis", image: "maroon", unitsSold: 142, revenue: 5964000, share: 92 },
  { id: "prd_05", name: "Emerald Jamawar Sherwani", category: "Sherwanis", image: "emerald", unitsSold: 118, revenue: 6136000, share: 78 },
  { id: "prd_03", name: "Charcoal Three-Piece Suit", category: "Western Suits", image: "charcoal", unitsSold: 96, revenue: 2870400, share: 64 },
  { id: "prd_02", name: "Ivory Silk Prince Coat", category: "Prince Coats", image: "ivory", unitsSold: 74, revenue: 2886000, share: 49 },
  { id: "prd_06", name: "Sand Linen Kurta", category: "Kurtas", image: "sand", unitsSold: 61, revenue: 420900, share: 40 },
]

export const activityEvents: ActivityEvent[] = [
  { id: "act_01", type: "order", title: "New custom order from Ahsan Raza", meta: "TMK-10482 · PKR 42,000", timestamp: "2026-07-04T08:12:00Z" },
  { id: "act_02", type: "review", title: "New 5-star review on Maroon Velvet Sherwani", meta: "Awaiting approval", timestamp: "2026-07-04T07:40:00Z" },
  { id: "act_03", type: "inventory", title: "Ivory Shalwar Kameez dropped below threshold", meta: "1 left in stock", timestamp: "2026-07-04T06:05:00Z" },
  { id: "act_04", type: "customer", title: "Bilal Khan created an account", meta: "Karachi", timestamp: "2026-07-03T21:30:00Z" },
  { id: "act_05", type: "refund", title: "Refund processed for TMK-10477", meta: "PKR 9,800", timestamp: "2026-07-03T18:15:00Z" },
  { id: "act_06", type: "product", title: "Slate Peak-Lapel Waistcoat saved as draft", meta: "Waistcoats", timestamp: "2026-07-03T15:02:00Z" },
]

export const deliveries: Delivery[] = [
  { id: "del_01", reference: "TMK-10479", customerName: "Usman Tariq", status: "shipped", eta: "Jul 6", courier: "TCS Overnight" },
  { id: "del_02", reference: "TMK-10476", customerName: "Imran Yousaf", status: "ready", eta: "Jul 7", courier: "Leopards" },
  { id: "del_03", reference: "TMK-10482", customerName: "Ahsan Raza", status: "tailoring", eta: "Jul 9", courier: "In-house atelier" },
  { id: "del_04", reference: "TMK-10481", customerName: "Bilal Khan", status: "confirmed", eta: "Jul 10", courier: "TCS Standard" },
]

export interface Announcement {
  id: string
  title: string
  body: string
  date: string
}

export const announcements: Announcement[] = [
  { id: "ann_01", title: "Eid Collection goes live Friday", body: "18 new pieces are staged and scheduled to publish at 9:00 AM.", date: "2026-07-04T00:00:00Z" },
  { id: "ann_02", title: "Atelier capacity at 82%", body: "Consider capping custom orders after 60 to protect delivery SLAs.", date: "2026-07-03T00:00:00Z" },
]

export const lowStockProducts = products
  .filter((p) => p.stock <= p.lowStockThreshold)
  .sort((a, b) => a.stock - b.stock)
  .slice(0, 5)

export const recentOrders = orders.slice(0, 6)
export const pendingCustomOrders = orders.filter(
  (o) => o.isCustom && o.status !== "delivered" && o.status !== "cancelled"
)
