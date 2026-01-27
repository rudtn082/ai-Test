
export interface ExchangeData {
  rate: number;
  previousClose: number;
  change: number;
  changePercent: number;
  rates: MultiCurrencyRates;
  lastUpdate: string;
  history: HistoryPoint[];
  multiHistory: MultiCurrencyHistory[];
}

export interface HistoryPoint {
  date: string;
  rate: number;
}

export enum Currency {
  USD = 'USD',
  KRW = 'KRW',
  EUR = 'EUR',
  JPY = 'JPY',
  CNY = 'CNY'
}

export interface MultiCurrencyRates {
  KRW: number;
  EUR: number;
  JPY: number;
  CNY: number;
}

export interface MultiCurrencyHistory {
  date: string;
  KRW: number;
  EUR?: number;
  JPY?: number;
  CNY?: number;
}

export interface RateStatistics {
  high: number;
  low: number;
  average: number;
  changeRate: number;
  changeAmount: number;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

// Market Indicator Types
export interface MarketIndicator {
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
}

export interface ExtendedMarketData {
  wti: MarketIndicator | null;
  kospi: MarketIndicator | null;
  gold: MarketIndicator | null;
  bitcoin: MarketIndicator | null;
  treasury10y: MarketIndicator | null;
  nasdaq: MarketIndicator | null;
  sp500: MarketIndicator | null;
  lastUpdate: string;
}

// OHLC Types for Candlestick Chart
export interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Correlation Types
export type CorrelationIndicator = 'KRW' | 'WTI' | 'KOSPI' | 'Gold';

export interface CorrelationCell {
  row: CorrelationIndicator;
  col: CorrelationIndicator;
  value: number;
}

export type CorrelationMatrix = CorrelationCell[][];

// Multi-line Overlay Types
export interface NormalizedDataPoint {
  date: string;
  [key: string]: string | number;
}
