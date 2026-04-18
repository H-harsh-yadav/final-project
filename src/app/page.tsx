import { Suspense } from 'react';
import Dashboard from '@/components/stocks/Dashboard';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Dashboard />
    </Suspense>
  );
}
