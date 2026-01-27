import React, { useMemo, memo } from 'react';
import type { CorrelationIndicator, CorrelationCell } from '../types';
import { buildCorrelationMatrix } from '../utils/correlation';

interface Props {
  krwHistory: number[];
  wtiHistory: number[];
  kospiHistory: number[];
  goldHistory: number[];
}

const INDICATOR_LABELS: Record<CorrelationIndicator, string> = {
  KRW: '환율',
  WTI: '유가',
  KOSPI: 'KOSPI',
  Gold: '금'
};

function getCorrelationColor(value: number): string {
  if (value >= 0.7) return 'bg-red-500';
  if (value >= 0.4) return 'bg-red-300';
  if (value >= 0.1) return 'bg-red-100';
  if (value > -0.1) return 'bg-slate-100 dark:bg-slate-600';
  if (value > -0.4) return 'bg-blue-100';
  if (value > -0.7) return 'bg-blue-300';
  return 'bg-blue-500';
}

function getTextColor(value: number): string {
  if (Math.abs(value) >= 0.7) return 'text-white';
  return 'text-slate-700 dark:text-slate-300';
}

export const CorrelationHeatmap: React.FC<Props> = memo(function CorrelationHeatmap({
  krwHistory,
  wtiHistory,
  kospiHistory,
  goldHistory
}) {
  const matrix = useMemo<CorrelationCell[][]>(() => {
    const hasData = [krwHistory, wtiHistory, kospiHistory, goldHistory].some(arr => arr.length > 0);
    if (!hasData) return [];
    
    return buildCorrelationMatrix({
      KRW: krwHistory,
      WTI: wtiHistory,
      KOSPI: kospiHistory,
      Gold: goldHistory
    });
  }, [krwHistory, wtiHistory, kospiHistory, goldHistory]);

  const indicators: CorrelationIndicator[] = ['KRW', 'WTI', 'KOSPI', 'Gold'];

  const hasInsufficientData = [krwHistory, wtiHistory, kospiHistory, goldHistory].some(arr => arr.length < 2);

  if (matrix.length === 0 || hasInsufficientData) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            상관관계 히트맵
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">30일 기준 피어슨 상관계수</p>
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] text-slate-400 dark:text-slate-500">
          <svg className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">시계열 데이터 준비 중</p>
          <p className="text-xs mt-1">상관관계 분석을 위한 히스토리 데이터가 필요합니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          상관관계 히트맵
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">30일 기준 피어슨 상관계수</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full max-w-md mx-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2"></th>
              {indicators.map(col => (
                <th key={col} className="p-2 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">
                  {INDICATOR_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={indicators[rowIndex]}>
                <td className="p-2 text-xs font-semibold text-slate-600 dark:text-slate-400 text-right pr-4">
                  {INDICATOR_LABELS[indicators[rowIndex]]}
                </td>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="p-1">
                    <div 
                      className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg transition-all ${getCorrelationColor(cell.value)} ${getTextColor(cell.value)}`}
                      title={`${INDICATOR_LABELS[cell.row]} - ${INDICATOR_LABELS[cell.col]}: ${cell.value.toFixed(2)}`}
                    >
                      <span className="text-sm font-bold">
                        {cell.value.toFixed(2)}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>음의 상관</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-600"></div>
          <span>무상관</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>양의 상관</span>
        </div>
      </div>
    </div>
  );
});

export default CorrelationHeatmap;
