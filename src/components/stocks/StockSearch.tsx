"use client";

import { useState, useMemo, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import type { Stock } from '@/lib/mock-data';

interface StockSearchProps {
  stocks: Stock[];
  selectedStock: Stock | null;
  onStockSelect: (stock: Stock) => void;
}

export function StockSearch({ stocks, selectedStock, onStockSelect }: StockSearchProps) {
  const [query, setQuery] = useState('');

  const filteredStocks = useMemo(() => {
    if (!query) return stocks.slice(0, 10);
    return stocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }, [query, stocks]);

  useEffect(() => {
    if (selectedStock) {
        setQuery(`${selectedStock.symbol} - ${selectedStock.name}`);
    }
  }, [selectedStock]);


  return (
    <div className="w-full max-w-2xl mx-auto">
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search for a stock (e.g., AAPL)"
        />
        <CommandList>
          {filteredStocks.length > 0 ? (
            <CommandGroup>
              {filteredStocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} - ${stock.name}`}
                  onSelect={() => {
                    onStockSelect(stock);
                    setQuery(`${stock.symbol} - ${stock.name}`);
                  }}
                >
                  <span className="font-medium mr-2">{stock.symbol}</span>
                  <span className="text-muted-foreground">{stock.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
