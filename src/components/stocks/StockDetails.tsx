import type { Stock } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceChart } from './PriceChart';
import { AiAnalysis } from './AiAnalysis';
import { Button } from '../ui/button';
import { useUser } from '@/firebase';
import { useState } from 'react';
import { AddStockDialog } from '../portfolio/AddStockDialog';
import { PlusCircle } from 'lucide-react';
import { useStockPrices } from '@/context/stock-price-provider';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface StockDetailsProps {
  stock: Stock;
}

export function StockDetails({ stock }: StockDetailsProps) {
  const { user } = useUser();
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const { prices } = useStockPrices();
  const livePriceData = prices[stock.symbol];

  const details = [
    { label: 'Symbol', value: stock.symbol },
    { label: 'Exchange', value: stock.exchange },
    { label: 'Market Cap', value: stock.marketCap },
    { label: 'P/E Ratio', value: stock.peRatio ?? 'N/A' },
    { label: 'Dividend Yield', value: stock.dividendYield ? `${stock.dividendYield}%` : 'N/A' },
    { label: 'Analyst Consensus', value: stock.analystConsensus, isBadge: true },
  ];

  const getBadgeVariant = (consensus: string) => {
    switch (consensus) {
      case 'Buy':
        return 'default';
      case 'Hold':
        return 'secondary';
      case 'Sell':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{stock.name} ({stock.symbol})</h2>
            {livePriceData ? (
                <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-3xl font-bold">{livePriceData.price.toFixed(2)}</p>
                    <p className={cn(
                        "text-lg font-medium",
                        livePriceData.change >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                        {livePriceData.change >= 0 ? '▲' : '▼'} {livePriceData.change.toFixed(2)} ({livePriceData.changePercent.toFixed(2)}%)
                    </p>
                </div>
            ) : (
                <Skeleton className="h-10 w-48 mt-2" />
            )}
        </div>
        {user && (
          <>
            <Button onClick={() => setIsAddStockDialogOpen(true)} className='mt-4 md:mt-0'>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Portfolio
            </Button>
            <AddStockDialog
              stock={stock}
              isOpen={isAddStockDialogOpen}
              setIsOpen={setIsAddStockDialogOpen}
            />
          </>
        )}
      </div>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart />
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {details.map((detail) => (
            <div key={detail.label} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{detail.label}</span>
              {detail.isBadge ? (
                <Badge variant={getBadgeVariant(detail.value as string)}>{detail.value}</Badge>
              ) : (
                <span className="font-medium">{detail.value}</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <AiAnalysis stock={stock} />
      </div>
    </div>
  );
}
