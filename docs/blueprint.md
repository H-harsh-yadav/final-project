# **App Name**: StockBro

## Core Features:

- Dynamic Stock Search: Implement a real-time search bar with suggestions for stock symbols.
- Stock Details Card: Display essential stock information including company name, symbol, exchange, market cap, P/E ratio, dividend yield, and analyst consensus.
- Interactive Price Chart: Render a line chart with historical stock price data and togglable SMA/EMA technical indicators.
- AI-Powered Strategic Analysis: Integrate a Genkit flow to generate strategic forecasts based on historical data and news articles using a selected AI model; if live analysis fails, display a fallback example.
- User Authentication: Implement user signup and login functionality with Firebase Authentication.
- Portfolio Management: Enable logged-in users to add, update, and view stocks in their portfolio, calculating total market value, cost basis, and gain/loss; storing data in Firestore.
- Investment Strategies CRUD: Enable users to create, read, update, and delete personal investment strategies with a title and detailed description; storing data in Firestore.

## Style Guidelines:

- Primary color: Deep Blue (#1E3A8A) to evoke trust and stability, reflecting the seriousness of financial analysis.
- Background color: Dark Gray (#1F2937) for a modern dark theme.
- Accent color: Teal (#38BDF8) for interactive elements and highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern and neutral look.
- Utilize icons from the lucide-react library.
- Implement a fully responsive layout usable on all screen sizes.
- Use subtle animations for loading states (skeletons, spinners) during data fetching.