import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoryData {
  category: string;
  revenue: number;
  orders: number;
}

export const RevenueByCategoryChart = () => {
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryRevenue();
  }, []);

  const fetchCategoryRevenue = async () => {
    try {
      setIsLoading(true);
      
      // Buscar order_items com informações do produto
      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select(`
          price,
          quantity,
          product_id,
          products (
            category
          )
        `);

      if (error) throw error;

      // Agrupar por categoria
      const categoryMap = new Map<string, { revenue: number; orders: number }>();

      orderItems?.forEach((item: any) => {
        const category = item.products?.category || "Sem categoria";
        const revenue = Number(item.price) * item.quantity;
        
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)!;
          categoryMap.set(category, {
            revenue: existing.revenue + revenue,
            orders: existing.orders + 1,
          });
        } else {
          categoryMap.set(category, { revenue, orders: 1 });
        }
      });

      // Converter para array e ordenar por receita
      const data = Array.from(categoryMap.entries())
        .map(([category, stats]) => ({
          category,
          revenue: stats.revenue,
          orders: stats.orders,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      setChartData(data);
    } catch (error) {
      console.error("Error fetching category revenue:", error);
      toast.error("Erro ao carregar receita por categoria");
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    revenue: {
      label: "Receita",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Receita por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Receita por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Receita por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="category"
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
                  formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
