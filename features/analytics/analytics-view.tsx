"use client"

import * as React from "react"
import { toast } from "sonner"
import { Download, FileText, RefreshCw, SlidersHorizontal } from "lucide-react"

import { PageContainer } from "@/components/shared/page-container"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AnalyticsFilterBar,
  DATE_RANGES,
  type AnalyticsFilters,
} from "@/features/analytics/components/analytics-filter-bar"
import { ExportDialog } from "@/features/analytics/components/export-dialog"
import { KpiGrid } from "@/features/analytics/components/kpi-grid"
import { OverviewTab } from "@/features/analytics/tabs/overview-tab"
import { RevenueTab } from "@/features/analytics/tabs/revenue-tab"
import { ProductsTab } from "@/features/analytics/tabs/products-tab"
import { CustomersTab } from "@/features/analytics/tabs/customers-tab"
import { TailoringTab } from "@/features/analytics/tabs/tailoring-tab"
import { GeographyTab } from "@/features/analytics/tabs/geography-tab"

const DEFAULT_FILTERS: AnalyticsFilters = {
  range: "30d",
  country: "all",
  category: "all",
  orderType: "all",
  compare: true,
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "revenue", label: "Revenue" },
  { value: "products", label: "Products" },
  { value: "customers", label: "Customers" },
  { value: "tailoring", label: "Tailoring" },
  { value: "geography", label: "Geography" },
]

export function AnalyticsView() {
  const [loading, setLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<AnalyticsFilters>(DEFAULT_FILTERS)
  const [exportOpen, setExportOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  function handleFilterChange(key: keyof AnalyticsFilters, value: string | boolean) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleRefresh() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Analytics refreshed")
    }, 500)
  }

  const rangeLabel = DATE_RANGES.find((r) => r.value === filters.range)?.label ?? ""

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Business Analytics"
        description="Monitor revenue, customer behavior and business performance."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh} aria-label="Refresh analytics">
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Generating PDF report")}>
              <FileText className="size-4" /> Generate PDF
            </Button>
            <Button size="sm" onClick={() => setExportOpen(true)}>
              <Download className="size-4" /> Export Report
            </Button>
          </>
        }
      />

      <AnalyticsFilterBar filters={filters} onChange={handleFilterChange} />

      <section className="space-y-4">
        <SectionHeader
          title="Executive Summary"
          description={`Key metrics · ${rangeLabel}${filters.compare ? " · vs previous period" : ""}`}
        />
        <KpiGrid loading={loading} />
      </section>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-[340px] rounded-xl lg:col-span-2" />
            <Skeleton className="h-[340px] rounded-xl" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="gap-5">
          <div className="overflow-x-auto">
            <TabsList className="h-9">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                  {t.value === "overview" ? <SlidersHorizontal className="size-3.5" /> : null}
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab compare={filters.compare} />
          </TabsContent>
          <TabsContent value="revenue">
            <RevenueTab compare={filters.compare} />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>
          <TabsContent value="tailoring">
            <TailoringTab />
          </TabsContent>
          <TabsContent value="geography">
            <GeographyTab />
          </TabsContent>
        </Tabs>
      )}

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </PageContainer>
  )
}
