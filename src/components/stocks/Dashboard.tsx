"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, Search, X, ArrowRight, ArrowUpRight, ArrowDownRight, Star, Bot, Globe, Sparkles, Newspaper, Clock } from 'lucide-react';
import type { Stock } from '@/lib/mock-data';
import { mockStocks, mockIndianStocks } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PriceChart } from './PriceChart';
import { AddStockDialog } from '../portfolio/AddStockDialog';

const ALL_STOCKS = [...mockStocks, ...mockIndianStocks];

const TICKERS = [
  { symbol: 'AAPL', price: 173.50, change: 1.2 },
  { symbol: 'TSLA', price: 202.10, change: -2.4 },
  { symbol: 'NVDA', price: 852.00, change: 3.5 },
  { symbol: 'MSFT', price: 415.20, change: 0.8 },
  { symbol: 'AMZN', price: 175.30, change: -0.5 },
  { symbol: 'GOOGL', price: 147.80, change: 1.1 },
  { symbol: 'META', price: 485.50, change: 2.1 },
  { symbol: 'BRK.B', price: 405.00, change: 0.3 },
];

const INDICES = [
  { name: 'S&P 500', val: '5,123.40', change: '+1.2%', up: true },
  { name: 'NASDAQ', val: '16,211.80', change: '+1.8%', up: true },
  { name: 'NIFTY 50', val: '22,450.25', change: '-0.3%', up: false },
  { name: 'DOW',    val: '38,980.11', change: '+0.5%', up: true },
];

const WATCHLIST = [
  { sym: 'MSFT', price: 415.20, change: 0.8 },
  { sym: 'AMZN', price: 175.30, change: -0.5 },
  { sym: 'GOOGL', price: 147.80, change: 1.1 },
  { sym: 'META', price: 485.50, change: 2.1 },
];

// ─── Ticker ──────────────────────────────────────────────────────────────

function Ticker({ onSelect }: { onSelect: (s: string) => void }) {
  const items = [...TICKERS, ...TICKERS, ...TICKERS];
  return (
    <div className="border-y border-border/70 bg-background/60">
      <div className="flex h-11 items-center overflow-hidden">
        <div className="flex items-center gap-2 border-r border-border/60 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" /> Live
        </div>
        <div className="animate-ticker flex w-[300%]">
          {items.map((t, i) => {
            const pos = t.change >= 0;
            return (
              <button
                key={i}
                onClick={() => onSelect(t.symbol)}
                className="flex items-center gap-3 whitespace-nowrap border-r border-border/50 px-5 py-2 text-sm hover:bg-secondary/40"
              >
                <span className="font-semibold">{t.symbol}</span>
                <span className="text-muted-foreground font-mono">${t.price.toFixed(2)}</span>
                <span className={cn('font-mono text-xs font-semibold', pos ? 'text-[hsl(var(--success))]' : 'text-destructive')}>
                  {pos ? '+' : ''}{t.change.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]">
        <div className="absolute left-1/2 top-20 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18)_0%,transparent_60%)]" />
        <div className="absolute left-[20%] top-40 h-[300px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.12)_0%,transparent_70%)]" />
        <div className="absolute right-[15%] top-60 h-[300px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#10b981] backdrop-blur-sm shadow-[0_0_20px_-4px_rgba(16,185,129,0.4)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
          </span>
          Systems Fully Operational
        </div>

        {/* Headline */}
        <h1 className="mt-10 text-5xl font-extrabold tracking-tight leading-[1.05] md:text-7xl lg:text-8xl">
          <span className="block bg-gradient-to-b from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
            Command Markets with
          </span>
          <span className="mt-2 block bg-gradient-to-r from-[#a855f7] via-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            Generative AI
          </span>
          <span className="block bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Unleash unprecedented financial velocity. Supercharged by ultra-low latency data streams,{' '}
          <span className="bg-gradient-to-r from-[#06b6d4] to-[#a855f7] bg-clip-text font-semibold text-transparent">
            predictive neural machine learning
          </span>
          , and breathtaking real-time analytics in a visually stunning interface.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group relative h-14 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] px-8 text-base font-semibold text-white shadow-[0_0_40px_-8px_rgba(168,85,247,0.8)] transition-all hover:shadow-[0_0_60px_-8px_rgba(168,85,247,1)] hover:scale-[1.02] border-0"
          >
            <Link href="#trading-dashboard">
              Start Trading
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-border/60 bg-card/60 px-8 text-base font-semibold backdrop-blur-sm hover:bg-secondary/80"
          >
            <Link href="/markets">
              <Globe className="mr-2 h-5 w-5" />
              Explore Markets
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating sparkle FAB */}
      <button
        aria-label="AI assistant"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] shadow-[0_0_30px_-4px_rgba(139,92,246,0.8)] transition-transform hover:scale-110"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </button>
    </section>
  );
}

// ─── News Dashboard ──────────────────────────────────────────────────────

const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Markets',
    title: 'Fed signals measured path on rates as inflation cools across core services',
    source: 'Bloomberg',
    time: '12m ago',
    sentiment: 'neutral' as const,
    tickers: ['SPY', 'QQQ'],
  },
  {
    id: 2,
    category: 'Tech',
    title: 'NVIDIA unveils next-gen Blackwell architecture — order book already stretched through 2027',
    source: 'Reuters',
    time: '34m ago',
    sentiment: 'bullish' as const,
    tickers: ['NVDA', 'AMD'],
  },
  {
    id: 3,
    category: 'Earnings',
    title: 'Apple beats on services revenue; iPhone unit sales soften in Greater China',
    source: 'CNBC',
    time: '1h ago',
    sentiment: 'neutral' as const,
    tickers: ['AAPL'],
  },
  {
    id: 4,
    category: 'Crypto',
    title: 'Bitcoin reclaims $95K as spot ETF inflows accelerate to weekly record',
    source: 'CoinDesk',
    time: '1h ago',
    sentiment: 'bullish' as const,
    tickers: ['BTC', 'COIN'],
  },
  {
    id: 5,
    category: 'Energy',
    title: 'OPEC+ extends voluntary output cuts — crude tests upper resistance band',
    source: 'WSJ',
    time: '2h ago',
    sentiment: 'bullish' as const,
    tickers: ['XOM', 'CVX'],
  },
  {
    id: 6,
    category: 'Macro',
    title: 'Jobless claims undershoot estimates as labor market shows stubborn resilience',
    source: 'Yahoo Finance',
    time: '3h ago',
    sentiment: 'bearish' as const,
    tickers: ['TLT'],
  },
];

