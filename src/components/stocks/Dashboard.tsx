"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Stock } from '@/lib/mock-data';
import { mockStocks, mockIndianStocks } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, Clock, Activity, Wallet, Newspaper, Zap, Star, Search, X, Sparkles, BarChart3, Globe, Calendar, PieChart, LineChart, Target, ArrowUpRight, ArrowDownRight, Compass, Bot } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { PriceChart } from './PriceChart';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { AddStockDialog } from '../portfolio/AddStockDialog';
import { Input } from '@/components/ui/input';

const ALL_STOCKS = [...mockStocks, ...mockIndianStocks];

// Animation variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const scaleItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// ------------- LOCAL COMPONENTS ------------- //

function TickerItem({ symbol, price, change, onClick }: { symbol: string, price: number, change: number, onClick?: () => void }) {
  const isPositive = change >= 0;
  return (
    <div
      className="flex items-center space-x-3 px-6 py-2.5 border-r border-white/5 whitespace-nowrap cursor-pointer hover:bg-primary/5 transition-all duration-200 group"
      onClick={onClick}
    >
      <span className="font-semibold text-foreground/90 group-hover:text-primary transition-colors">{symbol}</span>
      <span className="text-foreground/70">${price.toFixed(2)}</span>
      <span className={cn(
        "text-xs font-bold px-1.5 py-0.5 rounded-md",
        isPositive 
          ? "text-neon-green bg-neon-green/10" 
          : "text-neon-red bg-neon-red/10"
      )}>
        {isPositive ? "+" : ""}{change.toFixed(2)}%
      </span>
    </div>
  );
}

