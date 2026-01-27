import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMarketData } from '../hooks/useMarketData';

const mockYahooResponse = (price: number, previousClose: number) => ({
  chart: {
    result: [{
      meta: {
        regularMarketPrice: price,
        chartPreviousClose: previousClose
      },
      indicators: { quote: [{ close: [price] }] }
    }],
    error: null
  }
});

function decodeUrlSymbol(url: string): string {
  const decoded = decodeURIComponent(decodeURIComponent(url));
  return decoded;
}

describe('useMarketData', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      const decoded = decodeUrlSymbol(url.toString());
      
      if (decoded.includes('CL=F')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(75.5, 74.0))
        } as Response);
      }
      if (decoded.includes('^KS11')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(2500.0, 2480.0))
        } as Response);
      }
      if (decoded.includes('GC=F')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(2050.0, 2040.0))
        } as Response);
      }
      if (decoded.includes('BTC-USD')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(45000.0, 44000.0))
        } as Response);
      }
      if (decoded.includes('^TNX')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(4.25, 4.20))
        } as Response);
      }
      if (decoded.includes('^IXIC')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(15000.0, 14900.0))
        } as Response);
      }
      if (decoded.includes('^GSPC')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(4800.0, 4780.0))
        } as Response);
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockYahooResponse(100, 99))
      } as Response);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch all market indicators on mount', async () => {
    const { result } = renderHook(() => useMarketData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data.wti).not.toBeNull();
    expect(result.current.data.kospi).not.toBeNull();
    expect(result.current.data.gold).not.toBeNull();
    expect(result.current.data.bitcoin).not.toBeNull();
    expect(result.current.data.treasury10y).not.toBeNull();
    expect(result.current.data.nasdaq).not.toBeNull();
    expect(result.current.data.sp500).not.toBeNull();
  });

  it('should calculate change and changePercent correctly', async () => {
    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const wti = result.current.data.wti;
    expect(wti).not.toBeNull();
    if (wti) {
      expect(wti.price).toBe(75.5);
      expect(wti.previousClose).toBe(74.0);
      expect(wti.change).toBeCloseTo(1.5);
      expect(wti.changePercent).toBeCloseTo(2.027, 2);
    }
  });

  it('should handle partial fetch failures gracefully', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      const decoded = decodeUrlSymbol(url.toString());
      
      if (decoded.includes('CL=F')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockYahooResponse(75.5, 74.0))
        } as Response);
      }
      
      return Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed'))
      } as Response);
    });

    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data.wti).not.toBeNull();
  });

  it('should set error when all fetches fail', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('Failed'))
    } as Response);

    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('시장 데이터를 불러올 수 없습니다.');
  });

  it('should have lastUpdate timestamp', async () => {
    const { result } = renderHook(() => useMarketData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.lastUpdate).toBeTruthy();
  });
});
