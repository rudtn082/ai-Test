import { useState, useEffect, useCallback } from 'react';
import type { MarketIndicator, ExtendedMarketData } from '../types';

export type { ExtendedMarketData as MarketData };

interface MarketDataResult {
  price: number;
  previousClose: number;
}

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        chartPreviousClose: number;
      };
      indicators: {
        quote: Array<{
          close: number[];
        }>;
      };
    }> | null;
    error: { code: string; description: string } | null;
  };
}

function isValidYahooResponse(data: unknown): data is YahooChartResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.chart || typeof obj.chart !== 'object') return false;
  const chart = obj.chart as Record<string, unknown>;
  return Array.isArray(chart.result) && chart.result.length > 0;
}

async function fetchYahooData(symbol: string): Promise<{ price: number; previousClose: number } | null> {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(yahooUrl)}`,
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl);
      if (!res.ok) continue;
      
      const data: unknown = await res.json();
      if (!isValidYahooResponse(data) || !data.chart.result) continue;
      
      const result = data.chart.result[0];
      const price = result.meta.regularMarketPrice;
      const previousClose = result.meta.chartPreviousClose;
      
      return { price, previousClose };
    } catch {
      continue;
    }
  }
  
  return null;
}

function toMarketIndicator(result: MarketDataResult | null): MarketIndicator | null {
  if (!result) return null;
  const change = result.price - result.previousClose;
  const changePercent = (change / result.previousClose) * 100;
  return {
    price: result.price,
    change,
    changePercent,
    previousClose: result.previousClose
  };
}

const SYMBOLS = {
  wti: 'CL=F',
  kospi: '^KS11',
  gold: 'GC=F',
  bitcoin: 'BTC-USD',
  treasury10y: '^TNX',
  nasdaq: '^IXIC',
  sp500: '^GSPC'
} as const;

export function useMarketData() {
  const [data, setData] = useState<ExtendedMarketData>({
    wti: null,
    kospi: null,
    gold: null,
    bitcoin: null,
    treasury10y: null,
    nasdaq: null,
    sp500: null,
    lastUpdate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [wtiResult, kospiResult, goldResult, bitcoinResult, treasuryResult, nasdaqResult, sp500Result] = await Promise.all([
        fetchYahooData(SYMBOLS.wti),
        fetchYahooData(SYMBOLS.kospi),
        fetchYahooData(SYMBOLS.gold),
        fetchYahooData(SYMBOLS.bitcoin),
        fetchYahooData(SYMBOLS.treasury10y),
        fetchYahooData(SYMBOLS.nasdaq),
        fetchYahooData(SYMBOLS.sp500)
      ]);

      const newData: ExtendedMarketData = {
        wti: toMarketIndicator(wtiResult),
        kospi: toMarketIndicator(kospiResult),
        gold: toMarketIndicator(goldResult),
        bitcoin: toMarketIndicator(bitcoinResult),
        treasury10y: toMarketIndicator(treasuryResult),
        nasdaq: toMarketIndicator(nasdaqResult),
        sp500: toMarketIndicator(sp500Result),
        lastUpdate: new Date().toLocaleString('ko-KR')
      };

      const hasAnyData = Object.entries(newData)
        .filter(([key]) => key !== 'lastUpdate')
        .some(([, value]) => value !== null);

      if (!hasAnyData) {
        setError('시장 데이터를 불러올 수 없습니다.');
      } else {
        setData(newData);
      }
    } catch {
      setError('시장 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
