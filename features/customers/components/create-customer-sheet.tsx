"use client"

import * as React from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CUSTOMER_FIT_META } from "@/lib/constants"
import type { CustomerFit } from "@/types"

interface CreateCustomerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FITS = Object.keys(CUSTOMER_FIT_META) as CustomerFit[]

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

export function CreateCustomerSheet({
  open,
  onOpenChange,
}: CreateCustomerSheetProps) {
  const [vip, setVip] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Customer created", {
      description: "The new profile is ready — you can add measurements next.",
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-4 pr-14 sm:p-5 sm:pr-14">
          <SheetTitle className="font-display text-xl font-medium">
            Create Customer
          </SheetTitle>
          <SheetDescription>
            Add a new client to the CRM. Measurements and addresses can be added
            from their profile.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex h-[calc(100%-8.5rem)] flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="c-name">
                <Input id="c-name" placeholder="e.g. Ahsan Raza" required />
              </Field>
              <Field label="Phone" htmlFor="c-phone">
                <Input id="c-phone" placeholder="+92 300 0000000" required />
              </Field>
              <Field label="Email" htmlFor="c-email">
                <Input id="c-email" type="email" placeholder="name@email.com" />
              </Field>
              <Field label="City" htmlFor="c-city">
                <Input id="c-city" placeholder="Lahore" />
              </Field>
              <Field label="Country" htmlFor="c-country">
                <Input id="c-country" placeholder="Pakistan" defaultValue="Pakistan" />
              </Field>
              <Field label="Preferred fit">
                <Select defaultValue="regular">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FITS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {CUSTOMER_FIT_META[f].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Mark as VIP</p>
                <p className="text-xs text-muted-foreground">
                  Grants priority tailoring & concierge care.
                </p>
              </div>
              <Switch checked={vip} onCheckedChange={setVip} aria-label="Mark as VIP" />
            </div>

            <Field label="Internal note" htmlFor="c-note">
              <Textarea id="c-note" placeholder="Anything the team should know…" />
            </Field>
          </div>

          <SheetFooter className="flex-row justify-end gap-2 border-t p-4 sm:p-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus className="size-4" /> Create customer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
