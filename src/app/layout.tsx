import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { StockPriceProvider } from '@/context/stock-price-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Chatbot } from '@/components/ui/chatbot';
import { BackgroundEffects } from '@/components/ui/BackgroundEffects';

export const metadata: Metadata = {
  title: 'StockBro — AI-Powered Stock Trading Platform',
  description: 'Experience the future of trading with StockBro. AI-powered execution, real-time analytics, and breathtaking portfolio management in one seamless premium platform.',
  keywords: ['stocks', 'trading', 'AI', 'portfolio', 'analytics', 'finance'],
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FirebaseClientProvider>
            <StockPriceProvider>
            <BackgroundEffects />
            <div className="relative flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
            <Chatbot />
          </StockPriceProvider>
        </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
