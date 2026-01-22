import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeData, HistoryPoint } from '../types';

const FLUCTUATION_RANGE = 0.03;
const HISTORY_DAYS = 30;

function generateMockHistory(baseRate: number): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const now = new Date();
  for (let i = HISTORY_DAYS; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const fluctuation = 1 + (Math.random() * FLUCTUATION_RANGE - FLUCTUATION_RANGE / 2);
    points.push({
      date: date.toISOString().split('T')[0],
      rate: baseRate * fluctuation
    });
  }
  return points;
}

interface ExchangeApiResponse {
  result: string;
  rates?: {
    KRW?: number;
  };
}

function isValidExchangeResponse(data: unknown): data is ExchangeApiResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return obj.result === 'success' && 
         typeof obj.rates === 'object' && 
         obj.rates !== null &&
         typeof (obj.rates as Record<string, unknown>).KRW === 'number';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return '네트워크 연결을 확인해주세요.';
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
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      
      if (!res.ok) {
        throw new Error(`서버 오류가 발생했습니다. (${res.status})`);
      }
      
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }
      
      if (!isValidExchangeResponse(json)) {
        throw new Error('유효하지 않은 환율 데이터입니다.');
      }
      
      const krwRate = json.rates!.KRW!;
      setData({
        rate: krwRate,
        lastUpdate: new Date().toLocaleString('ko-KR'),
        history: generateMockHistory(krwRate)
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
