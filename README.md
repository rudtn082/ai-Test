<div align="center">

# KRW/USD Exchange Rate Insights

**실시간 원/달러 환율 정보와 다중 통화 비교 서비스**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?logo=vitest)](https://vitest.dev/)

**[Live Demo](https://krw-usd-fx-insights.vercel.app)**

</div>

## Features

- **실시간 환율 조회** - frankfurter.app API를 통한 실시간 USD/KRW 환율 정보
- **양방향 통화 변환기** - USD ↔ KRW 간편 환전 계산
- **환율 추이 차트** - 최근 7일/30일 실제 환율 변동 그래프 (Area/Bar 차트)
- **캔들스틱 차트** - OHLC(시가/고가/저가/종가) 캔들스틱 차트 (7일/30일 선택 가능)
- **환율 통계** - 최고/최저/평균/변동률 통계 카드
- **다중 통화 비교** - EUR, JPY, CNY 등 주요 통화 대비 상대적 변동률 비교 차트
- **환율 뉴스** - Google News RSS를 통한 최신 환율 관련 뉴스 5개 표시
- **시장 지표** - WTI 유가 및 KOSPI 지수 실시간 정보
- **다크 모드** - 시스템 설정 연동 및 수동 전환 지원
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 최적화

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | React 19, TypeScript 5.8 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS (CDN) |
| Charts | Recharts 3.6 |
| APIs | frankfurter.app (환율), Google News RSS (뉴스), Yahoo Finance (시장 지표) |
| Testing | Vitest 4.0, Testing Library |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/rudtn082/ai-Test.git
cd ai-Test

# Install dependencies
npm install
```

### Development

```bash
# Start development server (port 3000)
npm run dev

# Run tests
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
ai-Test/
├── components/              # React components
│   ├── CandlestickChart.tsx # OHLC candlestick chart
│   ├── ComparisonChart.tsx  # Multi-currency comparison chart
│   ├── Converter.tsx        # Currency converter
│   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   ├── ExchangeNews.tsx     # Exchange rate news from RSS
│   ├── Footer.tsx           # Page footer with data sources
│   ├── Header.tsx           # App header with dark mode toggle
│   ├── HistoryChart.tsx     # Exchange rate history chart
│   ├── RateStatistics.tsx   # Rate statistics cards
│   ├── MarketIndicators.tsx # WTI oil price and KOSPI index cards
│   ├── Skeleton.tsx         # Loading skeleton components
│   └── Toast.tsx            # Toast notification system
├── hooks/                   # Custom React hooks
│   ├── useExchangeRate.ts   # Exchange rate data fetching & state
│   ├── useMarketData.ts     # WTI and KOSPI data fetching
│   ├── useOHLCData.ts       # OHLC candlestick data fetching
│   └── useToast.ts          # Toast state management
├── test/                    # Test files
│   ├── setup.ts             # Test configuration
│   ├── Converter.test.tsx
│   ├── useExchangeRate.test.ts
│   ├── useToast.test.ts
│   ├── useOHLCData.test.ts
│   └── useMarketData.test.ts
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
├── types.ts                 # TypeScript type definitions
├── vite.config.ts           # Vite configuration
└── vitest.config.ts         # Vitest configuration
```

## Architecture

### Data Flow

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ frankfurter.app     │────▶│ useExchangeRate  │────▶│ Components      │
│ (Exchange Rate API) │     │ (Custom Hook)    │     │ (UI)            │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
                                    │
                                    ▼
┌─────────────────────┐     ┌──────────────────┐
│ Google News RSS     │────▶│ ExchangeNews     │
│ (via rss2json)      │     │ Component        │
└─────────────────────┘     └──────────────────┘
```

### Code Splitting

The application uses React.lazy() for code splitting:

- `HistoryChart` - Loaded when chart is rendered
- `RateStatistics` - Loaded with statistics data
- `ComparisonChart` - Loaded for multi-currency comparison
- `ExchangeNews` - Loaded for news section
- `CandlestickChart` - Loaded for OHLC candlestick chart

## Testing

Tests are written with Vitest and Testing Library:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- `useExchangeRate` hook - API fetching, error handling, state management
- `useToast` hook - Toast lifecycle, auto-dismiss, manual removal
- `useOHLCData` hook - OHLC data fetching and period filtering
- `useMarketData` hook - WTI oil price and KOSPI index fetching
- `Converter` component - Currency conversion, input validation

## Security

- **CSP Headers** - Content Security Policy configured for API endpoints
- **Input Validation** - User input sanitization and limits
- **Type Safety** - Strict TypeScript configuration

## Browser Support

- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

## License

MIT License

## Acknowledgments

- Exchange rate data provided by [frankfurter.app](https://www.frankfurter.app/)
- News feed via [rss2json](https://rss2json.com/)
- Market data via [Yahoo Finance](https://finance.yahoo.com/)
- Charts built with [Recharts](https://recharts.org/)
- Deployed on [Vercel](https://vercel.com/)
