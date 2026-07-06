import { Crown } from "lucide-react"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { formatCompactCurrency } from "@/lib/constants"
import type { TopCustomer } from "@/lib/mock-data/analytics"

export function TopCustomersList({ data }: { data: TopCustomer[] }) {
  return (
    <ul className="divide-y">
      {data.map((c, i) => (
        <li key={c.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="w-4 shrink-0 text-center text-xs text-muted-foreground tabular">{i + 1}</span>
          <EntityAvatar initials={c.initials} seed={c.id} className="size-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{c.name}</p>
              <span title={c.country}>{c.flag}</span>
              {c.vip ? <Crown className="size-3 text-gold" aria-label="VIP" /> : null}
            </div>
            <p className="text-xs text-muted-foreground tabular">{c.orders} orders</p>
          </div>
          <span className="text-sm font-medium tabular">{formatCompactCurrency(c.spend)}</span>
        </li>
      ))}
    </ul>
  )
}
