import { useState, useEffect, useCallback } from 'react';

export interface MarketData {
  wti: {
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
  } | null;
  kospi: {
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
  } | null;
  lastUpdate: string;
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

export function useMarketData() {
  const [data, setData] = useState<MarketData>({
    wti: null,
    kospi: null,
    lastUpdate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [wtiResult, kospiResult] = await Promise.all([
        fetchYahooData('CL=F'),
        fetchYahooData('^KS11')
      ]);

      const newData: MarketData = {
        wti: null,
        kospi: null,
        lastUpdate: new Date().toLocaleString('ko-KR')
      };

      if (wtiResult) {
        const change = wtiResult.price - wtiResult.previousClose;
        const changePercent = (change / wtiResult.previousClose) * 100;
        newData.wti = {
          price: wtiResult.price,
          change,
          changePercent,
          previousClose: wtiResult.previousClose
        };
      }

      if (kospiResult) {
        const change = kospiResult.price - kospiResult.previousClose;
        const changePercent = (change / kospiResult.previousClose) * 100;
        newData.kospi = {
          price: kospiResult.price,
          change,
          changePercent,
          previousClose: kospiResult.previousClose
        };
      }

      if (!newData.wti && !newData.kospi) {
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
