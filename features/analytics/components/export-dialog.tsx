"use client"

import * as React from "react"
import { toast } from "sonner"
import { FileSpreadsheet, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function ExportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [format, setFormat] = React.useState<"csv" | "pdf">("pdf")
  const [report, setReport] = React.useState("sales")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export report</DialogTitle>
          <DialogDescription>
            Download a snapshot of the current view for the selected period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Report</Label>
            <Select value={report} onValueChange={setReport}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales report</SelectItem>
                <SelectItem value="revenue">Revenue report</SelectItem>
                <SelectItem value="inventory">Inventory report</SelectItem>
                <SelectItem value="customer">Customer report</SelectItem>
                <SelectItem value="tailoring">Tailoring report</SelectItem>
                <SelectItem value="product">Product report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "pdf", label: "PDF", icon: FileText, hint: "Formatted document" },
                { id: "csv", label: "CSV", icon: FileSpreadsheet, hint: "Raw data" },
              ] as const).map((opt) => {
                const Icon = opt.icon
                const active = format === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormat(opt.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-3 text-left transition-colors",
                      active ? "border-gold/50 bg-accent" : "hover:border-foreground/20"
                    )}
                  >
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              toast.success(`${report} report exported`, {
                description: `Your ${format.toUpperCase()} is downloading.`,
              })
              onOpenChange(false)
            }}
          >
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
