<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# KRW/USD Exchange Rate Insights

**실시간 원/달러 환율 정보와 AI 기반 시장 분석 서비스**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?logo=vitest)](https://vitest.dev/)

</div>

## Features

- **실시간 환율 조회** - open.er-api.com API를 통한 실시간 USD/KRW 환율 정보
- **양방향 통화 변환기** - USD ↔ KRW 간편 환전 계산
- **환율 추이 차트** - 최근 7일/30일 환율 변동 그래프 (Area/Bar 차트)
- **AI 마켓 인사이트** - Google Gemini AI 기반 시장 분석 및 예측
- **다크 모드** - 시스템 설정 연동 및 수동 전환 지원
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 최적화

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | React 19, TypeScript 5.8 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS (CDN) |
| Charts | Recharts 3.6 |
| AI | Google Gemini API |
| Testing | Vitest 4.0, Testing Library |

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-Test

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your VITE_GEMINI_API_KEY
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
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
├── components/           # React components
│   ├── AIInsights.tsx    # AI market analysis panel
│   ├── Converter.tsx     # Currency converter
│   ├── ErrorBoundary.tsx # Error boundary wrapper
│   ├── Header.tsx        # App header with dark mode toggle
│   ├── HistoryChart.tsx  # Exchange rate chart
│   ├── Skeleton.tsx      # Loading skeleton components
│   └── Toast.tsx         # Toast notification system
├── hooks/                # Custom React hooks
│   ├── useExchangeRate.ts # Exchange rate data fetching
│   └── useToast.ts       # Toast state management
├── services/
│   └── geminiService.ts  # Gemini AI API integration
├── test/                 # Test files
│   ├── setup.ts          # Test configuration
│   ├── Converter.test.tsx
│   ├── useExchangeRate.test.ts
│   └── useToast.test.ts
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
├── types.ts              # TypeScript type definitions
├── vite.config.ts        # Vite configuration
└── vitest.config.ts      # Vitest configuration
```

## Architecture

### Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│ Exchange    │────▶│ useExchangeRate  │────▶│ Components  │
│ Rate API   │     │ (Custom Hook)     │     │ (UI)       │
└─────────────┘     └──────────────────┘     └─────────────┘
                           │
                           ▼
┌─────────────┐     ┌──────────────────┐
│ Gemini AI  │◀────│ AIInsights       │
│ API        │     │ Component        │
└─────────────┘     └──────────────────┘
```

### Code Splitting

The application uses React.lazy() for code splitting:

- `HistoryChart` - Loaded when chart is needed (~360KB)
- `AIInsights` - Loaded when AI panel is needed (~52KB)
- Main bundle - Core application (~218KB)

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
- `Converter` component - Currency conversion, input validation

## Security

- **API Key Protection** - Environment variables with `VITE_` prefix
- **CSP Headers** - Content Security Policy configured
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

- Exchange rate data provided by [open.er-api.com](https://open.er-api.com/)
- AI insights powered by [Google Gemini](https://ai.google.dev/)
- Charts built with [Recharts](https://recharts.org/)
