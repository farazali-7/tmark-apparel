"use client"

import * as React from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ORDER_TYPE_META } from "@/lib/constants"
import type { OrderType } from "@/types"

interface CreateOrderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ORDER_TYPES = Object.keys(ORDER_TYPE_META) as OrderType[]

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function CreateOrderSheet({ open, onOpenChange }: CreateOrderSheetProps) {
  const [type, setType] = React.useState<OrderType>("ready_to_wear")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Manual order created", {
      description: "A draft order has been added and set to Pending.",
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
          <SheetTitle className="font-display text-xl font-medium">
            Create Manual Order
          </SheetTitle>
          <SheetDescription>
            Log a phone, walk-in or WhatsApp order. It will start as Pending in
            the pipeline.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex h-[calc(100%-8.5rem)] flex-col"
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer name" htmlFor="cust-name">
                <Input id="cust-name" placeholder="e.g. Ahsan Raza" required />
              </Field>
              <Field label="Phone" htmlFor="cust-phone">
                <Input id="cust-phone" placeholder="+92 300 0000000" required />
              </Field>
              <Field label="Email" htmlFor="cust-email">
                <Input id="cust-email" type="email" placeholder="name@email.com" />
              </Field>
              <Field label="Country" htmlFor="cust-country">
                <Input id="cust-country" placeholder="Pakistan" defaultValue="Pakistan" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Order type">
                <Select value={type} onValueChange={(v) => setType(v as OrderType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {ORDER_TYPE_META[t].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Priority">
                <Select defaultValue="standard">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product" htmlFor="prod-name">
                <Input id="prod-name" placeholder="e.g. Ivory Sherwani" required />
              </Field>
              <Field label="Amount (PKR)" htmlFor="prod-amount">
                <Input
                  id="prod-amount"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  className="tabular"
                  required
                />
              </Field>
            </div>

            {ORDER_TYPE_META[type].bespoke ? (
              <div className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
                Measurements &amp; fabric can be added from the order drawer once
                the customer visit is scheduled.
              </div>
            ) : null}

            <Field label="Internal note" htmlFor="note">
              <Textarea id="note" placeholder="Anything the team should know…" />
            </Field>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 border-t p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="size-4" /> Create order
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
