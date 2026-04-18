"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Pencil, Trash2, ShieldCheck, Zap, LineChart, Globe, DownloadCloud } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { StrategyDialog, type Strategy } from "./StrategyDialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { collection, doc, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const EXPERT_STRATEGIES = [
  {
    title: "CAN SLIM (Momentum)",
    author: "William J. O'Neil",
    type: "Growth / Momentum",
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    description: "A legendary techno-fundamental framework analyzing Current earnings, Annual growth, New products, Supply, Leadership, Institutional sponsorship, and Market direction.",
    action: "Look for stocks making 52-week highs with massive volume breakouts and EPS growth > 25%."
  },
  {
    title: "Value & Moats",
    author: "Warren Buffett",
    type: "Long-term Value",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    description: "Focusing strictly on companies possessing durable competitive advantages (moats) that are trading significantly below their conservatively calculated intrinsic value.",
    action: "Screen for long-term debt < 5x earnings, strong ROIC (>15%), and highly stable free cash flows."
  },
  {
    title: "Dogs of the Dow",
    author: "Michael O'Higgins",
    type: "Dividend Yield",
    icon: <LineChart className="w-5 h-5 text-blue-500" />,
    description: "An incredibly simple dividend strategy that requires buying the top 10 highest dividend-yielding stocks of the Dow Jones Industrial Average at the start of each year.",
    action: "Buy and automatically hold the 10 highest yielding Dow stocks annually, rebalancing every January."
  },
  {
    title: "Mean Reversion",
    author: "Algorithmic Quants",
    type: "Statistical Arbitrage",
    icon: <Globe className="w-5 h-5 text-purple-500" />,
    description: "The mathematical theory that asset prices eventually inevitably return to their long-term historical average. Traders profit from the bounce after extreme emotional deviations.",
    action: "Identify RSI < 25 or a price heavily decoupled far below the 200-day moving average, betting on a snap-back."
  }
];

export default function StrategiesView() {
  const { user, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const strategiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/strategies`);
  }, [firestore, user]);

  const { data: strategies, isLoading: strategiesLoading } = useCollection<Strategy>(strategiesQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    const strategyRef = doc(firestore, `users/${user.uid}/strategies`, id);
    deleteDocumentNonBlocking(strategyRef);
  };

  const copyExpertStrategy = async (expertStrat: any) => {
    if (!user || !firestore) return;
    setIsCloning(true);
    try {
        const strategiesColRef = collection(firestore, `users/${user.uid}/strategies`);
        await addDocumentNonBlocking(strategiesColRef, {
            userId: user.uid,
            title: expertStrat.title,
            description: `Expert Framework by ${expertStrat.author}: ${expertStrat.description}\n\nExecution:\n${expertStrat.action}\n\nMy Notes:\n- `,
            createdAt: Timestamp.now(),
        });
        toast({ title: "Strategy Adopted", description: `You have successfully added ${expertStrat.title} to your plans.` });
    } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to adopt strategy." });
    } finally {
        setIsCloning(false);
    }
  };
  
  if (authLoading || strategiesLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }
  
  if (!user) {
    return null;
  }

  const sortedStrategies = strategies ? [...strategies].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()) : [];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-muted pb-6">
        <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Investment Strategies</h1>
            <p className="mt-2 text-lg text-muted-foreground">Document your custom plans or adopt proven expert frameworks.</p>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)} className="shadow-lg hover:shadow-primary/20 transition-all font-semibold">
          <PlusCircle className="mr-2 h-4 w-4" /> New Strategy
        </Button>
      </div>

      <Tabs defaultValue="mine" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-muted/60 p-1 h-auto rounded-lg">
          <TabsTrigger value="mine" className="py-2.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">My Personal Plans</TabsTrigger>
          <TabsTrigger value="experts" className="py-2.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Expert Frameworks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mine" className="space-y-6">
            {sortedStrategies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedStrategies.map((strategy) => (
                    <Card key={strategy.id} className="flex flex-col bg-card/80 backdrop-blur-sm border-muted/80 shadow-md hover:shadow-xl transition-all hover:border-primary/30 group">
                    <CardHeader className="pb-3 border-b border-muted/30 mb-3 bg-muted/10 rounded-t-lg">
                        <CardTitle className="leading-snug text-lg group-hover:text-primary transition-colors">{strategy.title}</CardTitle>
                        <CardDescription className="text-xs">Created {strategy.createdAt.toDate().toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-foreground/80 line-clamp-4 whitespace-pre-wrap leading-relaxed">{strategy.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" size="sm" onClick={() => setEditingStrategy(strategy)} className="hover:bg-primary/10 hover:text-primary border-muted-foreground/30">
                            <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </Button>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-muted-foreground/30">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-destructive/30">
                            <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center text-destructive"><Trash2 className="w-5 h-5 mr-2" /> Permanently Delete?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                                This action cannot be undone. This will permanently remove <strong className="text-foreground">{strategy.title}</strong> from your profile.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(strategy.id!)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Confirm Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                    </Card>
                ))}
                </div>
            ) : (
                <Alert className="bg-muted/40 border-primary/20 items-center justify-center p-8 flex flex-col text-center rounded-xl border-dashed shadow-none">
                <FileText className="h-12 w-12 text-primary/40 mb-4" />
                <AlertTitle className="text-xl font-bold mb-2">No Custom Strategies Yet</AlertTitle>
                <AlertDescription className="text-base max-w-sm">
                    You haven't documented any personal investment rules. Create a new one, or adopt a proven framework from the experts!
                </AlertDescription>
                </Alert>
            )}
        </TabsContent>

        <TabsContent value="experts" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {EXPERT_STRATEGIES.map((strat, i) => (
                    <Card key={i} className="flex flex-col bg-card border-muted/80 shadow-md hover:shadow-xl transition-all duration-300 hover:border-primary/40 group overflow-hidden">
                        <CardHeader className="pb-4 bg-muted/20 border-b border-muted/50">
                            <div className="flex justify-between items-start mb-3">
                                <Badge variant="outline" className="font-semibold px-2 py-0.5 uppercase tracking-wider text-[10px] bg-background">
                                    {strat.type}
                                </Badge>
                                <span className="text-xs font-medium text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">{strat.author}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-background border border-muted/80 shadow-sm group-hover:scale-110 transition-transform">
                                    {strat.icon}
                                </div>
                                <CardTitle className="text-2xl font-bold tracking-tight">{strat.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow text-sm pt-6 px-6">
                            <p className="mb-6 text-foreground/80 leading-relaxed text-base">{strat.description}</p>
                            <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                                <strong className="text-primary text-xs uppercase tracking-widest block mb-2 font-bold">The Blueprint</strong>
                                <p className="text-sm font-medium leading-relaxed">{strat.action}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4 pb-6 px-6 justify-end relative z-10">
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground border-primary/20 transition-colors font-semibold" 
                                onClick={() => copyExpertStrategy(strat)}
                                disabled={isCloning}
                            >
                                <DownloadCloud className="mr-2 w-4 h-4" /> 
                                Adopt This Strategy
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>

      <StrategyDialog
        isOpen={isNewDialogOpen}
        setIsOpen={setIsNewDialogOpen}
        onSuccess={() => { /* No-op, useCollection handles updates */ }}
      />
      {editingStrategy && (
        <StrategyDialog
            isOpen={!!editingStrategy}
            setIsOpen={() => setEditingStrategy(null)}
            strategy={editingStrategy}
            onSuccess={() => { /* No-op, useCollection handles updates */ }}
        />
      )}
    </div>
  );
}
