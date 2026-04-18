"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import type { Stock } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { collection, doc, Timestamp } from "firebase/firestore";

const formSchema = z.object({
  shares: z.coerce.number().positive({ message: "Shares must be positive." }),
  purchasePrice: z.coerce.number().positive({ message: "Price must be positive." }),
});

export type PortfolioItem = {
  id?: string;
  userId: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: Timestamp;
};

interface AddStockDialogProps {
  stock: Stock;
  portfolioItem?: PortfolioItem;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave?: (values: { shares: number; purchasePrice: number }) => void;
}

export function AddStockDialog({ stock, portfolioItem, isOpen, setIsOpen, onSave }: AddStockDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shares: portfolioItem?.shares || 0,
      purchasePrice: portfolioItem?.purchasePrice || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Not authenticated" });
        return;
    }
    setIsLoading(true);
    try {
        if (portfolioItem && portfolioItem.id) {
            const itemRef = doc(firestore, `users/${user.uid}/portfolio`, portfolioItem.id);
            updateDocumentNonBlocking(itemRef, {
                shares: values.shares,
                purchasePrice: values.purchasePrice
            });
            toast({ title: "Success", description: `${stock.name} has been updated in your portfolio.` });
        } else {
            const portfolioColRef = collection(firestore, `users/${user.uid}/portfolio`);
            addDocumentNonBlocking(portfolioColRef, {
                userId: user.uid,
                symbol: stock.symbol,
                name: stock.name,
                shares: values.shares,
                purchasePrice: values.purchasePrice,
                purchaseDate: Timestamp.now(),
            });
            toast({ title: "Success", description: `${stock.name} has been added to your portfolio.` });
        }
        form.reset();
        setIsOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
        setIsLoading(false);
    }
  }

  const title = portfolioItem ? `Edit ${stock.symbol}` : `Add ${stock.symbol} to Portfolio`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the details of your position in {stock.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shares</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 10.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Purchase Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 150.25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {portfolioItem ? 'Save Changes' : 'Add to Portfolio'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
