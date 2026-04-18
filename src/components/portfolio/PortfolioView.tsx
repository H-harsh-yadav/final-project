"use client";

import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { AddStockDialog, type PortfolioItem } from "./AddStockDialog";
import { mockStocks } from "@/lib/mock-data";
import { collection, doc } from "firebase/firestore";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useStockPrices } from "@/context/stock-price-provider";

export default function PortfolioView() {
  const { user, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const { prices } = useStockPrices();

  const portfolioQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/portfolio`);
  }, [firestore, user]);

  const { data: portfolio, isLoading: portfolioLoading } = useCollection<PortfolioItem>(portfolioQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    const itemRef = doc(firestore, `users/${user.uid}/portfolio`, id);
    deleteDocumentNonBlocking(itemRef);
  };
  
  const portfolioWithLiveData = portfolio?.map(item => {
    const currentPrice = prices[item.symbol]?.price ?? 0;
    const marketValue = item.shares * currentPrice;
    const gainLoss = marketValue - (item.shares * item.purchasePrice);
    return {
      ...item,
      currentPrice,
      marketValue,
      gainLoss,
    };
  });

  const totalMarketValue = portfolioWithLiveData?.reduce((acc, item) => acc + item.marketValue, 0) || 0;
  const totalCostBasis = portfolio?.reduce((acc, item) => acc + (item.shares * item.purchasePrice), 0) || 0;
  const totalGainLoss = totalMarketValue - totalCostBasis;
  const stocksInLoss = portfolioWithLiveData?.filter(item => item.gainLoss < 0);
  
  if (authLoading || portfolioLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!user) {
    return null; // or a login prompt
  }

  return (
    <>
      {stocksInLoss && stocksInLoss.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Portfolio Alert</AlertTitle>
          <AlertDescription>
            You have {stocksInLoss.length} stock(s) currently at a loss: {stocksInLoss.map(s => s.symbol).join(', ')}.
          </AlertDescription>
        </Alert>
      )}
      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20 border-b border-white/5">
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Total Gain/Loss</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioWithLiveData && portfolioWithLiveData.length > 0 ? (
              portfolioWithLiveData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-sm text-muted-foreground">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.shares}</TableCell>
                    <TableCell className="text-right">{item.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.marketValue.toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-medium ${item.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.gainLoss.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingItem(item)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id!)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Your portfolio is empty.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="font-bold">Totals</TableCell>
              <TableCell className="text-right font-bold">{totalMarketValue.toFixed(2)}</TableCell>
              <TableCell className={`text-right font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalGainLoss.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {editingItem && (
        <AddStockDialog
            isOpen={!!editingItem}
            setIsOpen={() => setEditingItem(null)}
            stock={mockStocks.find(s => s.symbol === editingItem.symbol)!}
            portfolioItem={editingItem}
        />
      )}
    </>
  );
}
