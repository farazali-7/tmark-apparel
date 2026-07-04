import { Truck } from "lucide-react"

import { ChartCard } from "@/components/shared/chart-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { ORDER_STATUS_META } from "@/lib/constants"
import { deliveries } from "@/lib/mock-data/dashboard"

export function UpcomingDeliveries() {
  return (
    <ChartCard title="Upcoming Deliveries" description="Scheduled dispatches & fittings">
      <ul className="space-y-3">
        {deliveries.map((delivery) => (
          <li
            key={delivery.id}
            className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
              <Truck className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {delivery.reference}
                <span className="ml-2 font-normal text-muted-foreground">
                  {delivery.customerName}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {delivery.courier}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge
                label={ORDER_STATUS_META[delivery.status].label}
                tone={ORDER_STATUS_META[delivery.status].tone}
              />
              <span className="text-xs font-medium text-muted-foreground tabular">
                ETA {delivery.eta}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
