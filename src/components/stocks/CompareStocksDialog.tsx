"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Stock } from "@/lib/mock-data";

interface CompareStocksDialogProps {
  stocks: Stock[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function CompareStocksDialog({ stocks, isOpen, setIsOpen }: CompareStocksDialogProps) {
  const details = [
    { label: 'Market Cap', key: 'marketCap' },
    { label: 'P/E Ratio', key: 'peRatio' },
    { label: 'Dividend Yield', key: 'dividendYield' },
    { label: 'Analyst Consensus', key: 'analystConsensus' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Stocks</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of selected stocks.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                {stocks.map(stock => (
                  <TableHead key={stock.symbol} className="text-right">{stock.symbol}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map(detail => (
                <TableRow key={detail.key}>
                  <TableCell className="font-medium">{detail.label}</TableCell>
                  {stocks.map(stock => (
                    <TableCell key={stock.symbol} className="text-right">
                      {stock[detail.key as keyof Stock] ? String(stock[detail.key as keyof Stock]) + (detail.key === 'dividendYield' ? '%' : '') : 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
