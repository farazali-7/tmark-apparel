"use client"

import { toast } from "sonner"
import {
  Ban,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  MessageCircle,
  MoreHorizontal,
  Printer,
  Scissors,
  Truck,
  Undo2,
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
import type { OrderDetail } from "@/types"

interface OrderActionsProps {
  order: OrderDetail
  onView: (order: OrderDetail) => void
  onCancel: (order: OrderDetail) => void
  triggerClassName?: string
}

export function OrderActions({
  order,
  onView,
  onCancel,
  triggerClassName,
}: OrderActionsProps) {
  const canConfirm = order.stage === "pending"
  const canShip = order.stage === "ready" || order.stage === "packed"
  const isClosed =
    order.stage === "delivered" ||
    order.stage === "cancelled" ||
    order.stage === "refunded"

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
          <span className="sr-only">Open actions for {order.reference}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onView(order)}>
          <Eye /> View details
        </DropdownMenuItem>
        {canConfirm ? (
          <DropdownMenuItem
            onSelect={() => toast.success(`${order.reference} confirmed`)}
          >
            <CheckCircle2 /> Confirm order
          </DropdownMenuItem>
        ) : null}
        {order.type !== "ready_to_wear" && !isClosed ? (
          <DropdownMenuItem
            onSelect={() => toast.success(`Assign tailor to ${order.reference}`)}
          >
            <Scissors /> Assign tailor
          </DropdownMenuItem>
        ) : null}
        {canShip ? (
          <DropdownMenuItem
            onSelect={() => toast.success(`${order.reference} marked as shipped`)}
          >
            <Truck /> Mark as shipped
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => toast.success(`Invoice for ${order.reference} sent to printer`)}
        >
          <Printer /> Print invoice
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`WhatsApp opened for ${order.customer.name}`)}
        >
          <MessageCircle /> Send WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Order ${order.reference} duplicated`)}
        >
          <Copy /> Duplicate order
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.success(`Downloading PDF for ${order.reference}`)}
        >
          <FileText /> Download PDF
        </DropdownMenuItem>

        {!isClosed ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => toast(`Refund requested for ${order.reference}`)}
            >
              <Undo2 /> Refund
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => onCancel(order)}>
              <Ban /> Cancel order
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
