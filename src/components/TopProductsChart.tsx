import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductSales {
  product_name: string;
  quantity: number;
  revenue: number;
}

export const TopProductsChart = () => {
  const [chartData, setChartData] = useState<ProductSales[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setIsLoading(true);

      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select("product_name, price, quantity");

      if (error) throw error;

      // Agrupar por nome de produto
      const productMap = new Map<string, { quantity: number; revenue: number }>();

      orderItems?.forEach((item) => {
        const name = item.product_name;
        const quantity = item.quantity;
        const revenue = Number(item.price) * item.quantity;

        if (productMap.has(name)) {
          const existing = productMap.get(name)!;
          productMap.set(name, {
            quantity: existing.quantity + quantity,
            revenue: existing.revenue + revenue,
          });
        } else {
          productMap.set(name, { quantity, revenue });
        }
      });

      // Converter para array
      const data = Array.from(productMap.entries()).map(([product_name, stats]) => ({
        product_name,
        quantity: stats.quantity,
        revenue: stats.revenue,
      }));

      setChartData(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
      toast.error("Erro ao carregar produtos mais vendidos");
    } finally {
      setIsLoading(false);
    }
  };

  const topByQuantity = [...chartData]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const topByRevenue = [...chartData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const chartConfig = {
    quantity: {
      label: "Quantidade",
      color: "hsl(var(--secondary))",
    },
    revenue: {
      label: "Receita",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top 10 Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
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
          <CardTitle className="text-lg font-semibold">Top 10 Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top 10 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quantity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="quantity">Por Quantidade</TabsTrigger>
            <TabsTrigger value="revenue">Por Receita</TabsTrigger>
          </TabsList>

          <TabsContent value="quantity">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart data={topByQuantity} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="product_name"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "quantity") {
                          return `${value} unidades`;
                        }
                        return value;
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="quantity"
                  fill="hsl(var(--secondary))"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="revenue">
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart data={topByRevenue} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="product_name"
                  tick={{ fontSize: 12 }}
                  width={100}
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
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
