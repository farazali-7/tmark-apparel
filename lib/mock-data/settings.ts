/**
 * Settings domain — UI-only. A single typed state object powers dirty-tracking
 * and save/discard, while the record arrays (staff, roles, keys…) feed the
 * richer panels. No values are persisted.
 */

export interface SettingsState {
  general: {
    storeName: string
    email: string
    phone: string
    address: string
    timezone: string
    currency: string
    language: string
  }
  business: {
    legalName: string
    registration: string
    taxNumber: string
    supportEmail: string
    supportPhone: string
    address: string
  }
  shipping: {
    domestic: boolean
    international: boolean
    freeShippingThreshold: string
    domesticRate: string
    intlRate: string
    estDomestic: string
    estIntl: string
  }
  payments: {
    stripe: boolean
    paypal: boolean
    cod: boolean
    bankTransfer: boolean
    testMode: boolean
  }
  tax: {
    pricesIncludeTax: boolean
    taxRate: string
    autoCurrency: boolean
    roundingUp: boolean
  }
  checkout: {
    guestCheckout: boolean
    phoneRequired: boolean
    orderNotes: boolean
    termsRequired: boolean
    addressValidation: boolean
  }
  notifications: {
    email: boolean
    whatsapp: boolean
    sms: boolean
    orderPlaced: boolean
    orderShipped: boolean
    customerSignup: boolean
    lowStock: boolean
    newReview: boolean
    refundRequest: boolean
  }
  seo: {
    metaTitle: string
    metaDescription: string
    openGraph: boolean
    twitterCard: boolean
    robotsIndex: boolean
  }
  social: {
    instagram: string
    facebook: string
    tiktok: string
    pinterest: string
    youtube: string
    linkedin: string
  }
  media: {
    autoOptimize: boolean
    webp: boolean
    lazyLoad: boolean
    cdn: boolean
    maxUpload: string
  }
  security: {
    twoFactor: boolean
    loginAlerts: boolean
    passwordPolicy: string
    sessionTimeout: string
  }
  advanced: {
    autoBackup: boolean
    backupFrequency: string
    maintenanceMode: boolean
  }
}

export const defaultSettings: SettingsState = {
  general: {
    storeName: "T-Mark Apparel",
    email: "hello@tmarkapparel.com",
    phone: "+92 42 111 862 762",
    address: "24 DHA Phase 5, Lahore, Pakistan",
    timezone: "Asia/Karachi (GMT+5)",
    currency: "PKR",
    language: "English",
  },
  business: {
    legalName: "T-Mark Apparel (Pvt) Ltd",
    registration: "0092381-7",
    taxNumber: "NTN 4820193-6",
    supportEmail: "support@tmarkapparel.com",
    supportPhone: "+92 300 111 8627",
    address: "Plot 118, Sundar Industrial Estate, Lahore",
  },
  shipping: {
    domestic: true,
    international: true,
    freeShippingThreshold: "15000",
    domesticRate: "300",
    intlRate: "6500",
    estDomestic: "2–4 days",
    estIntl: "5–9 days",
  },
  payments: { stripe: true, paypal: false, cod: true, bankTransfer: true, testMode: false },
  tax: { pricesIncludeTax: true, taxRate: "0", autoCurrency: true, roundingUp: false },
  checkout: {
    guestCheckout: true,
    phoneRequired: true,
    orderNotes: true,
    termsRequired: true,
    addressValidation: true,
  },
  notifications: {
    email: true,
    whatsapp: true,
    sms: false,
    orderPlaced: true,
    orderShipped: true,
    customerSignup: false,
    lowStock: true,
    newReview: true,
    refundRequest: true,
  },
  seo: {
    metaTitle: "T-Mark Apparel — Luxury Menswear & Bespoke Tailoring",
    metaDescription:
      "Ready-to-wear, made-to-measure and custom tailoring for the modern gentleman. Worldwide shipping.",
    openGraph: true,
    twitterCard: true,
    robotsIndex: true,
  },
  social: {
    instagram: "@tmarkapparel",
    facebook: "TMarkApparel",
    tiktok: "@tmarkapparel",
    pinterest: "tmarkapparel",
    youtube: "",
    linkedin: "",
  },
  media: { autoOptimize: true, webp: true, lazyLoad: true, cdn: true, maxUpload: "10" },
  security: {
    twoFactor: true,
    loginAlerts: true,
    passwordPolicy: "Strong (12+ chars, mixed case, symbol)",
    sessionTimeout: "30 days",
  },
  advanced: { autoBackup: true, backupFrequency: "Daily", maintenanceMode: false },
}

