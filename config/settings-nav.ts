import {
  Archive,
  Bell,
  Boxes,
  CreditCard,
  Database,
  Fingerprint,
  Image,
  KeyRound,
  Landmark,
  MonitorSmartphone,
  Percent,
  Plug,
  Receipt,
  ScrollText,
  Search,
  ShieldCheck,
  Share2,
  Store,
  Truck,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface SettingsNavItem {
  id: string
  label: string
  icon: LucideIcon
  /** Extra search terms so the setting is discoverable by intent. */
  keywords: string[]
}

export interface SettingsNavGroup {
  label: string
  items: SettingsNavItem[]
}

export const SETTINGS_NAV: SettingsNavGroup[] = [
  {
    label: "General",
    items: [
      { id: "store", label: "Store Information", icon: Store, keywords: ["name", "email", "phone", "address", "timezone", "currency", "language", "logo"] },
      { id: "business", label: "Business Information", icon: Landmark, keywords: ["legal", "registration", "tax number", "ntn", "support"] },
      { id: "brand", label: "Brand Assets", icon: Image, keywords: ["logo", "favicon", "wordmark", "colors"] },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "shipping", label: "Shipping", icon: Truck, keywords: ["domestic", "international", "zones", "free shipping", "delivery", "rates"] },
      { id: "payments", label: "Payments", icon: CreditCard, keywords: ["stripe", "paypal", "cash on delivery", "cod", "bank transfer", "test mode"] },
      { id: "tax", label: "Taxes & Currency", icon: Percent, keywords: ["tax", "vat", "gst", "currency", "rounding"] },
      { id: "checkout", label: "Checkout", icon: Receipt, keywords: ["guest", "phone", "notes", "terms", "address"] },
    ],
  },
  {
    label: "Users & Permissions",
    items: [
      { id: "staff", label: "Staff", icon: Users, keywords: ["team", "members", "invite", "last login", "status"] },
      { id: "roles", label: "Roles & Permissions", icon: ShieldCheck, keywords: ["roles", "permissions", "access", "matrix"] },
      { id: "invitations", label: "Invitations", icon: UserPlus, keywords: ["invite", "pending", "email"] },
    ],
  },
  {
    label: "Notifications",
    items: [
      { id: "notifications", label: "Notifications", icon: Bell, keywords: ["email", "whatsapp", "sms", "order", "customer", "admin", "alerts"] },
    ],
  },
  {
    label: "Storefront",
    items: [
      { id: "seo", label: "SEO", icon: Search, keywords: ["meta title", "meta description", "open graph", "twitter", "robots", "favicon"] },
      { id: "social", label: "Social Media", icon: Share2, keywords: ["instagram", "facebook", "tiktok", "pinterest", "youtube", "linkedin"] },
      { id: "integrations", label: "Analytics Integrations", icon: Plug, keywords: ["google analytics", "meta pixel", "tiktok", "klaviyo", "hotjar"] },
    ],
  },
  {
    label: "Media",
    items: [
      { id: "media", label: "Storage & Media", icon: Boxes, keywords: ["storage", "image optimization", "webp", "cdn", "upload", "lazy load"] },
    ],
  },
  {
    label: "Security",
    items: [
      { id: "auth", label: "Authentication", icon: Fingerprint, keywords: ["two factor", "2fa", "password policy", "login alerts"] },
      { id: "sessions", label: "Sessions & Devices", icon: MonitorSmartphone, keywords: ["sessions", "devices", "connected", "logout"] },
      { id: "apikeys", label: "API Keys", icon: KeyRound, keywords: ["api", "keys", "tokens", "secret"] },
      { id: "audit", label: "Audit Log", icon: ScrollText, keywords: ["audit", "activity", "history", "log"] },
    ],
  },
  {
    label: "Advanced",
    items: [
      { id: "backups", label: "Backups", icon: Archive, keywords: ["backup", "restore", "download", "automatic"] },
      { id: "data", label: "Import & Export", icon: Database, keywords: ["import", "export", "csv", "data", "migrate"] },
      { id: "maintenance", label: "Maintenance", icon: Wrench, keywords: ["maintenance mode", "system logs", "danger"] },
    ],
  },
]

export const ALL_NAV_ITEMS: SettingsNavItem[] = SETTINGS_NAV.flatMap((g) => g.items)

export const SETTINGS_GROUP_OF: Record<string, string> = Object.fromEntries(
  SETTINGS_NAV.flatMap((g) => g.items.map((i) => [i.id, g.label]))
)
