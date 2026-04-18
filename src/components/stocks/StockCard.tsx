'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "../ui/checkbox";
import type { Stock } from "@/lib/mock-data";
import { useStockPrices } from "@/context/stock-price-provider";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface StockCardProps {
    stock: Stock;
    handleStockSelect: (stock: Stock) => void;
    handleCompareSelect: (stock: Stock, isSelected: boolean) => void;
    isSelectedForCompare: boolean;
}

export function StockCard({ stock, handleStockSelect, handleCompareSelect, isSelectedForCompare }: StockCardProps) {
    const { prices } = useStockPrices();
    const livePriceData = prices[stock.symbol];

    if (!livePriceData) {
        return (
             <Card className="bg-card/50 h-full">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                        <CardTitle className="text-lg font-medium">{stock.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate pt-1">{stock.name}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-24 mt-2" />
                    <Skeleton className="h-4 w-20 mt-1" />
                </CardContent>
             </Card>
        )
    }
    
    const priceColor = livePriceData.change >= 0 ? 'text-green-500' : 'text-red-500';

    return (
        <div className="relative">
            <div className="absolute top-2 right-2 z-10">
                <Checkbox
                    id={`compare-${stock.symbol}`}
                    checked={isSelectedForCompare}
                    onCheckedChange={(checked) => handleCompareSelect(stock, !!checked)}
                />
            </div>
            <Card className="hover:border-primary transition-colors cursor-pointer bg-card/50 h-full" onClick={() => handleStockSelect(stock)}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                        <CardTitle className="text-lg font-medium">{stock.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate pt-1">{stock.name}</p>
                    </div>
                    <div className={cn('text-base font-bold', priceColor)}>
                        {livePriceData.change >= 0 ? '▲' : '▼'}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mt-2">{livePriceData.price.toFixed(2)}</div>
                    <p className={cn("text-xs", priceColor)}>
                        {livePriceData.change >= 0 ? '+' : ''}{livePriceData.change.toFixed(2)} ({livePriceData.changePercent.toFixed(2)}%)
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
