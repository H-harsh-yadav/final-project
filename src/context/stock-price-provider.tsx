'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockStocks, mockIndianStocks } from '@/lib/mock-data';

interface StockPrice {
  price: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'same';
}

type StockPriceContextType = {
  prices: Record<string, StockPrice>;
};

const StockPriceContext = createContext<StockPriceContextType | undefined>(undefined);

export function StockPriceProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<Record<string, StockPrice>>(() => {
    const initialPrices: Record<string, StockPrice> = {};
    const allStocks = [...mockStocks, ...mockIndianStocks];
    allStocks.forEach(stock => {
      initialPrices[stock.symbol] = {
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        direction: 'same'
      };
    });
    return initialPrices;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(currentPrices => {
        const newPrices = { ...currentPrices };
        const allStocks = [...mockStocks, ...mockIndianStocks];
        for (const symbol in newPrices) {
          const oldPriceData = newPrices[symbol];
          const stock = allStocks.find(s => s.symbol === symbol);
          if (!stock) continue;

          // Fluctuate price
          const fluctuation = (Math.random() - 0.49) * (oldPriceData.price * 0.005); // Fluctuate by up to 0.5%
          const newPrice = oldPriceData.price + fluctuation;

          // Recalculate change from original base price
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;
          
          let direction: 'up' | 'down' | 'same' = 'same';
          if (fluctuation > 0.001) direction = 'up';
          if (fluctuation < -0.001) direction = 'down';

          newPrices[symbol] = {
            price: newPrice,
            change: change,
            changePercent: changePercent,
            direction: direction
          };
        }
        return newPrices;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <StockPriceContext.Provider value={{ prices }}>
      {children}
    </StockPriceContext.Provider>
  );
}

export function useStockPrices() {
  const context = useContext(StockPriceContext);
  if (context === undefined) {
    throw new Error('useStockPrices must be used within a StockPriceProvider');
  }
  return context;
}
