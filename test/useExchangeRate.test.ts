import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useExchangeRate } from '../hooks/useExchangeRate';

const mockLatestResponse = {
  amount: 1,
  base: 'USD',
  date: '2024-01-20',
  rates: {
    KRW: 1350.5,
  },
};

const mockTimeseriesResponse = {
  amount: 1,
  base: 'USD',
  start_date: '2023-12-21',
  end_date: '2024-01-20',
  rates: {
    '2024-01-15': { KRW: 1340.0 },
    '2024-01-16': { KRW: 1342.0 },
    '2024-01-17': { KRW: 1345.0 },
    '2024-01-18': { KRW: 1348.0 },
    '2024-01-19': { KRW: 1349.0 },
    '2024-01-20': { KRW: 1350.5 },
  },
};

describe('useExchangeRate', () => {
  beforeEach(() => {
    let callCount = 0;
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLatestResponse),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTimeseriesResponse),
        } as Response);
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch exchange rate on mount', async () => {
    const { result } = renderHook(() => useExchangeRate());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.rate).toBe(1350.5);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('네트워크 연결을 확인해주세요.');
    expect(result.current.data).toBeNull();
  });

  it('should handle invalid response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'error' }),
    } as Response);

    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('유효하지 않은 히스토리 데이터입니다.');
  });

  it('should change period', async () => {
    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.period).toBe('30D');
    expect(result.current.filteredHistory.length).toBeGreaterThanOrEqual(6);

    act(() => {
      result.current.handlePeriodChange('7D');
    });

    expect(result.current.period).toBe('7D');
    expect(result.current.filteredHistory.length).toBeGreaterThanOrEqual(6);
  });

  it('should toggle chart type', async () => {
    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.chartType).toBe('area');

    act(() => {
      result.current.handleChartTypeToggle();
    });

    expect(result.current.chartType).toBe('bar');
  });
});
