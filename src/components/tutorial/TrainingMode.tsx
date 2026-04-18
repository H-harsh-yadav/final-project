'use client';

import { useState } from 'react';
import { mockStocks } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Scenario = {
    stockSymbol: string;
    decision: 'buy' | 'sell';
    prompt: string;
    goodAction: 'buy' | 'sell' | 'hold';
    feedback: {
        buy: string;
        sell: string;
        hold: string;
    };
    outcome: {
        buy: string;
        sell: string;
        hold: string;
    }
};

const scenarios: Scenario[] = [
    {
        stockSymbol: 'NVDA',
        decision: 'buy',
        prompt: "NVIDIA's stock is gaining momentum after they announced a groundbreaking new AI chip. The market is bullish. What should you do?",
        goodAction: 'buy',
        feedback: {
            buy: "Excellent choice! Buying during positive momentum and strong company news is a great strategy. You capitalized on the market's optimism.",
            sell: "Selling now might be premature. The positive news suggests the stock has more room to grow. You might miss out on potential gains.",
            hold: "Holding is a safe bet, but given the strong positive news, buying could have maximized your potential return. It's a reasonable but conservative move."
        },
        outcome: {
            buy: "Outcome: The stock price surged by 5% after your purchase. You're in a profitable position.",
            sell: "Outcome: The stock price surged by 5%. You locked in your current value but missed the gains.",
            hold: "Outcome: The stock price surged by 5%. Your position's value increased, but you could have amplified gains by buying more."
        }
    },
    {
        stockSymbol: 'PFE',
        decision: 'sell',
        prompt: "Pfizer's stock has been downgraded by analysts due to concerns about its drug pipeline, and the stock has been trending down. What's your move?",
        goodAction: 'sell',
        feedback: {
            buy: "Buying a stock that's in a downtrend with negative news is risky. This is often called 'catching a falling knife'. It's usually better to wait for signs of a reversal.",
            sell: "A smart move. Selling a stock with negative momentum and poor analyst ratings can protect you from further losses. This is a key part of risk management.",
            hold: "Holding on could lead to further losses if the downtrend continues. While it might recover, the current signs are bearish. Selling might be a safer option."
        },
        outcome: {
            buy: "Outcome: The stock price dropped another 4%. Your new position is now at a loss.",
            sell: "Outcome: The stock price dropped another 4%. You successfully avoided additional losses.",
            hold: "Outcome: The stock price dropped another 4%. Your investment has lost more value."
        }
    }
];

export function TrainingMode() {
    const [step, setStep] = useState(0);
    const [userAction, setUserAction] = useState<'buy' | 'sell' | 'hold' | null>(null);

    const currentScenario = scenarios[step];
    const stock = mockStocks.find(s => s.symbol === currentScenario.stockSymbol);

    if (!stock) {
        return <p>Error loading scenario.</p>;
    }

    const handleAction = (action: 'buy' | 'sell' | 'hold') => {
        setUserAction(action);
    };

    const handleNext = () => {
        setUserAction(null);
        setStep((s) => (s + 1) % scenarios.length);
    }

    const handleReset = () => {
        setUserAction(null);
        setStep(0);
    }

    const feedbackText = userAction ? currentScenario.feedback[userAction] : "";
    const outcomeText = userAction ? currentScenario.outcome[userAction] : "";
    const actionColor = userAction === currentScenario.goodAction ? 'text-green-500' : 'text-orange-500';

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-2xl">Interactive Training Mode</CardTitle>
                <CardDescription>Practice your trading skills in a risk-free environment.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                    <p className="font-semibold text-lg mb-2">Scenario {step + 1}: {stock.name} ({stock.symbol})</p>
                    <p>{currentScenario.prompt}</p>
                </div>

                {!userAction ? (
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => handleAction('buy')} variant="default" size="lg" className="bg-green-600 hover:bg-green-700">Buy</Button>
                        <Button onClick={() => handleAction('hold')} variant="secondary" size="lg">Hold</Button>
                        <Button onClick={() => handleAction('sell')} variant="destructive" size="lg">Sell</Button>
                    </div>
                ) : (
                    <Alert className={userAction === currentScenario.goodAction ? "border-green-500" : "border-orange-500"}>
                        <AlertTitle className={`font-bold ${actionColor}`}>You chose to {userAction}.</AlertTitle>
                        <AlertDescription className="space-y-2 mt-2">
                            <p><span className="font-semibold">Feedback:</span> {feedbackText}</p>
                            <p className="font-semibold">{outcomeText}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                {userAction && (
                    step < scenarios.length - 1 ? (
                        <Button onClick={handleNext}>
                            Next Scenario <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleReset}>
                            Restart Training <RefreshCw className="ml-2 h-4 w-4" />
                        </Button>
                    )
                )}
            </CardFooter>
        </Card>
    );
}
