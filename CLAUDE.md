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

## Environment Setup

Set `VITE_GEMINI_API_KEY` in `.env.local` for the Gemini AI integration.

## Architecture

This is a KRW/USD exchange rate application built with React 19, Vite, and TypeScript. It displays current exchange rates, a 30-day history chart, and AI-powered market insights via Google's Gemini API.

### Project Structure

```
ai-Test/
├── components/           # React components
│   ├── AIInsights.tsx    # AI market analysis panel (lazy loaded)
│   ├── Converter.tsx     # Bidirectional currency converter
│   ├── ErrorBoundary.tsx # Error boundary wrapper
│   ├── Header.tsx        # App header with dark mode toggle
│   ├── HistoryChart.tsx  # Exchange rate chart (lazy loaded)
│   ├── Skeleton.tsx      # Loading skeleton components
│   └── Toast.tsx         # Toast notification system
├── hooks/                # Custom React hooks
│   ├── useExchangeRate.ts # Exchange rate data fetching & state
│   └── useToast.ts       # Toast state management
├── services/
│   └── geminiService.ts  # Gemini API integration
├── test/                 # Vitest test files
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
└── types.ts              # TypeScript type definitions
```

### Key Components

- `App.tsx` - Main component that uses `useExchangeRate` hook, renders UI with lazy-loaded chart and AI components
- `hooks/useExchangeRate.ts` - Custom hook for fetching exchange rates, managing period/chart state
- `hooks/useToast.ts` - Custom hook for toast notification state management
- `components/Converter.tsx` - Bidirectional USD/KRW currency converter with input validation
- `components/AIInsights.tsx` - On-demand AI analysis panel using Gemini (lazy loaded)
- `components/HistoryChart.tsx` - 30-day rate history visualization using Recharts (lazy loaded)
- `components/Skeleton.tsx` - Loading skeleton components for better UX
- `components/Toast.tsx` - Toast notification system with 4 types (success/error/warning/info)
- `components/ErrorBoundary.tsx` - Error boundary for graceful error handling
- `services/geminiService.ts` - Gemini API integration with response validation

### Data Flow

1. `useExchangeRate` hook fetches current USD/KRW rate from open.er-api.com on mount
2. Mock historical data is generated based on current rate (API doesn't provide real history)
3. Exchange data flows to child components via props
4. AI insights are fetched on-demand when user clicks the analysis button
5. Toast notifications provide user feedback for actions and errors

### Types

All shared types are in `types.ts`: `ExchangeData`, `HistoryPoint`, `Currency` enum, and `MarketInsight`.

### Code Splitting

The app uses React.lazy() for code splitting:
- `HistoryChart` - Loaded when chart is rendered (~360KB)
- `AIInsights` - Loaded when AI panel is rendered (~52KB)

### Testing

Tests are in `test/` directory using Vitest and Testing Library:
- `useExchangeRate.test.ts` - Hook tests for API fetching, error handling, state changes
- `useToast.test.ts` - Hook tests for toast lifecycle
- `Converter.test.tsx` - Component tests for currency conversion

### User direction

1. 한글로만 대답해줘.
