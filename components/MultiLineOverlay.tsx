import React, { useState, useMemo, memo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface Props {
  krwHistory: { date: string; value: number }[];
  wtiHistory: { date: string; value: number }[];
  kospiHistory: { date: string; value: number }[];
  goldHistory: { date: string; value: number }[];
}

type IndicatorKey = 'KRW' | 'WTI' | 'KOSPI' | 'Gold';

const INDICATOR_CONFIG: Record<IndicatorKey, { name: string; color: string; icon: string }> = {
  KRW: { name: '환율', color: '#3b82f6', icon: '💱' },
  WTI: { name: '유가', color: '#f59e0b', icon: '🛢️' },
  KOSPI: { name: 'KOSPI', color: '#10b981', icon: '📈' },
  Gold: { name: '금', color: '#eab308', icon: '🥇' }
};

interface NormalizedPoint {
  date: string;
  KRW?: number;
  WTI?: number;
  KOSPI?: number;
  Gold?: number;
}

function normalizeToBase100(
  krw: { date: string; value: number }[],
  wti: { date: string; value: number }[],
  kospi: { date: string; value: number }[],
  gold: { date: string; value: number }[]
): NormalizedPoint[] {
  const allDates = new Set<string>();
  [krw, wti, kospi, gold].forEach(arr => arr.forEach(item => allDates.add(item.date)));
  const sortedDates = Array.from(allDates).sort();
  
  if (sortedDates.length === 0) return [];
  
  const toMap = (arr: { date: string; value: number }[]) => 
    new Map(arr.map(item => [item.date, item.value]));
  
  const krwMap = toMap(krw);
  const wtiMap = toMap(wti);
  const kospiMap = toMap(kospi);
  const goldMap = toMap(gold);
  
  const firstKrw = krwMap.get(sortedDates[0]) || 1;
  const firstWti = wtiMap.get(sortedDates[0]) || 1;
  const firstKospi = kospiMap.get(sortedDates[0]) || 1;
  const firstGold = goldMap.get(sortedDates[0]) || 1;
  
  return sortedDates.map(date => {
    const point: NormalizedPoint = { date };
    
    const krwVal = krwMap.get(date);
    if (krwVal !== undefined) point.KRW = (krwVal / firstKrw) * 100;
    
    const wtiVal = wtiMap.get(date);
    if (wtiVal !== undefined) point.WTI = (wtiVal / firstWti) * 100;
    
    const kospiVal = kospiMap.get(date);
    if (kospiVal !== undefined) point.KOSPI = (kospiVal / firstKospi) * 100;
    
    const goldVal = goldMap.get(date);
    if (goldVal !== undefined) point.Gold = (goldVal / firstGold) * 100;
    
    return point;
  });
}

export const MultiLineOverlay: React.FC<Props> = memo(function MultiLineOverlay({
  krwHistory,
  wtiHistory,
  kospiHistory,
  goldHistory
}) {
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorKey[]>(['KRW', 'WTI', 'KOSPI', 'Gold']);

  const toggleIndicator = (indicator: IndicatorKey) => {
    setSelectedIndicators(prev => {
      if (prev.includes(indicator)) {
        if (prev.length === 1) return prev;
        return prev.filter(i => i !== indicator);
      }
      return [...prev, indicator];
    });
  };

  const normalizedData = useMemo(() => 
    normalizeToBase100(krwHistory, wtiHistory, kospiHistory, goldHistory),
    [krwHistory, wtiHistory, kospiHistory, goldHistory]
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const hasOnlyKrwData = krwHistory.length > 0 && 
    wtiHistory.length === 0 && 
    kospiHistory.length === 0 && 
    goldHistory.length === 0;

  if (normalizedData.length === 0 || hasOnlyKrwData) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            멀티라인 오버레이
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">주요 지표 정규화 비교 (시작일=100)</p>
        </div>
        <div className="flex flex-col items-center justify-center h-[250px] text-slate-400 dark:text-slate-500">
          <svg className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <p className="text-sm font-medium">시계열 데이터 준비 중</p>
          <p className="text-xs mt-1">다중 지표 비교를 위한 히스토리 데이터가 필요합니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            멀티라인 오버레이
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">주요 지표 정규화 비교 (시작일=100)</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(Object.keys(INDICATOR_CONFIG) as IndicatorKey[]).map(indicator => (
            <button
              key={indicator}
              onClick={() => toggleIndicator(indicator)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedIndicators.includes(indicator)
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              style={selectedIndicators.includes(indicator) ? { backgroundColor: INDICATOR_CONFIG[indicator].color } : {}}
            >
              <span>{INDICATOR_CONFIG[indicator].icon}</span>
              <span>{INDICATOR_CONFIG[indicator].name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : 0;
                const indicatorName = String(name) as IndicatorKey;
                return [
                  `${numValue.toFixed(2)}`,
                  `${INDICATOR_CONFIG[indicatorName]?.icon || ''} ${INDICATOR_CONFIG[indicatorName]?.name || name}`
                ];
              }}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-sm">
                  {INDICATOR_CONFIG[value as IndicatorKey]?.icon} {INDICATOR_CONFIG[value as IndicatorKey]?.name}
                </span>
              )}
            />
            {selectedIndicators.map(indicator => (
              <Line
                key={indicator}
                type="monotone"
                dataKey={indicator}
                stroke={INDICATOR_CONFIG[indicator].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default MultiLineOverlay;
