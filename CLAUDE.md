# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report

## Architecture

This is a KRW/USD exchange rate application built with React 19, Vite, and TypeScript. It displays current exchange rates, a 30-day history chart, multi-currency comparison, and exchange rate news.

### Project Structure

```
ai-Test/
├── components/              # React components
│   ├── ComparisonChart.tsx  # Multi-currency comparison chart (lazy loaded)
│   ├── Converter.tsx        # Bidirectional currency converter
│   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   ├── ExchangeNews.tsx     # Exchange rate news from Google RSS (lazy loaded)
│   ├── Header.tsx           # App header with dark mode toggle
│   ├── HistoryChart.tsx     # Exchange rate chart (lazy loaded)
│   ├── RateStatistics.tsx   # Rate statistics cards (lazy loaded)
│   ├── MarketIndicators.tsx # WTI oil price and KOSPI index cards
│   ├── Skeleton.tsx         # Loading skeleton components
│   └── Toast.tsx            # Toast notification system
├── hooks/                   # Custom React hooks
│   ├── useExchangeRate.ts   # Exchange rate data fetching & state
│   ├── useMarketData.ts     # WTI and KOSPI data fetching
│   └── useToast.ts          # Toast state management
├── test/                    # Vitest test files
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
└── types.ts                 # TypeScript type definitions
```

### Key Components

- `App.tsx` - Main component that uses `useExchangeRate` hook, renders UI with lazy-loaded components
- `hooks/useExchangeRate.ts` - Custom hook for fetching exchange rates from frankfurter.app API (KRW, EUR, JPY, CNY)
- `hooks/useToast.ts` - Custom hook for toast notification state management
- `components/Converter.tsx` - Bidirectional USD/KRW currency converter with input validation
- `components/HistoryChart.tsx` - 30-day rate history visualization using Recharts (lazy loaded)
- `components/RateStatistics.tsx` - Statistics cards showing high/low/average/change rate
- `components/ComparisonChart.tsx` - Multi-currency comparison chart (EUR, JPY, CNY vs USD)
- `components/ExchangeNews.tsx` - Latest exchange rate news via Google News RSS
- `components/MarketIndicators.tsx` - WTI oil price and KOSPI index cards
- `hooks/useMarketData.ts` - Custom hook for fetching WTI and KOSPI data from Yahoo Finance
- `components/Skeleton.tsx` - Loading skeleton components for better UX
- `components/Toast.tsx` - Toast notification system with 4 types (success/error/warning/info)
- `components/ErrorBoundary.tsx` - Error boundary for graceful error handling

### Data Flow

1. `useExchangeRate` hook fetches current rates and 30-day history from frankfurter.app on mount
2. Supports multiple currencies: KRW, EUR, JPY, CNY
3. Exchange data flows to child components via props
4. News is fetched from Google News RSS via rss2json proxy
5. Toast notifications provide user feedback for actions and errors

### Types

All shared types are in `types.ts`:
- `ExchangeData` - Main data structure with rate, rates, history, multiHistory
- `HistoryPoint` - Single history data point (date, rate)
- `MultiCurrencyHistory` - Multi-currency history data point
- `MultiCurrencyRates` - Current rates for all currencies
- `RateStatistics` - Statistics data (high, low, average, changeRate)
- `NewsItem` - News article data
- `Currency` enum - Supported currencies (USD, KRW, EUR, JPY, CNY)

### Code Splitting

The app uses React.lazy() for code splitting:
- `HistoryChart` - Loaded when chart is rendered
- `RateStatistics` - Loaded with statistics data
- `ComparisonChart` - Loaded for multi-currency comparison
- `ExchangeNews` - Loaded for news section

### Testing

Tests are in `test/` directory using Vitest and Testing Library:
- `useExchangeRate.test.ts` - Hook tests for API fetching, error handling, state changes
- `useToast.test.ts` - Hook tests for toast lifecycle
- `Converter.test.tsx` - Component tests for currency conversion

### APIs Used

- **frankfurter.app** - Free exchange rate API (no key required)
- **rss2json.com** - RSS to JSON proxy for Google News
- **query1.finance.yahoo.com** - WTI oil price and KOSPI index data (unofficial, free)

### Deployment

- Hosted on Vercel
- Live URL: https://krw-usd-fx-insights.vercel.app

### User direction

1. 한글로만 대답해줘.
