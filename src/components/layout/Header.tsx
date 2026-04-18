'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Zap, X, Check, TrendingUp, TrendingDown, AlertTriangle, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/firebase';
import { UserNav } from '@/components/auth/UserNav';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
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
  { id: '1', icon: 'trending-up', title: 'NVDA hit all-time high', description: 'NVIDIA surged 2.67% to $877.35, reaching a new 52-week high.', time: '5 min ago', read: false },
  { id: '2', icon: 'alert', title: 'Portfolio alert', description: 'Your TSLA position is up 1.78% today. Consider reviewing your target.', time: '12 min ago', read: false },
  { id: '3', icon: 'news', title: 'Earnings report incoming', description: 'Apple Inc. is scheduled to report Q2 earnings after market close.', time: '1 hr ago', read: false },
  { id: '4', icon: 'trending-down', title: 'JPM dipped below support', description: 'JPMorgan dropped 1.01%. It may test the $195 support level.', time: '2 hr ago', read: true },
  { id: '5', icon: 'news', title: 'Fed rate decision tomorrow', description: 'Markets are pricing in a 75% chance of a rate hold at tomorrow\'s FOMC meeting.', time: '3 hr ago', read: true },
];

function NotificationIcon({ type }: { type: Notification['icon'] }) {
  const base = "h-4 w-4";
  switch (type) {
    case 'trending-up': return <TrendingUp className={cn(base, "text-neon-green")} />;
    case 'trending-down': return <TrendingDown className={cn(base, "text-neon-red")} />;
    case 'alert': return <AlertTriangle className={cn(base, "text-neon-gold")} />;
    case 'news': return <Newspaper className={cn(base, "text-neon-cyan")} />;
  }
}

