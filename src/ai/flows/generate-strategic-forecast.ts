'use server';

/**
 * @fileOverview AI-powered strategic forecast generator for stock investments.
 *
 * - generateStrategicForecast - Generates strategic forecast for a given stock.
 * - GenerateStrategicForecastInput - Input type for the generateStrategicForecast function.
 * - GenerateStrategicForecastOutput - Output type for the generateStrategicForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrategicForecastInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock to forecast.'),
  historicalData: z.string().describe('Historical stock data.'),
  newsArticles: z.string().describe('Relevant news articles about the stock.'),
});
export type GenerateStrategicForecastInput = z.infer<typeof GenerateStrategicForecastInputSchema>;

const GenerateStrategicForecastOutputSchema = z.object({
  forecast: z.string().describe('A strategic forecast for the given stock.'),
});
export type GenerateStrategicForecastOutput = z.infer<typeof GenerateStrategicForecastOutputSchema>;

export async function generateStrategicForecast(
  input: GenerateStrategicForecastInput
): Promise<GenerateStrategicForecastOutput> {
  return generateStrategicForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrategicForecastPrompt',
  input: {schema: GenerateStrategicForecastInputSchema},
  output: {schema: GenerateStrategicForecastOutputSchema},
  prompt: `You are an expert financial analyst. Generate a strategic forecast for the stock {{{ticker}}} based on the following information:

Historical Data:
{{historicalData}}

News Articles:
{{newsArticles}}

Provide a detailed and actionable forecast.
`,
});

const generateStrategicForecastFlow = ai.defineFlow(
  {
    name: 'generateStrategicForecastFlow',
    inputSchema: GenerateStrategicForecastInputSchema,
    outputSchema: GenerateStrategicForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
