import { Ruler, StickyNote } from "lucide-react"

import { ProductThumb } from "@/components/shared/product-thumb"
import { cn } from "@/lib/utils"
import type { OrderMeasurements } from "@/types"

const FIELDS: { key: keyof OrderMeasurements; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "neck", label: "Neck" },
  { key: "inseam", label: "Inseam" },
  { key: "height", label: "Height" },
]

interface MeasurementCardProps {
  measurements: OrderMeasurements
  className?: string
}

export function MeasurementCard({ measurements, className }: MeasurementCardProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Ruler className="size-4 text-muted-foreground" />
        <h4 className="text-sm font-medium">Body Measurements</h4>
        <span className="text-xs text-muted-foreground">in inches</span>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="rounded-lg border bg-muted/20 p-3 text-center transition-colors hover:border-foreground/15"
          >
            <dd className="font-display text-xl font-medium tabular">
              {measurements[f.key] as number}
              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                &Prime;
              </span>
            </dd>
            <dt className="mt-0.5 text-[0.7rem] tracking-wide text-muted-foreground uppercase">
              {f.label}
            </dt>
          </div>
        ))}
      </dl>

      {measurements.notes ? (
        <div className="flex gap-2.5 rounded-lg border border-dashed bg-muted/20 p-3">
          <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{measurements.notes}</p>
        </div>
      ) : null}

      {measurements.referenceImages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Reference images
          </p>
          <div className="flex flex-wrap gap-2">
            {measurements.referenceImages.map((seed, i) => (
              <ProductThumb
                key={`${seed}-${i}`}
                seed={seed}
                name={`Reference ${i + 1}`}
                className="size-20"
                iconClassName="size-7"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
