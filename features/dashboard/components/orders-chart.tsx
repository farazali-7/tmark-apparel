"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartCard } from "@/components/shared/chart-card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ordersSeries } from "@/lib/mock-data/dashboard"

const chartConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

export function OrdersChart() {
  return (
    <ChartCard title="Orders" description="Placed per day this week">
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <BarChart data={ordersSeries} margin={{ left: 0, right: 4, top: 4 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-[0.7rem]"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
