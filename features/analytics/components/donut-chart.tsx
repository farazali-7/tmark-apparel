"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { DonutSlice } from "@/lib/mock-data/analytics"

interface DonutChartProps {
  data: DonutSlice[]
  centerValue: string
  centerLabel: string
  format?: (value: number) => string
  className?: string
}

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  format = (v) => v.toLocaleString(),
  className,
}: DonutChartProps) {
  const total = React.useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])

  const config = React.useMemo(() => {
    const c: ChartConfig = {}
    for (const slice of data) c[slice.key] = { label: slice.label, color: slice.color }
    return c
  }, [data])

  return (
    <div className={cn("flex flex-col items-center gap-4 sm:flex-row sm:gap-6", className)}>
      <ChartContainer config={config} className="aspect-square h-[168px] shrink-0">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="key" hideLabel formatter={(v) => format(Number(v))} />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="key"
            innerRadius={54}
            outerRadius={80}
            strokeWidth={3}
            paddingAngle={2}
          >
            {data.map((slice) => (
              <Cell key={slice.key} fill={slice.color} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-semibold tabular">
                        {centerValue}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-muted-foreground text-[0.7rem]">
                        {centerLabel}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className="w-full min-w-0 flex-1 space-y-2">
        {data.map((slice) => {
          const pct = total ? Math.round((slice.value / total) * 100) : 0
          return (
            <li key={slice.key} className="flex items-center gap-2.5 text-sm">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: slice.color }} />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{slice.label}</span>
              <span className="shrink-0 font-medium tabular">{format(slice.value)}</span>
              <span className="w-9 shrink-0 text-right text-xs text-muted-foreground tabular">{pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