/* ── Records for the richer panels ───────────────────────────────────── */

export type StaffRole = "Owner" | "Admin" | "Manager" | "Staff" | "Support"
export type StaffStatus = "active" | "invited" | "suspended"

export interface StaffMember {
  id: string
  name: string
  initials: string
  email: string
  role: StaffRole
  status: StaffStatus
  lastActive: string
}

export const staff: StaffMember[] = [
  { id: "s1", name: "Faraz Ali", initials: "FA", email: "faraz@tmarkapparel.com", role: "Owner", status: "active", lastActive: "2026-07-06T08:40:00Z" },
  { id: "s2", name: "Sana Mir", initials: "SM", email: "sana@tmarkapparel.com", role: "Admin", status: "active", lastActive: "2026-07-06T07:10:00Z" },
  { id: "s3", name: "Bilal Ahmed", initials: "BA", email: "bilal@tmarkapparel.com", role: "Manager", status: "active", lastActive: "2026-07-05T18:20:00Z" },
  { id: "s4", name: "Hira Khan", initials: "HK", email: "hira@tmarkapparel.com", role: "Support", status: "active", lastActive: "2026-07-06T06:00:00Z" },
  { id: "s5", name: "Usman Tariq", initials: "UT", email: "usman@tmarkapparel.com", role: "Staff", status: "invited", lastActive: "" },
  { id: "s6", name: "Ayesha Noor", initials: "AN", email: "ayesha@tmarkapparel.com", role: "Staff", status: "suspended", lastActive: "2026-06-20T12:00:00Z" },
]

export interface RoleDef {
  id: string
  name: string
  description: string
  members: number
  permissions: number
  totalPermissions: number
  system: boolean
}

export const roles: RoleDef[] = [
  { id: "r1", name: "Owner", description: "Unrestricted access to everything", members: 1, permissions: 42, totalPermissions: 42, system: true },
  { id: "r2", name: "Admin", description: "Manage store, staff and settings", members: 1, permissions: 38, totalPermissions: 42, system: true },
  { id: "r3", name: "Manager", description: "Orders, products, customers and reviews", members: 1, permissions: 26, totalPermissions: 42, system: false },
  { id: "r4", name: "Support", description: "View orders and reply to customers", members: 1, permissions: 14, totalPermissions: 42, system: false },
  { id: "r5", name: "Staff", description: "Limited catalog and order access", members: 2, permissions: 9, totalPermissions: 42, system: false },
]

export interface PermissionGroup {
  area: string
  actions: { label: string; roles: StaffRole[] }[]
}

export const permissionMatrix: PermissionGroup[] = [
  {
    area: "Orders",
    actions: [
      { label: "View orders", roles: ["Owner", "Admin", "Manager", "Support", "Staff"] },
      { label: "Edit & fulfil orders", roles: ["Owner", "Admin", "Manager"] },
      { label: "Refund & cancel", roles: ["Owner", "Admin"] },
    ],
  },
  {
    area: "Products",
    actions: [
      { label: "View catalog", roles: ["Owner", "Admin", "Manager", "Staff"] },
      { label: "Create & edit", roles: ["Owner", "Admin", "Manager"] },
      { label: "Delete products", roles: ["Owner", "Admin"] },
    ],
  },
  {
    area: "Settings",
    actions: [
      { label: "View settings", roles: ["Owner", "Admin"] },
      { label: "Manage staff & billing", roles: ["Owner"] },
    ],
  },
]

