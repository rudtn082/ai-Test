import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeData, HistoryPoint, MultiCurrencyRates, MultiCurrencyHistory } from '../types';

const HISTORY_DAYS = 30;
const CURRENCIES_PARAM = 'KRW,EUR,JPY,CNY';

// Yahoo Finance API response type
interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        chartPreviousClose: number;
        previousClose: number;
      };
    }> | null;
    error: { code: string; description: string } | null;
  };
}

interface FrankfurterTimeseriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Partial<MultiCurrencyRates>>;
}

function isValidYahooResponse(data: unknown): data is YahooChartResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.chart || typeof obj.chart !== 'object') return false;
  const chart = obj.chart as Record<string, unknown>;
  return Array.isArray(chart.result) && chart.result.length > 0;
}

function isValidTimeseriesResponse(data: unknown): data is FrankfurterTimeseriesResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.rates === 'object' && obj.rates !== null;
}

// Fetch real-time rate from Yahoo Finance with CORS proxy fallback
async function fetchYahooRate(symbol: string): Promise<number | null> {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  
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
      return result.meta.regularMarketPrice;
    } catch {
      continue;
    }
  }
  
  return null;
}

function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    if (error.message.includes('fetch')) {
      return '네트워크 연결을 확인해주세요.';
    }
    return `데이터 처리 오류: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
}

type Period = '7D' | '30D';
type ChartType = 'area' | 'bar';

interface UseExchangeRateReturn {
  data: ExchangeData | null;
  loading: boolean;
  error: string | null;
  period: Period;
  chartType: ChartType;
  filteredHistory: HistoryPoint[];
  fetchData: () => Promise<void>;
  handlePeriodChange: (newPeriod: Period) => void;
  handleChartTypeToggle: () => void;
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [data, setData] = useState<ExchangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('30D');
  const [chartType, setChartType] = useState<ChartType>('area');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - HISTORY_DAYS);
      
      const startDateStr = formatDateString(startDate);
      const endDateStr = formatDateString(endDate);
      
      const [yahooKrwRate, yahooEurRate, yahooJpyRate, yahooCnyRate, historyRes] = await Promise.all([
        fetchYahooRate('USDKRW=X'),
        fetchYahooRate('USDEUR=X'),
        fetchYahooRate('USDJPY=X'),
        fetchYahooRate('USDCNY=X'),
        fetch(`https://api.frankfurter.app/${startDateStr}..${endDateStr}?from=USD&to=${CURRENCIES_PARAM}`)
      ]);
      
      if (!historyRes.ok) {
        throw new Error('히스토리 데이터를 불러올 수 없습니다.');
      }
      
      let historyJson: unknown;
      try {
        historyJson = await historyRes.json();
      } catch {
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }
      
      if (!isValidTimeseriesResponse(historyJson)) {
        throw new Error('유효하지 않은 히스토리 데이터입니다.');
      }
      
      const history: HistoryPoint[] = Object.entries(historyJson.rates)
        .filter(([, rates]) => rates && typeof rates.KRW === 'number')
        .map(([date, rates]) => ({
          date,
          rate: rates.KRW!
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      const multiHistory: MultiCurrencyHistory[] = Object.entries(historyJson.rates)
        .filter(([, rates]) => rates && typeof rates.KRW === 'number')
        .map(([date, rates]) => ({
          date,
          KRW: rates.KRW!,
          EUR: rates.EUR,
          JPY: rates.JPY,
          CNY: rates.CNY
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      const lastHistoryRate = history.length > 0 ? history[history.length - 1].rate : 0;
      const krwRate = yahooKrwRate ?? lastHistoryRate;
      
      if (!krwRate) {
        throw new Error('환율 데이터를 불러올 수 없습니다.');
      }
      
      setData({
        rate: krwRate,
        rates: {
          KRW: krwRate,
          EUR: yahooEurRate ?? 0,
          JPY: yahooJpyRate ?? 0,
          CNY: yahooCnyRate ?? 0
        },
        lastUpdate: new Date().toLocaleString('ko-KR'),
        history,
        multiHistory
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredHistory = useMemo(() => {
    if (!data) return [];
    
    const baseHistory = period === '7D' ? data.history.slice(-7) : data.history;
    const today = formatDateString(new Date());
    const lastHistoryDate = baseHistory.length > 0 ? baseHistory[baseHistory.length - 1].date : null;
    
    if (lastHistoryDate !== today && data.rate) {
      return [...baseHistory, { date: today, rate: data.rate }];
    }
    
    return baseHistory;
  }, [data, period]);

  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
  }, []);

  const handleChartTypeToggle = useCallback(() => {
    setChartType(prev => prev === 'area' ? 'bar' : 'area');
  }, []);

  return {
    data,
    loading,
    error,
    period,
    chartType,
    filteredHistory,
    fetchData,
    handlePeriodChange,
    handleChartTypeToggle,
  };
}
