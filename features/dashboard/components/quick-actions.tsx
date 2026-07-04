"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  FileBarChart,
  FolderPlus,
  Image,
  PackagePlus,
  ShoppingCart,
} from "lucide-react"

import { QuickActionCard } from "@/components/shared/quick-action-card"

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <QuickActionCard
        icon={PackagePlus}
        label="Add Product"
        description="Create a new listing"
        onClick={() => router.push("/products")}
      />
      <QuickActionCard
        icon={FolderPlus}
        label="Create Category"
        description="Organize the catalog"
        onClick={() => toast.success("Category form ready")}
      />
      <QuickActionCard
        icon={Image}
        label="Create Banner"
        description="Promote a collection"
        onClick={() => toast.success("Banner form ready")}
      />
      <QuickActionCard
        icon={ShoppingCart}
        label="View Orders"
        description="Process the queue"
        onClick={() => toast("Orders module coming soon")}
      />
      <QuickActionCard
        icon={FileBarChart}
        label="Export Report"
        description="Download this month"
        onClick={() => toast.success("Report exported")}
      />
    </div>
  )
}