export function Header() {
  const { user, isUserLoading: loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '◈' },
    { href: '/markets', label: 'Markets', icon: '◎' },
    { href: '/portfolio', label: 'Portfolio', icon: '⬡' },
    { href: '/news', label: 'News', icon: '◆' },
    { href: '/strategies', label: 'Analytics', icon: '◇' },
    { href: '/tutorial', label: 'Tutorial', icon: '▣' },
  ];

  // Filter stocks based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_STOCKS
      .filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleStockSelect(stock: Stock) {
    setSearchQuery('');
    setShowSearchResults(false);
    // Navigate to dashboard with selected stock
    router.push(`/?symbol=${stock.symbol}`);
  }

  function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function dismissNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }
  
  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-[100] w-full transition-all duration-500"
    >
      {/* Glass header bar */}
      <div className="relative border-b border-white/10 dark:border-white/5 bg-background/70 backdrop-blur-2xl">
        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-50" 
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.5) 30%, hsl(var(--neon-cyan) / 0.4) 50%, hsl(var(--primary) / 0.5) 70%, transparent 100%)',
          }}
        />

        <div className="container flex h-16 max-w-7xl items-center">
          {/* LOGO */}
          <Link href="/" className="mr-8 flex items-center space-x-2.5 group relative">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }} 
              whileTap={{ scale: 0.9 }} 
              className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden"
            >
              {/* Logo background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-neon-purple to-neon-cyan opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-neon-purple to-neon-cyan opacity-40 animate-pulse-glow" />
              <Zap className="h-5 w-5 text-white relative z-10 drop-shadow-lg" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight gradient-text-primary">
                StockBro
              </span>
              <span className="text-[9px] font-medium text-muted-foreground tracking-widest uppercase -mt-0.5">
                AI Trading
              </span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden flex-1 items-center space-x-1 lg:flex">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full flex items-center gap-1.5',
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill" 
                        className="absolute inset-0 rounded-full" 
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--neon-cyan) / 0.08) 100%)`,
                          border: '1px solid hsl(var(--primary) / 0.2)',
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.span 
                        layoutId="nav-glow" 
                        className="absolute -bottom-[1px] left-1/4 right-1/4 h-[2px] rounded-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--neon-cyan)), hsl(var(--primary)), transparent)`,
                          boxShadow: `0 0 12px hsl(var(--primary) / 0.6)`,
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex flex-1 items-center justify-end space-x-3">
            
            {/* SEARCH BAR */}
            <div ref={searchRef} className="hidden md:block relative">
              <motion.div 
                animate={{ width: isSearchFocused ? 280 : 200 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex relative items-center transition-all duration-300 rounded-full border overflow-hidden",
                  isSearchFocused 
                    ? "bg-card/80 border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.1)]" 
                    : "bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 hover:border-primary/20"
                )}
              >
                <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Search AAPL, TSLA..." 
                  className="pl-10 h-9 w-full bg-transparent border-none outline-none focus-visible:ring-0 shadow-none text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (searchQuery.trim()) setShowSearchResults(true);
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }
                    if (e.key === 'Enter' && searchResults.length > 0) {
                      handleStockSelect(searchResults[0]);
                    }
                  }}
                />
                <div className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground/70 bg-white/5 dark:bg-white/5 border border-white/10">
                  /
                </div>
              </motion.div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
              {showSearchResults && searchQuery.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full mt-2 w-80 right-0 rounded-2xl overflow-hidden z-[100] glass-card-premium"
                  style={{
                    boxShadow: `0 20px 60px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--primary) / 0.1)`,
                  }}
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-neon-cyan animate-pulse" />
                        Stocks
                      </div>
                      {searchResults.map((stock, idx) => {
                        const isPos = stock.changePercent >= 0;
                        return (
                          <motion.button
                            key={stock.symbol}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onMouseDown={(e) => e.preventDefault()} // prevent blur
                            onClick={() => handleStockSelect(stock)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-neon-cyan/10 flex items-center justify-center font-bold text-primary text-xs group-hover:scale-110 group-hover:shadow-lg transition-all duration-200">
                                {stock.symbol[0]}
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-sm group-hover:text-primary transition-colors">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[140px]">{stock.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">${stock.price.toFixed(2)}</div>
                              <div className={cn("text-xs font-bold", isPos ? "text-neon-green" : "text-neon-red")}>
                                {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">No stocks found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Try searching by symbol or company name</p>
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            <nav className="flex items-center space-x-2">
              {/* NOTIFICATION BELL */}
              <div ref={notifRef} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-white/5 transition-all duration-200"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className={cn("h-5 w-5 transition-colors", showNotifications ? "text-primary" : "text-muted-foreground hover:text-foreground")} />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--neon-red)), hsl(var(--neon-magenta)))',
                        boxShadow: '0 0 8px hsl(var(--neon-red) / 0.6)',
                      }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 w-96 rounded-2xl overflow-hidden z-[110] bg-card/95 backdrop-blur-xl border border-white/10"
                    style={{
                      boxShadow: `0 20px 60px hsl(var(--primary) / 0.25), 0 0 0 1px hsl(var(--primary) / 0.1)`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-neon-cyan"
                            style={{ background: 'hsl(var(--neon-cyan) / 0.1)', border: '1px solid hsl(var(--neon-cyan) / 0.2)' }}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif, idx) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                              "flex gap-3 p-4 border-b border-white/5 hover:bg-primary/[0.03] transition-all duration-200 group relative",
                              !notif.read && "bg-primary/[0.03]"
                            )}
                          >
                            {/* Unread dot */}
                            {!notif.read && (
                              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_hsl(var(--neon-cyan)/0.6)]" />
                            )}
                            
                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <NotificationIcon type={notif.icon} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-foreground/90 leading-tight">{notif.title}</div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.description}</p>
                              <span className="text-[10px] text-muted-foreground/60 mt-1 block">{notif.time}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-neon-green transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => dismissNotification(notif.id)}
                                className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-neon-red transition-colors"
                                title="Dismiss"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                          <p className="text-sm text-muted-foreground">All caught up!</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">No notifications at the moment</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              
              <ThemeToggle />
              
              {loading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : user ? (
                <UserNav />
              ) : (
                <>
                  <Button variant="ghost" asChild className="rounded-full hidden sm:flex hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="rounded-full text-sm font-semibold border-none transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))`,
                      boxShadow: `0 0 20px hsl(var(--primary) / 0.3)`,
                    }}
                  >
                    <Link href="/signup">
                      <span className="relative z-10">Sign Up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
