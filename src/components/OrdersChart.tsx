import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrdersChartProps {
  orders: Order[];
}

export const OrdersChart = ({ orders }: OrdersChartProps) => {
  // Agrupa pedidos por dia
  const getChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i));
      return {
        date: format(date, "yyyy-MM-dd"),
        displayDate: format(date, "dd/MM", { locale: ptBR }),
        count: 0,
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const orderDate = format(startOfDay(parseISO(order.created_at)), "yyyy-MM-dd");
      const dayData = last30Days.find((day) => day.date === orderDate);
      if (dayData) {
        dayData.count += 1;
        dayData.revenue += Number(order.total_amount);
      }
    });

    return last30Days;
  };

  const chartData = getChartData();

  const chartConfig = {
    count: {
      label: "Pedidos",
      color: "hsl(var(--primary))",
    },
    revenue: {
      label: "Receita",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Evolução de Pedidos - Últimos 30 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return `R$ ${Number(value).toFixed(2)}`;
                    }
                    return value;
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorCount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
