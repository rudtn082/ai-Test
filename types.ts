
export interface ExchangeData {
  rate: number;
  lastUpdate: string;
  history: HistoryPoint[];
}

export interface HistoryPoint {
  date: string;
  rate: number;
}

export enum Currency {
  USD = 'USD',
  KRW = 'KRW'
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
