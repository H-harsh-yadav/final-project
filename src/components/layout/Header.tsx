'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Check, X, TrendingUp, TrendingDown, AlertTriangle, Newspaper } from 'lucide-react';
import { useUser } from '@/firebase';
import { UserNav } from '@/components/auth/UserNav';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useState, useRef, useEffect, useMemo } from 'react';
import { mockStocks, mockIndianStocks, type Stock } from '@/lib/mock-data';

const ALL_STOCKS = [...mockStocks, ...mockIndianStocks];

type Notification = {
  id: string;
  icon: 'trending-up' | 'trending-down' | 'alert' | 'news';
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: 'trending-up', title: 'NVDA hit a new high', description: 'NVIDIA surged 2.67% to $877.35.', time: '5m', read: false },
  { id: '2', icon: 'alert', title: 'Portfolio alert', description: 'TSLA up 1.78% today.', time: '12m', read: false },
  { id: '3', icon: 'news', title: 'Apple earnings today', description: 'Scheduled after market close.', time: '1h', read: false },
  { id: '4', icon: 'trending-down', title: 'JPM under support', description: 'JPMorgan dropped 1.01%.', time: '2h', read: true },
];

function NotifIcon({ type }: { type: Notification['icon'] }) {
  const c = 'h-4 w-4';
  if (type === 'trending-up') return <TrendingUp className={cn(c, 'text-[hsl(var(--success))]')} />;
  if (type === 'trending-down') return <TrendingDown className={cn(c, 'text-destructive')} />;
  if (type === 'alert') return <AlertTriangle className={cn(c, 'text-[hsl(var(--chart-4))]')} />;
  return <Newspaper className={cn(c, 'text-primary')} />;
}

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/markets', label: 'Markets' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/news', label: 'News' },
  { href: '/strategies', label: 'Strategies' },
  { href: '/tutorial', label: 'Learn' },
];

export function Header() {
  const { user, isUserLoading: loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const [q, setQ] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return ALL_STOCKS.filter(x => x.symbol.toLowerCase().includes(s) || x.name.toLowerCase().includes(s)).slice(0, 6);
  }, [q]);

  useEffect(() => {
    function click(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  function pickStock(s: Stock) {
    setQ('');
    setShowResults(false);
    router.push(`/?symbol=${s.symbol}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-primary-foreground text-[11px] font-bold">
            SB
          </div>
          <span className="text-[15px] font-semibold tracking-tight">StockBro</span>
        </Link>

        {/* Nav */}
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div ref={searchRef} className="relative hidden md:block ml-auto">
          <div className="flex h-9 w-[240px] items-center rounded-full border border-border bg-secondary/50 px-3 focus-within:border-primary/50">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={e => { setQ(e.target.value); setShowResults(true); }}
              onFocus={() => q && setShowResults(true)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setShowResults(false); setQ(''); }
                if (e.key === 'Enter' && results.length) pickStock(results[0]);
              }}
              placeholder="Search stocks…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="ml-2 rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">/</kbd>
          </div>

          {showResults && q.trim() && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
              {results.length ? (
                <div className="py-1">
                  {results.map(s => {
                    const pos = s.changePercent >= 0;
                    return (
                      <button
                        key={s.symbol}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => pickStock(s)}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-secondary/70"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary font-semibold text-primary text-[11px]">
                            {s.symbol[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold">{s.symbol}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{s.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[13px] font-semibold font-mono">${s.price.toFixed(2)}</div>
                          <div className={cn('text-[11px] font-semibold', pos ? 'text-[hsl(var(--success))]' : 'text-destructive')}>
                            {pos ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">No stocks found for “{q}”.</div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <div ref={notifRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifs(v => !v)}
              className="relative h-9 w-9 rounded-full hover:bg-secondary"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
            {showNotifs && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="text-sm font-semibold">Notifications</div>
                  {unread > 0 && (
                    <button
                      onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifs.length ? notifs.map(n => (
                    <div key={n.id} className={cn('group relative flex gap-3 border-b border-border/70 px-4 py-3 last:border-0 hover:bg-secondary/50', !n.read && 'bg-primary/[0.04]')}>
                      {!n.read && <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />}
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
                        <NotifIcon type={n.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold leading-tight">{n.title}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.description}</div>
                        <div className="mt-1 text-[10px] text-muted-foreground/80">{n.time} ago</div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!n.read && (
                          <button onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))} className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-[hsl(var(--success))]">
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button onClick={() => setNotifs(p => p.filter(x => x.id !== n.id))} className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">All caught up.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" size="sm" className="rounded-full hidden sm:inline-flex hover:bg-secondary">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
