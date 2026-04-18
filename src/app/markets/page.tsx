'use client';

import { Activity, Globe2, TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const INDICES = [
  { name: 'S&P 500', value: 5123.69, change: 0.8 },
  { name: 'NASDAQ', value: 16085.11, change: 1.14 },
  { name: 'DOW JONES', value: 39087.38, change: 0.23 },
  { name: 'NIFTY 50', value: 22493.55, change: -0.12 },
  { name: 'FTSE 100', value: 7682.50, change: 0.45 },
  { name: 'NIKKEI 225', value: 39910.82, change: 1.9 },
  { name: 'DAX', value: 17735.07, change: -0.4 },
  { name: 'HANG SENG', value: 16589.44, change: 0.47 },
];

const TOP_GAINERS = [
  { symbol: 'SMCI', name: 'Super Micro Computer', price: 905.45, change: 14.2, volume: '19.8M' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 852.00, change: 3.5, volume: '55.4M' },
  { symbol: 'META', name: 'Meta Platforms', price: 485.50, change: 2.1, volume: '15.1M' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 192.53, change: 5.1, volume: '34.5M' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 425.22, change: 1.8, volume: '22.3M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 156.37, change: 1.3, volume: '28.7M' },
];

const TOP_LOSERS = [
  { symbol: 'SNOW', name: 'Snowflake Inc.', price: 188.20, change: -8.5, volume: '44.5M' },
  { symbol: 'PANW', name: 'Palo Alto Networks', price: 298.15, change: -4.3, volume: '18.3M' },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: 11.42, change: -6.7, volume: '62.1M' },
  { symbol: 'MRNA', name: 'Moderna Inc.', price: 98.30, change: -5.2, volume: '14.9M' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 205.88, change: -3.8, volume: '12.6M' },
  { symbol: 'ROKU', name: 'Roku Inc.', price: 62.15, change: -3.1, volume: '9.4M' },
];

type MoversTab = 'gainers' | 'losers';

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moversTab, setMoversTab] = useState<MoversTab>('gainers');

  const filteredIndices = INDICES.filter((index) =>
    index.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMovers = (moversTab === 'gainers' ? TOP_GAINERS : TOP_LOSERS).filter((mover) => 
    mover.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mover.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <main className="container max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <Globe2 className="h-10 w-10 text-primary" />
              Global Markets
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track major indices, identify trending sectors, and find the biggest movers across global exchanges.
            </p>
          </div>

          <div className="w-full md:w-80 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search markets or symbols..."
              className="pl-10 h-12 bg-black/20 border-white/10 focus-visible:ring-primary/50 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Global Indices Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Major Indices</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredIndices.map((index) => {
              const isPositive = index.change >= 0;
              return (
                <div key={index.name} className="glass-card p-5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{index.name}</span>
                    <span className={cn("flex items-center text-xs font-bold px-2 py-0.5 rounded", isPositive ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red")}>
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {isPositive ? '+' : ''}{index.change}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-foreground/90">
                    {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Market Movers Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Movers List */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Today&apos;s Market Movers</h2>
                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setMoversTab('gainers')}
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer",
                      moversTab === 'gainers'
                        ? "bg-neon-green/20 text-neon-green ring-1 ring-neon-green/50 shadow-[0_0_12px_rgba(var(--neon-green),0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    )}
                  >
                    Gainers
                  </button>
                  <button
                    onClick={() => setMoversTab('losers')}
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer",
                      moversTab === 'losers'
                        ? "bg-neon-red/20 text-neon-red ring-1 ring-neon-red/50 shadow-[0_0_12px_rgba(var(--neon-red),0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    )}
                  >
                    Losers
                  </button>
                </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-y border-white/5">
                   <tr>
                     <th className="px-4 py-3 font-semibold rounded-tl-lg">Symbol / Name</th>
                     <th className="px-4 py-3 font-semibold text-right">Price</th>
                     <th className="px-4 py-3 font-semibold text-right">Change %</th>
                     <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Volume</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {activeMovers.map((mover) => {
                     const isPos = mover.change >= 0;
                     return (
                       <tr key={mover.symbol} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                         <td className="px-4 py-4">
                           <div className="flex items-center gap-3">
                             <div className={cn(
                               "h-10 w-10 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform",
                               moversTab === 'gainers' ? "bg-primary/10 text-primary" : "bg-neon-red/10 text-neon-red"
                             )}>
                               {mover.symbol[0]}
                             </div>
                             <div>
                               <div className={cn(
                                 "font-bold transition-colors",
                                 moversTab === 'gainers'
                                   ? "text-foreground group-hover:text-primary"
                                   : "text-foreground group-hover:text-neon-red"
                               )}>{mover.symbol}</div>
                               <div className="text-xs text-muted-foreground">{mover.name}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-4 text-right font-semibold text-base">${mover.price.toFixed(2)}</td>
                         <td className="px-4 py-4 text-right">
                            <span className={cn("inline-flex items-center text-sm font-bold px-2 py-1 rounded", isPos ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red")}>
                              {isPos ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                              {isPos ? '+' : ''}{mover.change}%
                            </span>
                         </td>
                         <td className="px-4 py-4 text-right text-muted-foreground">
                            {mover.volume}
                         </td>
                       </tr>
                     )
                   })}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Market Status & Sentiment */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/20 rounded-full blur-[40px] -mr-10 -mt-10" />
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Market Status</h3>
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-3 w-3 rounded-full bg-neon-green shadow-[0_0_10px_rgba(var(--neon-green),0.8)] animate-pulse" />
                 <span className="text-xl font-bold">Open</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground border-t border-white/5 pt-4">
                <span className="flex flex-col"><span className="text-xs">Closes in</span> <span className="text-foreground font-semibold flex items-center mt-1"><Clock className="h-3 w-3 mr-1"/> 03:45:12</span></span>
                <span className="flex flex-col text-right"><span className="text-xs">Timezone</span> <span className="text-foreground font-semibold mt-1">EST (NY)</span></span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">AI Market Sentiment</h3>
              <div className="mb-2 flex justify-between items-end">
                <span className="text-2xl font-bold tracking-tight text-neon-green">Bullish</span>
                <span className="text-sm font-semibold text-neon-green/80">72 / 100</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-neon-red via-yellow-500 to-neon-green w-[72%] rounded-full relative">
                   <div className="absolute right-0 top-0 h-full w-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Strong momentum in technology and AI sectors offset minor weaknesses in energy. The trend suggests continued growth pattern for the session.
              </p>
            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}

