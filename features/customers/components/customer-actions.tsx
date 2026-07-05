"use client"

import { toast } from "sonner"
import {
  Archive,
  Crown,
  Eye,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Printer,
  Ruler,
  StickyNote,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { CustomerDetail } from "@/types"

interface CustomerActionsProps {
  customer: CustomerDetail
  onView: (customer: CustomerDetail) => void
  onArchive: (customer: CustomerDetail) => void
  triggerClassName?: string
}

export function CustomerActions({
  customer,
  onView,
  onArchive,
  triggerClassName,
}: CustomerActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "text-muted-foreground data-[state=open]:bg-muted",
            triggerClassName
          )}
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions for {customer.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onView(customer)}>
          <Eye /> View profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`New order for ${customer.name}`)}
        >
          <Plus /> Create order
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Editing measurements for ${customer.name}`)}
        >
          <Ruler /> Edit measurements
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => toast.success(`WhatsApp opened for ${customer.name}`)}
        >
          <MessageCircle /> Send WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Email drafted to ${customer.name}`)}
        >
          <Mail /> Send email
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Measurements sent to printer`)}
        >
          <Printer /> Print measurements
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Internal note added")}>
          <StickyNote /> Add note
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() =>
            toast.success(
              customer.vip ? "Removed VIP status" : `${customer.name} marked VIP`
            )
          }
        >
          <Crown /> {customer.vip ? "Remove VIP" : "Mark VIP"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={() => onArchive(customer)}>
          <Archive /> Archive customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
