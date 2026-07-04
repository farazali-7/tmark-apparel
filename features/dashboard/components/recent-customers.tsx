import { ArrowUpRight } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { EntityAvatar } from "@/components/shared/entity-avatar"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatRelative } from "@/lib/constants"
import { customers } from "@/lib/mock-data/customers"

export function RecentCustomers() {
  return (
    <ChartCard
      title="Latest Customers"
      description="Newest accounts created"
      action={
        <Button variant="ghost" size="sm">
          View all <ArrowUpRight className="size-3.5" />
        </Button>
      }
    >
      <ul className="divide-y">
        {customers.slice(0, 5).map((customer) => (
          <li
            key={customer.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <EntityAvatar
              initials={customer.initials}
              seed={customer.name}
              className="size-9"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{customer.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {customer.location} · joined {formatRelative(customer.joinedAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium tabular">
                {formatCurrency(customer.totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground tabular">
                {customer.orders} orders
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
