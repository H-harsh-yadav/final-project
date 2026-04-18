"use client";

import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAiForecast } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import type { Stock } from '@/lib/mock-data';

interface AiAnalysisProps {
    stock: Stock;
}

export function AiAnalysis({ stock }: AiAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    setIsFallback(false);

    const result = await getAiForecast(stock.symbol);
    
    setAnalysis(result.forecast);
    if (result.error) {
      setError(result.error);
      setIsFallback(true);
    }
    setIsLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>AI-Powered Strategic Analysis</CardTitle>
        </div>
        <CardDescription>
          Get an AI-generated strategic forecast for {stock.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : analysis ? (
            <div>
                {isFallback && <Badge variant="destructive" className="mb-2">Fallback Data</Badge>}
                <p className="text-sm whitespace-pre-wrap">{analysis}</p>
            </div>
        ) : (
          <div className="text-center">
            <Button onClick={handleGenerateAnalysis}>
              <Zap className="mr-2 h-4 w-4" />
              Generate Forecast
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
                Analysis based on mock news and historical data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