export interface ApiKey {
  id: string
  label: string
  prefix: string
  scope: "Read" | "Read & Write" | "Admin"
  created: string
  lastUsed: string
}

export const apiKeys: ApiKey[] = [
  { id: "k1", label: "Storefront (production)", prefix: "tmk_live_9f2a", scope: "Read", created: "2026-01-12T00:00:00Z", lastUsed: "2026-07-06T05:00:00Z" },
  { id: "k2", label: "Fulfilment integration", prefix: "tmk_live_74bc", scope: "Read & Write", created: "2026-03-04T00:00:00Z", lastUsed: "2026-07-05T22:00:00Z" },
  { id: "k3", label: "Analytics pipeline", prefix: "tmk_live_2240", scope: "Read", created: "2026-05-19T00:00:00Z", lastUsed: "2026-07-04T14:00:00Z" },
]

export interface SessionDevice {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

export const sessions: SessionDevice[] = [
  { id: "d1", device: "MacBook Pro", browser: "Chrome 141", location: "Lahore, PK", ip: "203.82.44.10", lastActive: "2026-07-06T08:40:00Z", current: true },
  { id: "d2", device: "iPhone 16 Pro", browser: "Safari", location: "Lahore, PK", ip: "203.82.44.11", lastActive: "2026-07-06T06:20:00Z", current: false },
  { id: "d3", device: "iPad Air", browser: "Safari", location: "Dubai, AE", ip: "94.203.18.42", lastActive: "2026-07-02T11:00:00Z", current: false },
]

export interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  at: string
}

export const auditLog: AuditEntry[] = [
  { id: "a1", actor: "Sana Mir", action: "Updated shipping rates", target: "Commerce · Shipping", at: "2026-07-06T07:12:00Z" },
  { id: "a2", actor: "Faraz Ali", action: "Invited a new staff member", target: "Users · usman@tmarkapparel.com", at: "2026-07-05T16:40:00Z" },
  { id: "a3", actor: "Bilal Ahmed", action: "Published a promotion", target: "Marketing · WEDDING25", at: "2026-07-05T11:05:00Z" },
  { id: "a4", actor: "Sana Mir", action: "Rotated an API key", target: "Security · tmk_live_74bc", at: "2026-07-04T09:30:00Z" },
  { id: "a5", actor: "Faraz Ali", action: "Enabled two-factor authentication", target: "Security · Authentication", at: "2026-07-01T10:00:00Z" },
]

export interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  detail: string
}

export const analyticsIntegrations: Integration[] = [
  { id: "ga", name: "Google Analytics 4", description: "Traffic & conversion tracking", connected: true, detail: "G-8QX2ML9P" },
  { id: "meta", name: "Meta Pixel", description: "Facebook & Instagram ads", connected: true, detail: "PIX-4482019" },
  { id: "tiktok", name: "TikTok Pixel", description: "TikTok campaign tracking", connected: false, detail: "" },
  { id: "klaviyo", name: "Klaviyo", description: "Email & SMS marketing", connected: true, detail: "Synced 2h ago" },
  { id: "hotjar", name: "Hotjar", description: "Heatmaps & session replay", connected: false, detail: "" },
]

export interface Backup {
  id: string
  label: string
  size: string
  at: string
}

export const backups: Backup[] = [
  { id: "b1", label: "Automatic daily backup", size: "248 MB", at: "2026-07-06T02:00:00Z" },
  { id: "b2", label: "Automatic daily backup", size: "246 MB", at: "2026-07-05T02:00:00Z" },
  { id: "b3", label: "Manual backup — pre-Eid launch", size: "244 MB", at: "2026-06-24T18:30:00Z" },
]
