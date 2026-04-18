"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, ShieldAlert, Activity, DollarSign } from "lucide-react";

export default function TutorialView() {
    return (
        <Tabs defaultValue="strategies" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto gap-2 bg-transparent p-0 mb-8 mt-2">
                <TabsTrigger value="fundamentals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card py-3 data-[state=active]:shadow-md transition-all">
                    <BookOpen className="w-4 h-4 mr-2" /> Fundamentals
                </TabsTrigger>
                <TabsTrigger value="strategies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card py-3 data-[state=active]:shadow-md transition-all">
                    <TrendingUp className="w-4 h-4 mr-2" /> Proven Strategies
                </TabsTrigger>
                <TabsTrigger value="risk" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card py-3 data-[state=active]:shadow-md transition-all">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Risk Management
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategies" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-l-4 border-l-blue-500 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-blue-500 border-blue-500/30">Growth Investing</Badge>
                                <TrendingUp className="text-blue-500/50 w-5 h-5"/>
                            </div>
                            <CardTitle className="text-xl">Riding the Momentum</CardTitle>
                            <CardDescription>Focusing on capital appreciation.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            Growth investors look for young or small companies whose earnings are expected to increase at an above-average rate compared to their industry sector or the overall market. 
                            <br/><br/>
                            <strong className="text-foreground">Action Step:</strong> Look for high EPS (Earnings Per Share) growth quarters YoY (Year Over Year), but always verify cash flow numbers.
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Value Investing</Badge>
                                <DollarSign className="text-emerald-500/50 w-5 h-5"/>
                            </div>
                            <CardTitle className="text-xl">Finding Hidden Gems</CardTitle>
                            <CardDescription>Warren Buffett's favored approach.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            Value investing involves picking stocks that appear to be trading for less than their intrinsic or book value, exploiting market inefficiencies.
                            <br/><br/>
                            <strong className="text-foreground">Action Step:</strong> Filter stock screeners for low P/E (Price-to-Earnings) ratios under 15, high dividend yields, and Price-to-Book ratios under 1.5.
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mt-2 md:mt-0 col-span-1 md:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-purple-500 border-purple-500/30">Technical Analysis</Badge>
                                <Activity className="text-purple-500/50 w-5 h-5"/>
                            </div>
                            <CardTitle className="text-xl">Chart Reading & Trends</CardTitle>
                            <CardDescription>Timing the market using statistical trends.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            Technical analysts believe that past trading activity and price changes of a security are valuable indicators of the security's future price movements. They rely on chart patterns rather than deep corporate financials.
                            <br/><br/>
                            <strong className="text-foreground">Action Step:</strong> Learn to plot Moving Averages (EMA 50 and EMA 200). A "Golden Cross" (when the short-term 50 EMA crosses above the long-term 200 EMA) often signals a sharp bullish breakout! Use RSI (Relative Strength Index) to spot overbought zones (&gt;70) or oversold bargains (&lt;30).
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="fundamentals" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">The Core Concepts</CardTitle>
                        <CardDescription className="text-base">Master the terminology of the trading floor.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-sm text-muted-foreground">
                        <div className="p-4 rounded-lg bg-muted/40 border border-muted/80">
                            <strong className="text-foreground block mb-2 text-base">Market Capitalization</strong>
                            The total dollar market value of a company's outstanding shares of stock. It's calculated by multiplying the total number of a company's outstanding shares by the current market price of one share. Used to categorize stocks into Large-cap, Mid-cap, and Small-cap.
                        </div>
                        <div className="p-4 rounded-lg bg-muted/40 border border-muted/80">
                            <strong className="text-foreground block mb-2 text-base">P/E Ratio (Price-to-Earnings)</strong>
                            The price-to-earnings ratio relates a company's share price to its earnings per share. A high P/E ratio could mean that a company's stock is overvalued, or alternatively that investors are expecting excessively high growth rates in the future.
                        </div>
                        <div className="p-4 rounded-lg bg-muted/40 border border-muted/80">
                            <strong className="text-foreground block mb-2 text-base">Dividend Yield</strong>
                            A financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It's crucial for passive-income investors and retirement portfolios.
                        </div>
                        <div className="p-4 rounded-lg bg-muted/40 border border-muted/80">
                            <strong className="text-foreground block mb-2 text-base">Trading Volume</strong>
                            The number of shares traded in a security over a set period. Higher volume means higher liquidity (easier to sell quickly) and indicates a stronger investor consensus around a price movement. Low volume can be dangerous due to high slippage.
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-card/60 backdrop-blur-sm border-destructive/30 hover:shadow-md transition-shadow">
                    <CardHeader className="bg-destructive/10 rounded-t-lg border-b border-destructive/20 mb-4 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldAlert className="text-destructive w-8 h-8"/>
                           <CardTitle className="text-destructive font-black text-2xl tracking-tight uppercase">The 1% Rule of Preservation</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-base text-muted-foreground pt-2">
                        <p className="mb-6 font-medium text-foreground/90 leading-relaxed border-l-2 border-primary/50 pl-4 bg-muted/30 p-3 rounded-r-md">
                            Never risk more than 1% of your total account value on a single trade. If you have a $10,000 portfolio, your maximum risk on any single position should be $100. This doesn't mean you only buy $100 worth of stock—it means you set your Stop Loss so that if the trade reverses, you exit the position with exactly a $100 loss.
                        </p>
                        <h4 className="text-foreground font-bold mb-4 uppercase tracking-wider text-sm">Crucial Checklists</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                                <div>
                                    <strong className="text-foreground block">Establish Pre-defined Stop-Losses</strong>
                                    Always define your exit strategy immediately before entering a trade. Never adjust your stop-loss further down out of false hope.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                                <div>
                                    <strong className="text-foreground block">Ensure True Diversification</strong>
                                    A heavily grouped portfolio is highly vulnerable to sector-specific crashes. Spread bets across Tech, Healthcare, Defensive ETFs, and stable blue-chips to hedge your overall delta.
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                                <div>
                                    <strong className="text-foreground block">Maintain Emotional Discipline</strong>
                                    Do not "revenge trade" after a loss. Avoid FOMO (Fear of Missing Out) chasing green candles at massive heights. Stick rigorously to your predefined criteria and statistical setups.
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
