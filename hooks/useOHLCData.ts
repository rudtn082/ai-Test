import { useState, useEffect, useCallback } from 'react';
import type { OHLCData } from '../types';

interface YahooOHLCResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
        }>;
      };
    }> | null;
    error: { code: string; description: string } | null;
  };
}

function isValidOHLCResponse(data: unknown): data is YahooOHLCResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.chart || typeof obj.chart !== 'object') return false;
  const chart = obj.chart as Record<string, unknown>;
  if (!Array.isArray(chart.result) || chart.result.length === 0) return false;
  const result = chart.result[0] as Record<string, unknown>;
  return Array.isArray(result.timestamp) && result.indicators !== undefined;
}

async function fetchOHLCData(): Promise<OHLCData[]> {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?interval=1d&range=1mo`;
  
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
      if (!isValidOHLCResponse(data) || !data.chart.result) continue;
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];
      
      if (!quote.open || !quote.high || !quote.low || !quote.close) continue;
      
      const ohlcData: OHLCData[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const open = quote.open[i];
        const high = quote.high[i];
        const low = quote.low[i];
        const close = quote.close[i];
        
        if (open == null || high == null || low == null || close == null) continue;
        
        const date = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
        ohlcData.push({ date, open, high, low, close });
      }
      
      return ohlcData;
    } catch {
      continue;
    }
  }
  
  return [];
}

export function useOHLCData() {
  const [data, setData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ohlcData = await fetchOHLCData();
      
      if (ohlcData.length === 0) {
        setError('OHLC 데이터를 불러올 수 없습니다.');
      } else {
        setData(ohlcData);
      }
    } catch {
      setError('OHLC 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
