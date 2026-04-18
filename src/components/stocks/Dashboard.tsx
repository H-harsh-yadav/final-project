"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, Search, X, ArrowRight, ArrowUpRight, ArrowDownRight, Star, Bot } from 'lucide-react';
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
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-14 md:pt-28 md:pb-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
          Markets open · Systems operational
        </div>

        <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
          <span className="text-gradient">Stocks,</span>
          <br />
          <span className="text-foreground">refined by AI.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          A minimal, fast dashboard for tracking the tickers you care about —
          with clean charts, an AI analyst, and no visual noise.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
            <Link href="#trading-dashboard">
              Open dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 rounded-full border-border bg-card px-6 hover:bg-secondary">
            <Link href="/markets">Browse markets</Link>
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border/60 pt-8 text-left">
          {[
            { k: 'Tickers tracked', v: '10,000+' },
            { k: 'Monthly users', v: '150K' },
            { k: 'Uptime',        v: '99.9%' },
          ].map(x => (
            <div key={x.k}>
              <div className="font-mono text-2xl font-semibold tracking-tight md:text-3xl">{x.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{x.k}</div>
            </div>
          ))}
        </div>
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
    </div>
  );
}
