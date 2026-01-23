
export interface ExchangeData {
  rate: number;
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
