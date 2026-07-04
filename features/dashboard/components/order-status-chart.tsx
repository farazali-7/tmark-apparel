"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { ChartCard } from "@/components/shared/chart-card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { orderStatusSlices } from "@/lib/mock-data/dashboard"

const chartConfig = {
  value: { label: "Orders" },
  delivered: { label: "Delivered", color: "var(--chart-1)" },
  shipped: { label: "Shipped", color: "var(--chart-2)" },
  tailoring: { label: "Tailoring", color: "var(--gold)" },
  confirmed: { label: "Confirmed", color: "var(--chart-3)" },
  pending: { label: "Pending", color: "var(--chart-4)" },
  cancelled: { label: "Cancelled", color: "var(--chart-5)" },
} satisfies ChartConfig

// Global tokens for legend swatches (rendered outside the chart's var scope).
const SWATCH: Record<string, string> = {
  delivered: "var(--chart-1)",
  shipped: "var(--chart-2)",
  tailoring: "var(--gold)",
  confirmed: "var(--chart-3)",
  pending: "var(--chart-4)",
  cancelled: "var(--chart-5)",
}

export function OrderStatusChart() {
  const total = React.useMemo(
    () => orderStatusSlices.reduce((sum, s) => sum + s.value, 0),
    []
  )

  return (
    <ChartCard title="Order Status" description="Distribution across the pipeline">
      <div className="flex flex-col items-center gap-4">
        <ChartContainer config={chartConfig} className="aspect-square h-[200px]">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="key" hideLabel />}
            />
            <Pie
              data={orderStatusSlices}
              dataKey="value"
              nameKey="key"
              innerRadius={62}
              outerRadius={90}
              strokeWidth={3}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-semibold tabular"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          total orders
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
          {orderStatusSlices.map((slice) => (
            <div key={slice.key} className="flex items-center gap-2 text-xs">
              <span
                className="size-2.5 shrink-0 rounded-[3px]"
                style={{ background: SWATCH[slice.key] }}
              />
              <span className="flex-1 truncate text-muted-foreground">
                {slice.label}
              </span>
              <span className="font-medium tabular">{slice.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  )
}
