"use client"

import { EntityAvatar } from "@/components/shared/entity-avatar"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CustomerActions } from "@/features/customers/components/customer-actions"
import {
  RelationshipChips,
  VIPBadge,
} from "@/features/customers/components/customer-badges"
import { formatCompactCurrency, formatRelative } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { CustomerDetail } from "@/types"

interface CustomerCardProps {
  customer: CustomerDetail
  selected: boolean
  onSelectToggle: (id: string) => void
  onView: (customer: CustomerDetail) => void
  onArchive: (customer: CustomerDetail) => void
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-display text-base font-medium tabular">{value}</p>
      <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

export function CustomerCard({
  customer,
  selected,
  onSelectToggle,
  onView,
  onArchive,
}: CustomerCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onView(customer)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView(customer)
        }
      }}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group cursor-pointer gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "ring-2 ring-gold/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <EntityAvatar initials={customer.initials} seed={customer.id} className="size-11" />
          <Checkbox
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() => onSelectToggle(customer.id)}
            aria-label={`Select ${customer.name}`}
            className={cn(
              "absolute -top-1.5 -left-1.5 bg-card transition-opacity",
              !selected && "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">{customer.name}</span>
            <span title={customer.country}>{customer.flag}</span>
          </div>
          <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {customer.vip ? <VIPBadge tier={customer.tier} /> : null}
          <CustomerActions
            customer={customer}
            onView={onView}
            onArchive={onArchive}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Orders" value={String(customer.ordersCount)} />
        <Stat label="Lifetime" value={formatCompactCurrency(customer.lifetimeValue)} />
        <Stat
          label="Last order"
          value={customer.lastOrderAt ? formatRelative(customer.lastOrderAt) : "—"}
        />
      </div>

      <RelationshipChips customer={customer} />
    </Card>
  )
}
