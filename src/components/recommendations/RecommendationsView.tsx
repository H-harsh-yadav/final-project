"use client";

import { useMemo, useState } from 'react';
import { mockStocks, mockIndianStocks, type Stock } from '@/lib/mock-data';
import { StockCard } from '@/components/stocks/StockCard';
import { useRouter } from 'next/navigation';

export default function RecommendationsView() {
    const recommendedStocks = useMemo(() => 
        [...mockStocks, ...mockIndianStocks].filter(stock => stock.analystConsensus === 'Buy')
    , []);
    
    const [stocksToCompare, setStocksToCompare] = useState<Stock[]>([]);
    const router = useRouter();

    const handleStockSelect = (stock: Stock) => {
        // In a real app, you might navigate to a detailed stock page
        // For now, we'll keep it simple.
        console.log("Selected stock:", stock.symbol);
    };

    const handleCompareSelect = (stock: Stock, isSelected: boolean) => {
        if (isSelected) {
            setStocksToCompare([...stocksToCompare, stock]);
        } else {
            setStocksToCompare(stocksToCompare.filter(s => s.symbol !== stock.symbol));
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedStocks.map((stock) => (
                <StockCard 
                    key={stock.symbol}
                    stock={stock}
                    handleStockSelect={handleStockSelect}
                    handleCompareSelect={handleCompareSelect}
                    isSelectedForCompare={stocksToCompare.some(s => s.symbol === stock.symbol)}
                />
            ))}
        </div>
    );
}