function NewsDashboard() {
  const sentimentStyle = {
    bullish: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
    bearish: 'bg-destructive/10 text-destructive border-destructive/30',
    neutral: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30',
  };
  const sentimentLabel = { bullish: 'Bullish', bearish: 'Bearish', neutral: 'Neutral' };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a855f7]">
            <Newspaper className="h-3 w-3" />
            Live News Feed
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Market moving
            </span>{' '}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#06b6d4] bg-clip-text text-transparent">
              headlines
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">AI-curated stories with sentiment and ticker impact.</p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full border-border/60 bg-card/60 hover:bg-secondary">
          <Link href="/news">
            Open news dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {NEWS_ITEMS.map((n, i) => (
          <Link
            key={n.id}
            href="/news"
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-all hover:border-[#a855f7]/40 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-12px_rgba(139,92,246,0.35)]',
              i === 0 && 'md:col-span-2 lg:col-span-2 lg:row-span-1'
            )}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#a855f7]/[0.05] via-transparent to-[#06b6d4]/[0.05] opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-center justify-between">
              <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {n.category}
              </span>
              <span className={cn('rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', sentimentStyle[n.sentiment])}>
                {sentimentLabel[n.sentiment]}
              </span>
            </div>

            <h3 className={cn(
              'mt-4 font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-[#a855f7]',
              i === 0 ? 'text-xl md:text-2xl' : 'text-base'
            )}>
              {n.title}
            </h3>

            <div className="mt-auto pt-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground/80">{n.source}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {n.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {n.tickers.map(t => (
                  <span key={t} className="rounded-md bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Inline search (chart section) ───────────────────────────────────────

function InlineSearch({ onSelect, currentSymbol }: { onSelect: (s: Stock) => void; currentSymbol: string }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return ALL_STOCKS
      .filter(x => (x.symbol.toLowerCase().includes(s) || x.name.toLowerCase().includes(s)) && x.symbol !== currentSymbol)
      .slice(0, 5);
  }, [q, currentSymbol]);

  useEffect(() => {
    function click(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-8 items-center rounded-full border border-border bg-secondary/50 px-2.5 focus-within:border-primary/50">
        <Search className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => q && setOpen(true)}
          placeholder="Switch"
          className="w-24 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => { setQ(''); setOpen(false); }} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && q.trim() && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          {results.length ? (
            <div className="py-1">
              {results.map(s => {
                const pos = s.changePercent >= 0;
                return (
                  <button
                    key={s.symbol}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { onSelect(s); setQ(''); setOpen(false); }}
                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-secondary/70"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-primary">{s.symbol[0]}</div>
                      <div className="text-left">
                        <div className="text-xs font-semibold">{s.symbol}</div>
                        <div className="max-w-[120px] truncate text-[10px] text-muted-foreground">{s.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold font-mono">${s.price.toFixed(2)}</div>
                      <div className={cn('text-[10px] font-semibold', pos ? 'text-[hsl(var(--success))]' : 'text-destructive')}>
                        {pos ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">No matches</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main dashboard grid ─────────────────────────────────────────────────

function MainDashboard({ stock }: { stock: Stock }) {
  const [range, setRange] = useState('1M');
  const [addOpen, setAddOpen] = useState(false);
  const router = useRouter();

  const pos = stock.changePercent >= 0;
  const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Chart column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="surface overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-lg font-semibold text-primary">
                  {stock.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">{stock.symbol}</h2>
                    <span className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{stock.exchange}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-semibold">${stock.price.toFixed(2)}</span>
                    <span className={cn('flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold font-mono', pos ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]' : 'bg-destructive/10 text-destructive')}>
                      {pos ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                      {pos ? '+' : ''}{stock.change.toFixed(2)} ({pos ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <InlineSearch
                  currentSymbol={stock.symbol}
                  onSelect={s => router.push(`/?symbol=${s.symbol}`, { scroll: false })}
                />
                <div className="flex items-center gap-0.5 rounded-full border border-border bg-secondary/40 p-0.5">
                  {ranges.map(r => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                        range === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5">
              <PriceChart />
            </div>

            <div className="flex gap-3 border-t border-border p-5">
              <Button
                onClick={() => setAddOpen(true)}
                className="h-11 flex-1 rounded-xl border border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/10 font-semibold text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20"
              >
                Buy
              </Button>
              <Button
                onClick={() => setAddOpen(true)}
                className="h-11 flex-1 rounded-xl border border-destructive/20 bg-destructive/10 font-semibold text-destructive hover:bg-destructive/20"
              >
                Sell
              </Button>
            </div>
            <AddStockDialog stock={stock} isOpen={addOpen} setIsOpen={setAddOpen} />
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: 'Market cap',   v: stock.marketCap },
              { k: 'P / E',        v: stock.peRatio?.toFixed(1) ?? '—' },
              { k: 'Dividend',     v: stock.dividendYield ? `${stock.dividendYield}%` : '—' },
              { k: 'Consensus',    v: stock.analystConsensus },
            ].map(x => (
              <div key={x.k} className="surface p-4">
                <div className="text-[11px] text-muted-foreground">{x.k}</div>
                <div className={cn(
                  'mt-1 text-base font-semibold',
                  x.k === 'Consensus' && x.v === 'Buy'  && 'text-[hsl(var(--success))]',
                  x.k === 'Consensus' && x.v === 'Sell' && 'text-destructive',
                )}>{x.v}</div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  AI insight · {stock.symbol}
                  <span className="rounded-md bg-[hsl(var(--success))]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[hsl(var(--success))]">Buy</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Momentum over the last 30 sessions is constructive; order flow consolidated above
                  the prior support zone. The model projects a <span className="text-foreground font-semibold">+8.5%</span> move over
                  the next quarter with a confidence of 72%.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
                  <span className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-muted-foreground">Bullish divergence</span>
                  <span className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-muted-foreground">High order flow</span>
                  <span className="rounded-md border border-border bg-secondary/60 px-2 py-1 text-muted-foreground">Smart money in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Balance card */}
          <div className="surface p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" /> Total balance
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold tracking-tight">
              $124,562.<span className="text-muted-foreground">00</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--success))]">
              <TrendingUp className="h-3.5 w-3.5" />
              +$3,240.50 <span className="text-[hsl(var(--success))]/70">(2.60%)</span>
              <span className="font-normal text-muted-foreground">today</span>
            </div>

            <svg viewBox="0 0 100 30" className="mt-5 h-16 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d="M0,30 L0,20 Q10,25 20,15 T40,18 T60,5 T80,10 T100,5 L100,30 Z" fill="url(#balGrad)" />
              <path d="M0,20 Q10,25 20,15 T40,18 T60,5 T80,10 T100,5" fill="none" stroke="hsl(var(--success))" strokeWidth={1.5} />
            </svg>

            <div className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</div>
            <div className="mt-2 space-y-1">
              {[
                { type: 'BUY',  sym: 'NVDA', shares: 10, amount: 8520,  date: 'Today' },
                { type: 'SELL', sym: 'TSLA', shares: 25, amount: 5052.5,date: 'Yesterday' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                      tx.type === 'BUY' ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]' : 'bg-destructive/10 text-destructive'
                    )}>
                      {tx.type}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{tx.sym}</div>
                      <div className="text-[11px] text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-semibold">${tx.amount.toLocaleString()}</div>
                    <div className="text-[11px] text-muted-foreground">{tx.shares} sh</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div className="surface p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Star className="h-3.5 w-3.5 text-[hsl(var(--chart-4))]" /> Watchlist
              </div>
              <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">+</button>
            </div>
            <div className="mt-3 space-y-0.5">
              {WATCHLIST.map(w => {
                const p = w.change >= 0;
                return (
                  <button
                    key={w.sym}
                    onClick={() => router.push(`/?symbol=${w.sym}`, { scroll: false })}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-primary">{w.sym[0]}</div>
                      <span className="text-sm font-semibold">{w.sym}</span>
                    </div>
                    <svg viewBox="0 0 50 20" className="hidden h-5 w-[60px] sm:block" preserveAspectRatio="none">
                      <path
                        d={p ? 'M0,15 Q10,18 20,10 T35,5 T50,2' : 'M0,5 Q10,2 20,10 T35,15 T50,18'}
                        fill="none"
                        stroke={p ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        strokeWidth="1.25"
                      />
                    </svg>
                    <div className="text-right">
                      <div className="text-sm font-semibold font-mono">${w.price.toFixed(2)}</div>
                      <div className={cn('text-[11px] font-semibold font-mono', p ? 'text-[hsl(var(--success))]' : 'text-destructive')}>
                        {p ? '+' : ''}{w.change}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top movers */}
          <div className="surface p-5">
            <div className="text-sm font-semibold">Top movers</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5 p-3">
                <div className="text-[10px] text-muted-foreground">Top gainer</div>
                <div className="mt-1 text-base font-semibold">SMCI</div>
                <div className="text-sm font-semibold font-mono text-[hsl(var(--success))]">+14.2%</div>
              </div>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                <div className="text-[10px] text-muted-foreground">Top loser</div>
                <div className="mt-1 text-base font-semibold">SNOW</div>
                <div className="text-sm font-semibold font-mono text-destructive">-8.5%</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Sentiment</span>
                <span className="font-semibold text-[hsl(var(--success))]">Bullish</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background/70">
                <div className="h-full rounded-full bg-[hsl(var(--success))]" style={{ width: '72%' }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Fear</span><span>Greed</span>
              </div>
            </div>
          </div>

          {/* Indices */}
          <div className="surface p-5">
            <div className="text-sm font-semibold">Global indices</div>
            <div className="mt-3 space-y-1">
              {INDICES.map(i => (
                <div key={i.name} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary/50">
                  <div>
                    <div className="text-sm font-semibold">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{i.val}</div>
                  </div>
                  <div className={cn('flex items-center gap-1 text-[11px] font-semibold font-mono', i.up ? 'text-[hsl(var(--success))]' : 'text-destructive')}>
                    {i.change} {i.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper ────────────────────────────────────────────────────────

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const selectedStock = useMemo(() => {
    const symbol = searchParams.get('symbol');
    if (symbol) {
      const found = ALL_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
      if (found) return found;
    }
    return mockStocks[0];
  }, [searchParams]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Loading
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Ticker onSelect={sym => router.push(`/?symbol=${sym}`, { scroll: false })} />
      <div id="trading-dashboard" className="pt-10 scroll-mt-16">
        <MainDashboard stock={selectedStock} />
      </div>
      <NewsDashboard />
    </div>
  );
}
