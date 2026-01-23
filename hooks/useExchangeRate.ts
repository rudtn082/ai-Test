import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeData, HistoryPoint, MultiCurrencyRates, MultiCurrencyHistory } from '../types';

const HISTORY_DAYS = 30;
const CURRENCIES_PARAM = 'KRW,EUR,JPY,CNY';

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Partial<MultiCurrencyRates>;
}

interface FrankfurterTimeseriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Partial<MultiCurrencyRates>>;
}

function isValidLatestResponse(data: unknown): data is FrankfurterLatestResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.date === 'string' && 
         typeof obj.rates === 'object' && 
         obj.rates !== null &&
         typeof (obj.rates as Record<string, unknown>).KRW === 'number';
}

function isValidTimeseriesResponse(data: unknown): data is FrankfurterTimeseriesResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.rates === 'object' && obj.rates !== null;
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
      
      const [latestRes, historyRes] = await Promise.all([
        fetch(`https://api.frankfurter.app/latest?from=USD&to=${CURRENCIES_PARAM}`),
        fetch(`https://api.frankfurter.app/${startDateStr}..${endDateStr}?from=USD&to=${CURRENCIES_PARAM}`)
      ]);
      
      if (!latestRes.ok || !historyRes.ok) {
        throw new Error(`서버 오류가 발생했습니다.`);
      }
      
      let latestJson: unknown;
      let historyJson: unknown;
      try {
        [latestJson, historyJson] = await Promise.all([
          latestRes.json(),
          historyRes.json()
        ]);
      } catch {
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }
      
      if (!isValidLatestResponse(latestJson)) {
        throw new Error('유효하지 않은 환율 데이터입니다.');
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
      
      setData({
        rate: latestJson.rates.KRW!,
        rates: {
          KRW: latestJson.rates.KRW!,
          EUR: latestJson.rates.EUR || 0,
          JPY: latestJson.rates.JPY || 0,
          CNY: latestJson.rates.CNY || 0
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
    return period === '7D' ? data.history.slice(-7) : data.history;
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
