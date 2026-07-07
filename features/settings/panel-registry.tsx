import type { PanelProps } from "@/features/settings/panel-context"
import { BrandPanel, BusinessPanel, StorePanel } from "@/features/settings/panels/general"
import {
  CheckoutPanel,
  PaymentsPanel,
  ShippingPanel,
  TaxPanel,
} from "@/features/settings/panels/commerce"
import {
  InvitationsPanel,
  RolesPanel,
  StaffPanel,
} from "@/features/settings/panels/users"
import { NotificationsPanel } from "@/features/settings/panels/notifications"
import {
  IntegrationsPanel,
  SeoPanel,
  SocialPanel,
} from "@/features/settings/panels/storefront"
import { MediaPanel } from "@/features/settings/panels/media"
import {
  ApiKeysPanel,
  AuditPanel,
  AuthPanel,
  SessionsPanel,
} from "@/features/settings/panels/security"
import {
  BackupsPanel,
  DataPanel,
  MaintenancePanel,
} from "@/features/settings/panels/advanced"

/**
 * Panel registry — maps a nav id to its renderer. Panels that mutate settings
 * receive the shared context; static panels ignore it. Adding a section is a
 * single entry here plus a nav item.
 */
export const PANEL_REGISTRY: Record<string, (ctx: PanelProps) => React.ReactNode> = {
  store: (ctx) => <StorePanel {...ctx} />,
  business: (ctx) => <BusinessPanel {...ctx} />,
  brand: () => <BrandPanel />,
  shipping: (ctx) => <ShippingPanel {...ctx} />,
  payments: (ctx) => <PaymentsPanel {...ctx} />,
  tax: (ctx) => <TaxPanel {...ctx} />,
  checkout: (ctx) => <CheckoutPanel {...ctx} />,
  staff: () => <StaffPanel />,
  roles: () => <RolesPanel />,
  invitations: () => <InvitationsPanel />,
  notifications: (ctx) => <NotificationsPanel {...ctx} />,
  seo: (ctx) => <SeoPanel {...ctx} />,
  social: (ctx) => <SocialPanel {...ctx} />,
  integrations: () => <IntegrationsPanel />,
  media: (ctx) => <MediaPanel {...ctx} />,
  auth: (ctx) => <AuthPanel {...ctx} />,
  sessions: () => <SessionsPanel />,
  apikeys: () => <ApiKeysPanel />,
  audit: () => <AuditPanel />,
  backups: (ctx) => <BackupsPanel {...ctx} />,
  data: () => <DataPanel />,
  maintenance: (ctx) => <MaintenancePanel {...ctx} />,
}