function LiveTicker({ onSelectStock }: { onSelectStock: (symbol: string) => void }) {
  const tickers = [
    { symbol: "AAPL", price: 173.50, change: 1.2 },
    { symbol: "TSLA", price: 202.10, change: -2.4 },
    { symbol: "NVDA", price: 852.00, change: 3.5 },
    { symbol: "MSFT", price: 415.20, change: 0.8 },
    { symbol: "AMZN", price: 175.30, change: -0.5 },
    { symbol: "GOOGL", price: 147.80, change: 1.1 },
    { symbol: "META", price: 485.50, change: 2.1 },
    { symbol: "BRK.B", price: 405.00, change: 0.3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full overflow-hidden border-y border-white/5 backdrop-blur-xl flex h-12 relative"
      style={{
        background: 'linear-gradient(90deg, hsl(var(--background) / 0.8), hsl(var(--card) / 0.6), hsl(var(--background) / 0.8))',
      }}
    >
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/90 border border-white/10">
        <div className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_6px_hsl(var(--neon-green)/0.6)]" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
      </div>
      <div className="flex animate-ticker hover:[animation-play-state:paused] w-[200%] ml-20">
        {[...tickers, ...tickers, ...tickers].map((t, i) => (
          <TickerItem key={i} {...t} onClick={() => onSelectStock(t.symbol)} />
        ))}
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-20 pb-14 md:pt-28 md:pb-20 flex flex-col items-center text-center overflow-hidden z-10">
      <div className="container px-4 z-10">
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
          className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 rounded-full border backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--neon-cyan) / 0.05))`,
            borderColor: `hsl(var(--primary) / 0.2)`,
          }}
        >
          <span className="flex h-2 w-2 rounded-full bg-neon-green shadow-[0_0_8px_hsl(var(--neon-green)/0.8)] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'hsl(var(--neon-cyan))' }}>
            Systems Fully Operational
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} 
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 max-w-5xl mx-auto leading-[0.95]"
        >
          <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
            Command Markets with
          </span>
          <br/>
          <span className="gradient-text-primary relative hover:drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all duration-300">
            Generative AI Intelligence
            {/* Sparkle decorations */}
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-4 text-neon-cyan text-sm"
            >
              ✦
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              className="absolute top-4 -left-6 text-neon-magenta text-xs"
            >
              ✦
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }} 
          className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Unleash unprecedented financial velocity. Supercharged by ultra-low latency data streams, 
          <span className="text-neon-cyan font-bold drop-shadow-[0_0_10px_hsl(var(--neon-cyan)/0.6)]"> predictive neural machine learning</span>, and 
          breathtaking real-time analytics in a visually stunning interface.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }} 
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg" asChild className="h-14 px-8 rounded-full text-lg font-semibold border-none group cursor-pointer relative overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))',
              boxShadow: '0 0 30px hsl(var(--primary) / 0.4), 0 10px 40px hsl(var(--primary) / 0.2)',
            }}
          >
            <Link href="#trading-dashboard">
              <span className="relative z-10 flex items-center text-white">
                Start Trading 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-lg font-semibold transition-all duration-300 group border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 backdrop-blur-xl">
            <Link href="/markets">
              <Globe className="mr-2 h-5 w-5 text-neon-cyan group-hover:rotate-12 transition-transform duration-300" />
              Explore Markets
            </Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {[
            { label: 'Active Users', value: '150K+', color: 'var(--neon-cyan)' },
            { label: 'Stocks Tracked', value: '10K+', color: 'var(--primary)' },
            { label: 'Uptime', value: '99.9%', color: 'var(--neon-green)' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl md:text-3xl font-bold" style={{ color: `hsl(${stat.color})` }}>
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Inline stock search for the chart section
function ChartStockSearch({ onSelect, currentSymbol }: { onSelect: (stock: Stock) => void, currentSymbol: string }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_STOCKS
      .filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .filter(s => s.symbol !== currentSymbol)
      .slice(0, 5);
  }, [query, currentSymbol]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className={cn(
        "flex items-center rounded-xl border transition-all duration-200",
        isOpen 
          ? "ring-1 ring-primary/30 bg-card/80 border-primary/20" 
          : "bg-white/5 dark:bg-black/30 border-white/10 dark:border-white/5 hover:border-primary/20"
      )}>
        <Search className="h-3.5 w-3.5 ml-2.5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          placeholder="Switch stock..."
          className="w-28 h-8 bg-transparent border-none outline-none text-xs px-2 text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => { setQuery(''); setIsOpen(false); }} className="mr-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
      {isOpen && query.trim() && (
        <motion.div 
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full mt-1 w-64 left-0 rounded-2xl overflow-hidden z-50 glass-card-premium"
          style={{ boxShadow: '0 15px 50px hsl(var(--primary) / 0.12)' }}
        >
          {results.length > 0 ? (
            <div className="py-1">
              {results.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <button
                    key={stock.symbol}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSelect(stock);
                      setQuery('');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/20 to-neon-cyan/10 flex items-center justify-center font-bold text-primary text-[10px] group-hover:scale-110 transition-transform">
                        {stock.symbol[0]}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-xs group-hover:text-primary transition-colors">{stock.symbol}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[100px]">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold">${stock.price.toFixed(2)}</div>
                      <div className={cn("text-[10px] font-bold", isPos ? "text-neon-green" : "text-neon-red")}>
                        {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground">No stocks found</p>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}



function MainDashboard({ selectedStock }: { selectedStock: Stock }) {
  const timeFilters = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  const [activeTime, setActiveTime] = useState('1M');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const router = useRouter();

  const isPositive = selectedStock.changePercent >= 0;

  function handleStockSwitch(stock: Stock) {
    router.push(`/?symbol=${stock.symbol}`, { scroll: false });
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="container max-w-7xl mx-auto px-4 pb-24 space-y-6 relative z-10"
    >
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Chart */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            variants={fadeUpItem}
            whileHover={{ y: -3 }} 
            className="glass-card-premium rounded-2xl overflow-hidden relative animate-border-glow"
          >
            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 animate-shimmer opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), hsl(var(--neon-cyan) / 0.3), transparent)' }}
              />
              
              <div className="flex items-start gap-4 w-full sm:w-auto">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <motion.h2 
                      key={selectedStock.symbol}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-3xl font-bold tracking-tight"
                    >
                      {selectedStock.symbol}
                    </motion.h2>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold text-muted-foreground"
                      style={{ background: 'hsl(var(--primary) / 0.08)', border: '1px solid hsl(var(--primary) / 0.15)' }}
                    >
                      {selectedStock.exchange}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 mb-1">{selectedStock.name}</div>
                  <div className="flex items-baseline gap-2">
                    <motion.span 
                      key={selectedStock.price}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      {selectedStock.price.toFixed(2)}
                    </motion.span>
                    <span className={cn(
                      "text-sm font-semibold flex items-center px-2 py-0.5 rounded-lg",
                      isPositive 
                        ? "text-neon-green bg-neon-green/10" 
                        : "text-neon-red bg-neon-red/10"
                    )}>
                      {isPositive ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                      {isPositive ? '+' : ''}{selectedStock.change.toFixed(2)} ({isPositive ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {/* Inline search */}
                <ChartStockSearch onSelect={handleStockSwitch} currentSymbol={selectedStock.symbol} />
              </div>

              <div className="flex p-1 rounded-xl border border-white/5"
                style={{ background: 'hsl(var(--background) / 0.5)' }}
              >
                {timeFilters.map(tf => (
                  <button 
                    key={tf}
                    onClick={() => setActiveTime(tf)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 relative",
                      activeTime === tf 
                        ? "text-white" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {activeTime === tf && (
                      <motion.div 
                        layoutId="time-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))',
                          boxShadow: '0 0 12px hsl(var(--primary) / 0.4)',
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{tf}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-6 relative">
              <PriceChart />
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-white/5 flex gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button 
                  onClick={() => setIsAddStockOpen(true)} 
                  className="w-full h-12 font-bold text-lg rounded-xl border-none relative overflow-hidden group transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-green) / 0.15), hsl(var(--neon-green) / 0.25))',
                    color: 'hsl(var(--neon-green))',
                    border: '1px solid hsl(var(--neon-green) / 0.3)',
                    boxShadow: '0 0 20px hsl(var(--neon-green) / 0.15)',
                  }}
                >
                  <span className="relative z-10">BUY</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--neon-green) / 0.25), hsl(var(--neon-green) / 0.35))' }}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button 
                  onClick={() => setIsAddStockOpen(true)} 
                  className="w-full h-12 font-bold text-lg rounded-xl border-none relative overflow-hidden group transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--neon-red) / 0.15), hsl(var(--neon-red) / 0.25))',
                    color: 'hsl(var(--neon-red))',
                    border: '1px solid hsl(var(--neon-red) / 0.3)',
                    boxShadow: '0 0 20px hsl(var(--neon-red) / 0.15)',
                  }}
                >
                  <span className="relative z-10">SELL</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--neon-red) / 0.25), hsl(var(--neon-red) / 0.35))' }}
                  />
                </Button>
              </motion.div>
            </div>
            
            <AddStockDialog
              stock={selectedStock}
              isOpen={isAddStockOpen}
              setIsOpen={setIsAddStockOpen}
            />
          </motion.div>

          {/* BELOW CHART: Stock Details */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-4 gap-3">
            {[
              { label: 'Market Cap', value: selectedStock.marketCap, icon: BarChart3, gradient: 'from-primary/20 to-neon-cyan/10' },
              { label: 'P/E Ratio', value: selectedStock.peRatio?.toFixed(1) ?? 'N/A', icon: Activity, gradient: 'from-neon-cyan/20 to-neon-blue/10' },
              { label: 'Dividend Yield', value: selectedStock.dividendYield ? `${selectedStock.dividendYield}%` : 'N/A', icon: Wallet, gradient: 'from-neon-gold/20 to-primary/10' },
              { label: 'Analyst Rating', value: selectedStock.analystConsensus, icon: Star, gradient: 'from-neon-magenta/20 to-primary/10' },
            ].map((item, idx) => (
              <motion.div 
                key={item.label}
                variants={scaleItem}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card-premium p-4 rounded-xl relative overflow-hidden group cursor-default"
              >
                <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity bg-gradient-to-br", item.gradient)} />
                <div className="flex items-center gap-1.5 mb-2">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  item.label === 'Analyst Rating' && item.value === 'Buy' && "text-neon-green",
                  item.label === 'Analyst Rating' && item.value === 'Sell' && "text-neon-red",
                  item.label === 'Analyst Rating' && item.value === 'Hold' && "text-neon-gold",
                )}>{item.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Stock Analysis Agent */}
          <motion.div variants={fadeUpItem} className="glass-card-premium p-6 rounded-2xl relative overflow-hidden group mt-4 hover:border-neon-cyan/30 transition-all duration-500 hover:shadow-[0_10px_40px_hsl(var(--neon-cyan)/0.1)]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-32 h-32 text-neon-cyan group-hover:rotate-12 transition-transform duration-700" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-neon-purple to-neon-cyan p-[2px] flex-shrink-0 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] animate-pulse-glow">
                <div className="bg-card w-full h-full rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="h-7 w-7 text-neon-cyan drop-shadow-md" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple inline-flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-neon-cyan" /> {selectedStock.symbol} Deep Algorithmic Matrix
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed font-medium mb-4">
                  Based on trailing 30-day algorithmic momentum and macroeconomic volatility indices, <strong className="text-neon-green bg-neon-green/10 px-1 rounded">{selectedStock.symbol}</strong> is exhibiting a <strong className="text-foreground">bullish divergence</strong> pattern. Order flow sentiment consolidated strongly at previous support lines. The underlying neural network projects a +8.5% price movement over the next fiscal quarter spanning critical supply zones.
                </p>
                <div className="flex flex-wrap gap-2 cursor-default">
                  <span className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest font-extrabold rounded-md bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20 transition-colors shadow-[0_0_10px_hsl(var(--neon-green)/0.15)] flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Strong Buy Signal</span>
                  <span className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest font-extrabold rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">High Order Flow Momentum</span>
                  <span className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest font-extrabold rounded-md bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple/20 transition-colors">Smart Money Inflows</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sector Performance and AI Outlook */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 gap-4">
            
            {/* Sector Performance */}
            <motion.div variants={fadeUpItem} className="glass-card-premium p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" /> Sector Performance
                </h3>
              </div>
              <div className="space-y-3 relative z-10">
                {[
                  { name: 'Technology', val: '+2.4%', up: true },
                  { name: 'Healthcare', val: '+0.8%', up: true },
                  { name: 'Financials', val: '-1.2%', up: false },
                  { name: 'Energy', val: '-0.5%', up: false },
                ].map((s) => (
                  <div key={s.name} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className={cn("font-bold flex items-center", s.up ? "text-neon-green" : "text-neon-red")}>
                      {s.val} {s.up ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Predictions */}
            <motion.div variants={fadeUpItem} className="glass-card-premium p-6 rounded-2xl relative overflow-hidden p-[1px]">
              {/* Magic border */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-primary opacity-30 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-primary opacity-50 blur-[10px]" />
              
              <div className="bg-card w-full h-full rounded-2xl p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                    <Sparkles className="h-4 w-4 text-neon-cyan" /> AI Market Outlook
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="text-neon-cyan font-semibold mb-1">Bullish Trend Detected</div>
                    <p className="text-muted-foreground">Algorithms indicate a 72% probability of continued upward momentum for mega-cap tech stocks over the next 48 hours.</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Score</span>
                    <span className="font-bold text-neon-green glow-text-green">94 / 100</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Portfolio Mini */}
          <motion.div 
            variants={fadeUpItem}
            whileHover={{ y: -3 }}
            className="glass-card-premium rounded-2xl p-6 relative overflow-hidden group"
          >
            {/* Decorative gradient orb */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] -mr-10 -mt-10 transition-all duration-500"
              style={{ background: 'radial-gradient(circle, hsl(var(--neon-green) / 0.15), transparent)' }}
            />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[50px] -ml-8 -mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.1), transparent)' }}
            />

            <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
              <div className="h-6 w-6 rounded-lg mr-2 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(var(--neon-green) / 0.15), hsl(var(--primary) / 0.1))' }}
              >
                <Wallet className="h-3.5 w-3.5 text-neon-green"/>
              </div>
              Total Balance
            </h3>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-bold tracking-tight mb-1"
            >
              $124,562
              <span className="text-lg text-muted-foreground">.00</span>
            </motion.div>
            <div className="text-sm font-semibold text-neon-green flex items-center mb-5">
              <TrendingUp className="h-4 w-4 mr-1"/>
              <span>+$3,240.50</span>
              <span className="ml-1 text-neon-green/70">(2.6%)</span>
              <span className="text-muted-foreground font-normal ml-1">Today</span>
            </div>
            
            {/* Tiny Portfolio Graph */}
            <div className="h-14 w-full mb-6 relative">
               <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="hsl(var(--neon-green))" stopOpacity={0.4} />
                     <stop offset="100%" stopColor="hsl(var(--neon-green))" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <path d="M0,30 L0,20 Q10,25 20,15 T40,18 T60,5 T80,10 T100,5 L100,30 Z" fill="url(#portGrad)" />
                 <path d="M0,20 Q10,25 20,15 T40,18 T60,5 T80,10 T100,5" fill="none" stroke="hsl(var(--neon-green))" strokeWidth="2" />
                 {/* Glow line */}
                 <path d="M0,20 Q10,25 20,15 T40,18 T60,5 T80,10 T100,5" fill="none" stroke="hsl(var(--neon-green))" strokeWidth="4" opacity="0.2" />
               </svg>
            </div>

            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-neon-cyan" />
              Recent Transactions
            </h4>
            <div className="space-y-2.5">
              {[
                { type: "BUY", sym: "NVDA", shares: 10, amount: 8520, date: "Today" },
                { type: "SELL", sym: "TSLA", shares: 25, amount: 5052.5, date: "Yesterday" }
              ].map((tx, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ x: 2 }}
                  className="flex justify-between items-center text-sm p-3 rounded-xl border border-white/5 hover:border-primary/10 transition-all duration-200 cursor-default"
                  style={{ background: 'hsl(var(--background) / 0.4)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold",
                      tx.type === 'BUY' 
                        ? "text-neon-green" 
                        : "text-neon-red"
                    )}
                      style={{
                        background: tx.type === 'BUY' 
                          ? 'hsl(var(--neon-green) / 0.12)' 
                          : 'hsl(var(--neon-red) / 0.12)',
                        border: `1px solid ${tx.type === 'BUY' 
                          ? 'hsl(var(--neon-green) / 0.2)' 
                          : 'hsl(var(--neon-red) / 0.2)'}`,
                      }}
                    >
                      {tx.type}
                    </div>
                    <div>
                      <div className="font-bold">{tx.sym}</div>
                      <div className="text-xs text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${tx.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{tx.shares} shares</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Watchlist */}
          <motion.div 
            variants={fadeUpItem}
            className="glass-card-premium rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center">
                <div className="h-6 w-6 rounded-lg mr-2 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--neon-gold) / 0.15), hsl(var(--primary) / 0.1))' }}
                >
                  <Star className="h-3.5 w-3.5 text-neon-gold"/>
                </div>
                Watchlist
              </h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 text-primary hover:text-primary font-bold text-lg">+</Button>
            </div>
            <div className="space-y-1.5">
              {[
                { sym: "MSFT", price: 415.20, change: 0.8 },
                { sym: "AMZN", price: 175.30, change: -0.5 },
                { sym: "GOOGL", price: 147.80, change: 1.1 },
                { sym: "META", price: 485.50, change: 2.1 },
              ].map((w) => (
                <WatchlistItem key={w.sym} sym={w.sym} price={w.price} change={w.change} />
              ))}
            </div>
          </motion.div>

          {/* Market Overview Mini */}
          <motion.div 
            variants={fadeUpItem}
            className="glass-card-premium rounded-2xl p-6 relative overflow-hidden"
          >
            <h3 className="text-base font-bold flex items-center mb-4">
              <div className="h-6 w-6 rounded-lg mr-2 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(var(--neon-magenta) / 0.15), hsl(var(--primary) / 0.1))' }}
              >
                <Activity className="h-3.5 w-3.5 text-neon-magenta"/>
              </div>
              Top Movers
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="rounded-xl p-4 relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--neon-green) / 0.08), hsl(var(--neon-green) / 0.03))',
                  border: '1px solid hsl(var(--neon-green) / 0.15)',
                }}
              >
                <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-xl bg-neon-green/10" />
                <div className="text-xs text-muted-foreground mb-1">Top Gainer</div>
                <div className="font-bold text-lg">SMCI</div>
                <div className="text-neon-green text-sm font-bold">+14.2%</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="rounded-xl p-4 relative overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--neon-red) / 0.08), hsl(var(--neon-red) / 0.03))',
                  border: '1px solid hsl(var(--neon-red) / 0.15)',
                }}
              >
                <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-xl bg-neon-red/10" />
                <div className="text-xs text-muted-foreground mb-1">Top Loser</div>
                <div className="font-bold text-lg">SNOW</div>
                <div className="text-neon-red text-sm font-bold">-8.5%</div>
              </motion.div>
            </div>

            {/* Market Sentiment */}
            <div className="mt-4 p-3 rounded-xl border border-white/5" style={{ background: 'hsl(var(--background) / 0.3)' }}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Market Sentiment</span>
                <span className="text-neon-green font-semibold">Bullish</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, hsl(var(--neon-green)), hsl(var(--neon-cyan)))' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Fear</span>
                <span>Greed</span>
              </div>
            </div>
          </motion.div>

          {/* Global Indices */}
          <motion.div variants={fadeUpItem} className="glass-card-premium rounded-2xl p-6">
            <h3 className="text-base font-bold flex items-center mb-4">
              <div className="h-6 w-6 rounded-lg mr-2 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--neon-cyan) / 0.1))' }}
              >
                <Globe className="h-3.5 w-3.5 text-primary"/>
              </div>
              Global Indices
            </h3>
            <div className="space-y-3">
              {[
                { name: 'S&P 500', val: '5,123.40', change: '+1.2%', up: true },
                { name: 'NASDAQ', val: '16,211.80', change: '+1.8%', up: true },
                { name: 'NIFTY 50', val: '22,450.25', change: '-0.3%', up: false },
                { name: 'DOW JONES', val: '38,980.11', change: '+0.5%', up: true }
              ].map((idx) => (
                <div key={idx.name} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <div>
                    <div className="text-sm font-bold">{idx.name}</div>
                    <div className="text-xs text-muted-foreground">{idx.val}</div>
                  </div>
                  <div className={cn("text-sm font-bold flex items-center bg-white/5 px-2 py-1 rounded-lg", idx.up ? "text-neon-green" : "text-neon-red")}>
                    {idx.change} {idx.up ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* PROMINENT NEWS SECTION */}
      <motion.div variants={fadeUpItem} className="mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
              Real-time Market Intelligence
            </h2>
            <p className="text-muted-foreground mt-2">Curated algorithmic news feeds keeping you lightyears ahead of the curve.</p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground font-medium hidden sm:flex shadow-inner">
               <span className="text-neon-cyan font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_5px_hsl(var(--neon-cyan))]" /> Trending:</span> 
               <span className="hover:text-primary cursor-pointer transition-colors">AI Processing</span> <span className="text-white/20">•</span>
               <span className="hover:text-primary cursor-pointer transition-colors">Fed Pivot</span> <span className="text-white/20">•</span>
               <span className="hover:text-primary cursor-pointer transition-colors">Semiconductors</span>
             </div>
             <Link href="/news">
               <Button variant="outline" className="border-primary/30 bg-primary/5 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]">Deep Dive Analysis</Button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Large News Card */}
          <div className="lg:col-span-2 group cursor-pointer">
            <div className="glass-card-premium rounded-2xl h-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
              {/* Simulated image background using gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-neon-purple/20 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0wIDBoOHY4SDB6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTAgMGg0djRIMG00IDBoNHY0SDR6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] [background-size:24px]" />
              
              <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-md">Breaking</span>
                  <span className="px-3 py-1 bg-black/50 text-white border border-white/10 rounded-lg text-xs font-semibold backdrop-blur-md">Just Now</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors shadow-black drop-shadow-md">
                  A.I. Trading Algorithms Drive SPX to Record Highs
                </h3>
                <p className="text-white/80 line-clamp-2 max-w-2xl mb-4 text-sm">
                  Institutional adoption of next-generation generative AI trading models leads to unprecedented market efficiency, heavily impacting the technology and communications sectors. Analysts upgrade End-Of-Year targets significantly.
                </p>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="font-semibold text-white/90">Financial Times</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary News Cards */}
          <div className="flex flex-col gap-6">
            {[
              { tag: 'Economics', source: 'Bloomberg', time: '1h ago', title: 'Federal Reserve Hints at Possible Rate Cuts in Q3', desc: 'Inflation data comes in cooler than expected, prompting markets to rally.' },
              { tag: 'Crypto', source: 'CoinDesk', time: '3h ago', title: 'Bitcoin Surges Past Institutional Resistance Levels', desc: 'ETF inflows reach all-time highs as massive capital allocates to digital assets.' }
            ].map((news, i) => (
              <div key={i} className="glass-card-premium rounded-2xl p-5 flex-1 hover:border-primary/30 transition-all group cursor-pointer flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-neon-purple font-semibold bg-neon-purple/10 px-2 py-0.5 rounded-md border border-neon-purple/20">{news.tag}</span>
                    <span className="text-muted-foreground">{news.time}</span>
                  </div>
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight mb-2">{news.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{news.desc}</p>
                </div>
                <div className="mt-4 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">{news.source[0]}</div>
                  {news.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function WatchlistItem({ sym, price, change }: { sym: string, price: number, change: number }) {
  const router = useRouter();
  const isPos = change >= 0;

  return (
    <motion.div
      whileHover={{ x: 3 }}
      onClick={() => router.push(`/?symbol=${sym}`, { scroll: false })}
      className="flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-primary/10 group"
      style={{ background: 'transparent' }}
      onHoverStart={(e) => {
        const el = e as unknown as { currentTarget: HTMLElement };
        if (el.currentTarget) {
          (el.currentTarget as HTMLElement).style.background = 'hsl(var(--primary) / 0.03)';
        }
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-primary"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--neon-cyan) / 0.05))' }}
        >
          {sym[0]}
        </div>
        <div className="font-semibold text-sm">{sym}</div>
      </div>
      <div className="flex-1 px-4 max-w-[70px] hidden sm:block">
         <svg viewBox="0 0 50 20" className="w-full h-full" preserveAspectRatio="none">
           <path 
             d={isPos ? "M0,15 Q10,18 20,10 T35,5 T50,2" : "M0,5 Q10,2 20,10 T35,15 T50,18"} 
             fill="none" 
             stroke={isPos ? "hsl(var(--neon-green))" : "hsl(var(--neon-red))"} 
             strokeWidth="1.5" 
           />
         </svg>
      </div>
      <div className="text-right">
        <div className="font-bold text-sm group-hover:text-primary transition-colors">${price.toFixed(2)}</div>
        <div className={cn(
          "text-xs font-bold",
          isPos ? "text-neon-green" : "text-neon-red"
        )}>
          {isPos ? "+" : ""}{change}%
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine selected stock from URL param
  const selectedStock = useMemo(() => {
    const symbol = searchParams.get('symbol');
    if (symbol) {
      const found = ALL_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
      if (found) return found;
    }
    return mockStocks[0]; // Default to AAPL
  }, [searchParams]);

  function handleTickerSelect(symbol: string) {
    router.push(`/?symbol=${symbol}`, { scroll: false });
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))' }}
        >
          <Zap className="h-6 w-6 text-white" />
        </motion.div>
        <div className="text-sm text-muted-foreground animate-pulse">Loading StockBro...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
      <HeroSection />
      <LiveTicker onSelectStock={handleTickerSelect} />
      <div id="trading-dashboard" className="py-12 relative scroll-mt-16">
         {/* Ambient gradient behind dashboard */}
         <div className="absolute top-0 left-0 w-full h-[600px] -z-10 opacity-50"
           style={{
             background: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.08), transparent)',
           }}
         />
         <MainDashboard selectedStock={selectedStock} />
      </div>
    </div>
  );
}
