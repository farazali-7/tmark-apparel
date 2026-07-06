"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RevenuePoint } from "@/lib/mock-data/analytics"

const config: ChartConfig = {
  revenue: { label: "This period", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--chart-4)" },
}

export function RevenueTrendChart({
  data,
  compare = true,
  height = 300,
}: {
  data: RevenuePoint[]
  compare?: boolean
  height?: number
}) {
  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 4 }}>
        <defs>
          <linearGradient id="fillRevenueTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} className="text-[0.7rem]" />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          className="text-[0.7rem]"
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value, name) => [
                `PKR ${Number(value).toLocaleString()}`,
                name === "revenue" ? " This period" : " Previous",
              ]}
            />
          }
        />
        {compare ? (
          <Area
            dataKey="previous"
            type="monotone"
            stroke="var(--color-previous)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />
        ) : null}
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#fillRevenueTrend)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
