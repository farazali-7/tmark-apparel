"use client"

import { toast } from "sonner"
import {
  Boxes,
  CircleDollarSign,
  Download,
  FileText,
  Scissors,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"

interface ReportDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

const REPORTS: ReportDef[] = [
  { id: "sales", title: "Sales Report", description: "Orders, units and revenue by day", icon: ShoppingBag },
  { id: "revenue", title: "Revenue Report", description: "Revenue by category, collection & country", icon: CircleDollarSign },
  { id: "inventory", title: "Inventory Report", description: "Stock levels and low-stock alerts", icon: Boxes },
  { id: "customer", title: "Customer Report", description: "New, returning and top-spending clients", icon: Users },
  { id: "tailoring", title: "Tailoring Report", description: "Custom orders, fabrics and completion times", icon: Scissors },
  { id: "product", title: "Product Report", description: "Best sellers and no-sales products", icon: FileText },
]

export function ReportsPanel() {
  return (
    <section className="space-y-4">
      <SectionHeader
        title="Quick Reports"
        description="Generate a formatted export for any part of the business"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((report) => {
          const Icon = report.icon
          return (
            <div
              key={report.id}
              className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{report.title}</p>
                <p className="text-xs text-muted-foreground">{report.description}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => toast.success(`${report.title} — CSV downloading`)}
                  >
                    <Download className="size-3" /> CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => toast.success(`${report.title} — PDF downloading`)}
                  >
                    <Download className="size-3" /> PDF
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
