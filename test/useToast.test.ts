import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../hooks/useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('should use info as default type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message');
    });

    expect(result.current.toasts[0].type).toBe('info');
  });

  it('should remove toast after 4 seconds', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should remove toast manually', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Message 1', 'success');
      result.current.addToast('Message 2', 'error');
      result.current.addToast('Message 3', 'warning');
    });

    expect(result.current.toasts).toHaveLength(3);
  });
});
