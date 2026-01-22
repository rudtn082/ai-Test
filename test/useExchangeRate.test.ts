import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useExchangeRate } from '../hooks/useExchangeRate';

const mockExchangeResponse = {
  result: 'success',
  rates: {
    KRW: 1350.5,
  },
};

describe('useExchangeRate', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockExchangeResponse),
    } as Response);
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
    vi.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Network error'));

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

    expect(result.current.error).toBe('유효하지 않은 환율 데이터입니다.');
  });

  it('should change period', async () => {
    const { result } = renderHook(() => useExchangeRate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.period).toBe('30D');
    expect(result.current.filteredHistory.length).toBe(31);

    act(() => {
      result.current.handlePeriodChange('7D');
    });

    expect(result.current.period).toBe('7D');
    expect(result.current.filteredHistory.length).toBe(7);
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
