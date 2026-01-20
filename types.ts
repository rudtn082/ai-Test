
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

export interface MarketInsight {
  summary: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  factors: string[];
  recommendation: string;
}
