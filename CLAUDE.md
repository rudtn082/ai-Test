# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` for the Gemini AI integration.

## Architecture

This is a KRW/USD exchange rate application built with React 19, Vite, and TypeScript. It displays current exchange rates, a 30-day history chart, and AI-powered market insights via Google's Gemini API.

### Key Components

- `App.tsx` - Main component that fetches exchange rates from open.er-api.com and generates mock historical data
- `components/Converter.tsx` - Bidirectional USD/KRW currency converter
- `components/AIInsights.tsx` - On-demand AI analysis panel using Gemini
- `components/HistoryChart.tsx` - 30-day rate history visualization using Recharts
- `services/geminiService.ts` - Gemini API integration with structured JSON response schema

### Data Flow

1. App fetches current USD/KRW rate from external API on mount
2. Mock historical data is generated based on current rate (API doesn't provide real history)
3. Exchange data flows to child components via props
4. AI insights are fetched on-demand when user clicks the analysis button

### Types

All shared types are in `types.ts`: `ExchangeData`, `HistoryPoint`, `Currency` enum, and `MarketInsight`.

### User direction

1. 한글로만 대답해줘.