"use client";

import { useState, useMemo, useEffect } from "react";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { getMockHistoricalData } from "@/lib/mock-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

type HistoricalData = {
  date: string;
  price: number;
  sma?: number | null;
  ema?: number | null;
};

const calculateSMA = (data: number[], period: number): (number | null)[] => {
  const sma: (number | null)[] = Array(period - 1).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    sma.push(parseFloat((sum / period).toFixed(2)));
  }
  return sma;
};

const calculateEMA = (data: number[], period: number): (number | null)[] => {
  const ema: (number | null)[] = [];
  const k = 2 / (period + 1);
  if (data.length > 0) {
    ema.push(data[0]);
    for (let i = 1; i < data.length; i++) {
      const nextEma = data[i] * k + ema[i - 1]! * (1 - k);
      ema.push(parseFloat(nextEma.toFixed(2)));
    }
  }
  return ema;
};

export function PriceChart() {
  const [chartData, setChartData] = useState<HistoricalData[]>([]);
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const rawData = getMockHistoricalData();
    const prices = rawData.map(d => d.price);
    const sma50 = calculateSMA(prices, 50);
    const ema20 = calculateEMA(prices, 20);

    const processedData = rawData.map((d, i) => ({
      ...d,
      sma: sma50[i],
      ema: ema20[i],
    }));

    setChartData(processedData);
    setLoading(false);
  }, []);

  const chartConfig = {
    price: {
      label: "Price",
    },
    sma: {
      label: "SMA (50)",
    },
    ema: {
      label: "EMA (20)",
    },
  };

  if (loading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-muted-foreground"
        >
          Loading chart data...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-2 justify-end">
        <Button 
          variant={showSMA ? "default" : "outline"} 
          size="sm" 
          onClick={() => setShowSMA(!showSMA)}
          className={showSMA 
            ? "rounded-lg border-none text-sm" 
            : "rounded-lg text-sm border-white/10 hover:border-primary/30 hover:bg-primary/5"
          }
          style={showSMA ? {
            background: 'linear-gradient(135deg, hsl(var(--chart-4)), hsl(var(--primary)))',
            boxShadow: '0 0 12px hsl(var(--chart-4) / 0.3)',
          } : {}}
        >
          SMA
        </Button>
        <Button 
          variant={showEMA ? "default" : "outline"} 
          size="sm" 
          onClick={() => setShowEMA(!showEMA)}
          className={showEMA 
            ? "rounded-lg border-none text-sm" 
            : "rounded-lg text-sm border-white/10 hover:border-primary/30 hover:bg-primary/5"
          }
          style={showEMA ? {
            background: 'linear-gradient(135deg, hsl(var(--chart-5)), hsl(var(--neon-cyan)))',
            boxShadow: '0 0 12px hsl(var(--chart-5) / 0.3)',
          } : {}}
        >
          EMA
        </Button>
      </div>
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="50%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              style={{ fontSize: '11px' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 20', 'dataMax + 20']}
              tickFormatter={(value) => `${value}`}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={{ stroke: 'hsl(var(--neon-cyan))', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              dot={false}
              activeDot={{
                r: 5,
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--neon-cyan))',
                strokeWidth: 2,
              }}
            />
            {showSMA && <Line type="monotone" dataKey="sma" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} strokeDasharray="5 5" />}
            {showEMA && <Line type="monotone" dataKey="ema" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />}
          </AreaChart>
        </ChartContainer>
      </div>
      <Accordion type="single" collapsible className="w-full mt-4">
        <AccordionItem value="item-1" className="border-white/5">
            <AccordionTrigger className="text-sm hover:text-primary transition-colors">How do these indicators work?</AccordionTrigger>
            <AccordionContent className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Technical indicators like SMA and EMA are used by traders to better understand price trends and forecast where the price might go next. They are calculated using the stock's past prices.</p>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">SMA (Simple Moving Average)</h4>
                    <p>The SMA (we use a 50-day period) calculates the average price of a stock over the last 50 days. It smooths out short-term price noise and helps you see the underlying trend. If the current price is above the SMA line, it's often seen as a bullish (positive) signal. If it's below, it can be a bearish (negative) signal.</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-1">EMA (Exponential Moving Average)</h4>
                    <p>The EMA (we use a 20-day period) is another type of moving average. However, it gives more importance to the most recent prices. This makes it react more quickly to new information than the SMA. Traders use the EMA to spot potential trend changes sooner.</p>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    </motion.div>
  );
}
