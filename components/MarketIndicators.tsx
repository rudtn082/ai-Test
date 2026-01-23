import React from 'react';
import { MarketData } from '../hooks/useMarketData';

interface Props {
  data: MarketData;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function formatPrice(value: number, decimals: number = 2): string {
  return value.toLocaleString('ko-KR', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
}

function formatChange(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
}

export const MarketIndicators: React.FC<Props> = ({ data, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="text-center py-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{error}</p>
          <button
            onClick={onRetry}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const indicators = [
    {
      id: 'wti',
      title: 'WTI 유가',
      icon: '🛢️',
      data: data.wti,
      unit: 'USD',
      decimals: 2,
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40'
    },
    {
      id: 'kospi',
      title: 'KOSPI',
      icon: '📈',
      data: data.kospi,
      unit: '',
      decimals: 2,
      bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          시장 지표
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {data.lastUpdate}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {indicators.map((indicator) => {
          const itemData = indicator.data;
          if (!itemData) {
            return (
              <div key={indicator.id} className={`p-4 rounded-xl ${indicator.bgClass}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg p-1.5 rounded-lg ${indicator.iconBg}`}>{indicator.icon}</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{indicator.title}</span>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm">데이터 없음</p>
              </div>
            );
          }

          const isPositive = itemData.change >= 0;
          const changeColor = isPositive 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-blue-600 dark:text-blue-400';

          return (
            <div key={indicator.id} className={`p-4 rounded-xl ${indicator.bgClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg p-1.5 rounded-lg ${indicator.iconBg}`}>{indicator.icon}</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{indicator.title}</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formatPrice(itemData.price, indicator.decimals)}
                </span>
                {indicator.unit && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">{indicator.unit}</span>
                )}
              </div>
              
              <div className={`flex items-center gap-2 mt-1 text-sm ${changeColor}`}>
                <span className="flex items-center gap-0.5">
                  {isPositive ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {formatChange(itemData.change, indicator.decimals)}
                </span>
                <span>({formatChange(itemData.changePercent, 2)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketIndicators;
