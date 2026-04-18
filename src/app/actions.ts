"use server";

import { generateStrategicForecast } from '@/ai/flows/generate-strategic-forecast';
import { getMockHistoricalData, mockNews } from '@/lib/mock-data';

export async function getAiForecast(ticker: string): Promise<{ forecast: string; error: string | null; }> {
  try {
    const historicalData = getMockHistoricalData();
    const historicalDataString = `Last 30 days price data for ${ticker}: \n` + 
      historicalData.slice(-30).map(d => `${d.date}: $${d.price}`).join('\n');

    const newsArticlesString = mockNews.map(a => `Headline: ${a.headline}\nSummary: ${a.summary}`).join('\n\n');

    const result = await generateStrategicForecast({
      ticker,
      historicalData: historicalDataString,
      newsArticles: newsArticlesString,
    });
    
    return { forecast: result.forecast, error: null };
  } catch (error) {
    console.error("AI forecast generation failed:", error);
    // Return a fallback forecast if the AI call fails
    return {
      forecast: "The AI strategic analysis is currently unavailable. As a fallback, here is a sample analysis:\n\nBased on recent positive earnings reports and strong market positioning in the cloud computing sector, this stock shows a bullish outlook. We recommend a 'Buy' with a target price of $450 over the next 6-12 months. Key risks include increased regulatory scrutiny and competition from emerging players in the space.",
      error: "Live analysis failed. Displaying fallback data."
    };
  }
}
