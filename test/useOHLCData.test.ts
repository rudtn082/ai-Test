import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOHLCData } from '../hooks/useOHLCData';

const mockOHLCResponse = {
  chart: {
    result: [{
      timestamp: [1706140800, 1706227200, 1706313600],
      indicators: {
        quote: [{
          open: [1330.0, 1335.0, 1340.0],
          high: [1340.0, 1345.0, 1350.0],
          low: [1325.0, 1330.0, 1335.0],
          close: [1335.0, 1340.0, 1345.0]
        }]
      }
    }],
    error: null
  }
};

describe('useOHLCData', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOHLCResponse)
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch OHLC data on mount', async () => {
    const { result } = renderHook(() => useOHLCData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data.length).toBe(3);
  });

  it('should return correct OHLC structure', async () => {
    const { result } = renderHook(() => useOHLCData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const firstPoint = result.current.data[0];
    expect(firstPoint).toHaveProperty('date');
    expect(firstPoint).toHaveProperty('open');
    expect(firstPoint).toHaveProperty('high');
    expect(firstPoint).toHaveProperty('low');
    expect(firstPoint).toHaveProperty('close');
  });

  it('should handle fetch error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('Failed'))
    } as Response);

    const { result } = renderHook(() => useOHLCData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('OHLC 데이터를 불러올 수 없습니다.');
    expect(result.current.data).toEqual([]);
  });

  it('should handle invalid response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ chart: { result: null, error: { code: 'error' } } })
    } as Response);

    const { result } = renderHook(() => useOHLCData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('OHLC 데이터를 불러올 수 없습니다.');
  });
});
