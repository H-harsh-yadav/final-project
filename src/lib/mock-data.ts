export type Stock = {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number | null;
  dividendYield: number | null;
  analystConsensus: 'Buy' | 'Hold' | 'Sell';
};

export const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 182.43, change: 1.25, changePercent: 0.69, marketCap: '3.2T', peRatio: 32.5, dividendYield: 0.5, analystConsensus: 'Buy' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 177.85, change: -0.52, changePercent: -0.29, marketCap: '2.1T', peRatio: 27.1, dividendYield: null, analystConsensus: 'Buy' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', price: 427.56, change: 2.91, changePercent: 0.68, marketCap: '3.1T', peRatio: 37.8, dividendYield: 0.7, analystConsensus: 'Buy' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ', price: 183.63, change: -1.47, changePercent: -0.80, marketCap: '1.9T', peRatio: 51.4, dividendYield: null, analystConsensus: 'Hold' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', price: 178.01, change: 3.11, changePercent: 1.78, marketCap: '580B', peRatio: 45.2, dividendYield: null, analystConsensus: 'Hold' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', price: 877.35, change: 22.81, changePercent: 2.67, marketCap: '2.9T', peRatio: 75.9, dividendYield: 0.03, analystConsensus: 'Buy' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', price: 198.88, change: -2.03, changePercent: -1.01, marketCap: '570B', peRatio: 11.8, dividendYield: 2.3, analystConsensus: 'Buy' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', price: 274.22, change: 1.98, changePercent: 0.73, marketCap: '550B', peRatio: 30.5, dividendYield: 0.8, analystConsensus: 'Buy' },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', price: 67.17, change: 0.45, changePercent: 0.68, marketCap: '540B', peRatio: 28.1, dividendYield: 1.4, analystConsensus: 'Hold' },
  { symbol: 'PFE', name: 'Pfizer Inc.', exchange: 'NYSE', price: 28.31, change: -0.12, changePercent: -0.42, marketCap: '160B', peRatio: 15.3, dividendYield: 5.9, analystConsensus: 'Sell' },
];

export const mockIndianStocks: Stock[] = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', exchange: 'NSE', price: 2850.00, change: 15.50, changePercent: 0.55, marketCap: '19.3T', peRatio: 28.5, dividendYield: 0.3, analystConsensus: 'Buy' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', exchange: 'NSE', price: 3850.75, change: -20.10, changePercent: -0.52, marketCap: '13.9T', peRatio: 30.2, dividendYield: 1.2, analystConsensus: 'Buy' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', exchange: 'NSE', price: 1530.25, change: 5.80, changePercent: 0.38, marketCap: '11.6T', peRatio: 19.8, dividendYield: 1.0, analystConsensus: 'Hold' },
    { symbol: 'INFY.NS', name: 'Infosys Ltd.', exchange: 'NSE', price: 1505.50, change: 10.25, changePercent: 0.68, marketCap: '6.3T', peRatio: 24.1, dividendYield: 1.8, analystConsensus: 'Buy' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', exchange: 'NSE', price: 1120.00, change: -8.45, changePercent: -0.75, marketCap: '7.8T', peRatio: 18.5, dividendYield: 0.7, analystConsensus: 'Buy' },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', price: 2380.15, change: 12.90, changePercent: 0.54, marketCap: '5.6T', peRatio: 56.7, dividendYield: 1.6, analystConsensus: 'Hold' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', exchange: 'NSE', price: 830.60, change: 4.10, changePercent: 0.50, marketCap: '7.4T', peRatio: 10.9, dividendYield: 1.6, analystConsensus: 'Buy' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', exchange: 'NSE', price: 1385.20, change: -15.80, changePercent: -1.13, marketCap: '8.3T', peRatio: 65.4, dividendYield: 0.3, analystConsensus: 'Sell' },
];


export function getMockHistoricalData() {
  const data = [];
  let price = 150 + Math.random() * 20;
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    price += (Math.random() - 0.5) * 5;
    if (price < 100) price = 100;
    if (price > 250) price = 250;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

export const mockNews = [
    { headline: "Tech Giant Unveils New AI Chip, Stock Surges", summary: "The company's stock price jumped 15% after the announcement of a groundbreaking new AI processor, expected to dominate the market." },
    { headline: "Quarterly Earnings Exceed Expectations", summary: "Strong sales in cloud and gaming divisions led to a record-breaking quarter, with revenue up 20% year-over-year." },
    { headline: "Analyst Downgrades Stock to 'Hold' Amidst Regulatory Concerns", summary: "An influential market analyst has revised their recommendation from 'Buy' to 'Hold', citing potential for increased government regulation in the tech sector." },
    { headline: "Supply Chain Issues Continue to Plague Manufacturing", summary: "Persistent global supply chain disruptions are expected to impact production targets for the next two quarters, potentially affecting profitability." },
];
