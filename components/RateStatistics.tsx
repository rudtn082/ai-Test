import React, { useMemo } from 'react';
import { HistoryPoint, RateStatistics as RateStats } from '../types';

interface Props {
  history: HistoryPoint[];
}

function calculateStatistics(history: HistoryPoint[]): RateStats | null {
  if (history.length < 2) return null;
  
  const rates = history.map(h => h.rate);
  const high = Math.max(...rates);
  const low = Math.min(...rates);
  const average = rates.reduce((sum, r) => sum + r, 0) / rates.length;
  const firstRate = rates[0];
  const lastRate = rates[rates.length - 1];
  const changeAmount = lastRate - firstRate;
  const changeRate = ((lastRate - firstRate) / firstRate) * 100;
  
  return { high, low, average, changeRate, changeAmount };
}

export const RateStatistics: React.FC<Props> = ({ history }) => {
  const stats = useMemo(() => calculateStatistics(history), [history]);
  
  if (!stats) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center">통계 데이터가 부족합니다.</p>
      </div>
    );
  }
  
  const isPositive = stats.changeRate > 0;
  const isNeutral = Math.abs(stats.changeRate) < 0.01;
  
  const statItems = [
    {
      label: '최고',
      value: stats.high.toLocaleString('ko-KR', { maximumFractionDigits: 2 }),
      unit: 'KRW',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      textClass: 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      )
    },
    {
      label: '최저',
      value: stats.low.toLocaleString('ko-KR', { maximumFractionDigits: 2 }),
      unit: 'KRW',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      textClass: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )
    },
    {
      label: '평균',
      value: stats.average.toLocaleString('ko-KR', { maximumFractionDigits: 2 }),
      unit: 'KRW',
      bgClass: 'bg-slate-50 dark:bg-slate-700/50',
      textClass: 'text-slate-600 dark:text-slate-400',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )
    },
    {
      label: '변동률',
      value: `${isPositive ? '+' : ''}${stats.changeRate.toFixed(2)}`,
      unit: '%',
      bgClass: isNeutral 
        ? 'bg-slate-50 dark:bg-slate-700/50' 
        : isPositive 
          ? 'bg-red-50 dark:bg-red-900/20' 
          : 'bg-blue-50 dark:bg-blue-900/20',
      textClass: isNeutral 
        ? 'text-slate-600 dark:text-slate-400' 
        : isPositive 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-blue-600 dark:text-blue-400',
      icon: isNeutral ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
        </svg>
      ) : isPositive ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        환율 통계
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-xl ${item.bgClass}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={item.textClass}>{item.icon}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className={`text-lg font-bold ${item.textClass}`}>
              {item.value}
              <span className="text-sm font-normal ml-1">{item.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateStatistics;
