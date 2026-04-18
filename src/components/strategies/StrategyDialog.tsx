"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Timestamp, collection, doc } from "firebase/firestore";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export type Strategy = {
  id?: string;
  userId: string;
  title: string;
  description: string;
  createdAt: Timestamp;
};

interface StrategyDialogProps {
  strategy?: Strategy;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: (strategy: Strategy) => void;
}

export function StrategyDialog({ strategy, isOpen, setIsOpen, onSuccess }: StrategyDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: strategy?.title || "",
      description: strategy?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({ variant: "destructive", title: "Not authenticated" });
      return;
    }
    setIsLoading(true);
    try {
      if (strategy && strategy.id) {
        const strategyRef = doc(firestore, `users/${user.uid}/strategies`, strategy.id);
        updateDocumentNonBlocking(strategyRef, {
            title: values.title,
            description: values.description,
        });
        toast({ title: "Success", description: "Your strategy has been updated." });
      } else {
        const strategiesColRef = collection(firestore, `users/${user.uid}/strategies`);
        addDocumentNonBlocking(strategiesColRef, {
          userId: user.uid,
          title: values.title,
          description: values.description,
          createdAt: Timestamp.now(),
        });
        toast({ title: "Success", description: "Your new strategy has been created." });
      }
      form.reset({ title: '', description: '' });
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  }

  const title = strategy ? "Edit Strategy" : "Create New Strategy";
  const description = strategy ? "Make changes to your existing strategy." : "Define a new investment strategy.";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Long-term Growth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your strategy, goals, and risk tolerance..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {strategy ? 'Save Changes' : 'Create Strategy'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
