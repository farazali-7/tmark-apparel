import { Download, PackagePlus } from "lucide-react"
import Link from "next/link"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { ActivityTimeline } from "@/features/dashboard/components/activity-timeline"
import { Announcements } from "@/features/dashboard/components/announcements"
import { KpiGrid } from "@/features/dashboard/components/kpi-grid"
import { LowStockPanel } from "@/features/dashboard/components/low-stock-panel"
import { OrderStatusChart } from "@/features/dashboard/components/order-status-chart"
import { OrdersChart } from "@/features/dashboard/components/orders-chart"
import { QuickActions } from "@/features/dashboard/components/quick-actions"
import { RecentCustomers } from "@/features/dashboard/components/recent-customers"
import { RecentOrders } from "@/features/dashboard/components/recent-orders"
import { RecentReviews } from "@/features/dashboard/components/recent-reviews"
import { RevenueChart } from "@/features/dashboard/components/revenue-chart"
import { TopCategories } from "@/features/dashboard/components/top-categories"
import { TopProducts } from "@/features/dashboard/components/top-products"
import { UpcomingDeliveries } from "@/features/dashboard/components/upcoming-deliveries"

export function DashboardView() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow={today}
        title="Good afternoon, Owner"
        description="Here's the pulse of T-Mark Apparel today — revenue, orders, and everything that needs your attention."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/products">
                <PackagePlus className="size-4" /> Add Product
              </Link>
            </Button>
          </>
        }
      />

      <KpiGrid />

      <section className="space-y-4">
        <SectionHeader
          title="Business Overview"
          description="Performance at a glance"
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <OrderStatusChart />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <OrdersChart />
          <TopCategories />
          <TopProducts />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Operations"
          description="What needs attention right now"
        />
        <RecentOrders />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <LowStockPanel />
          <UpcomingDeliveries />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RecentCustomers />
          <RecentReviews />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Activity" description="Live feed & shortcuts" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ActivityTimeline />
          </div>
          <div className="space-y-4">
            <QuickActions />
            <Announcements />
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
