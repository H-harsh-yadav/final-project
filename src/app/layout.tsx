import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { StockPriceProvider } from '@/context/stock-price-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'StockBro — Stocks, refined.',
  description: 'A minimal, fast stock dashboard with AI-powered insights.',
  keywords: ['stocks', 'trading', 'AI', 'portfolio', 'finance'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FirebaseClientProvider>
            <StockPriceProvider>
              <div className="relative flex min-h-screen w-full flex-col bg-background">
                {/* One tasteful ambient gradient, no JS animation */}
                <div
                  aria-hidden
                  className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[560px] opacity-60"
                  style={{
                    background:
                      'radial-gradient(60% 80% at 50% 0%, hsl(var(--primary) / 0.16) 0%, transparent 70%)',
                  }}
                />
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </StockPriceProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
