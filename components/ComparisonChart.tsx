import React, { useState, useMemo } from 'react';
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
import { MultiCurrencyHistory } from '../types';

interface Props {
  data: MultiCurrencyHistory[];
}

type CurrencyKey = 'KRW' | 'EUR' | 'JPY' | 'CNY';

const CURRENCY_CONFIG: Record<CurrencyKey, { name: string; color: string; flag: string }> = {
  KRW: { name: '원화', color: '#3b82f6', flag: '🇰🇷' },
  EUR: { name: '유로', color: '#10b981', flag: '🇪🇺' },
  JPY: { name: '엔화', color: '#f59e0b', flag: '🇯🇵' },
  CNY: { name: '위안', color: '#ef4444', flag: '🇨🇳' }
};

function normalizeData(data: MultiCurrencyHistory[], currencies: CurrencyKey[]) {
  if (data.length === 0) return [];
  
  const firstValues: Record<CurrencyKey, number> = {
    KRW: data[0].KRW,
    EUR: data[0].EUR || 1,
    JPY: data[0].JPY || 1,
    CNY: data[0].CNY || 1
  };
  
  return data.map(item => {
    const normalized: Record<string, number | string> = { date: item.date };
    currencies.forEach(currency => {
      const value = item[currency];
      if (value !== undefined) {
        normalized[currency] = ((value / firstValues[currency]) * 100);
      }
    });
    return normalized;
  });
}

export const ComparisonChart: React.FC<Props> = ({ data }) => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<CurrencyKey[]>(['KRW', 'EUR', 'JPY']);

  const toggleCurrency = (currency: CurrencyKey) => {
    setSelectedCurrencies(prev => {
      if (prev.includes(currency)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== currency);
      }
      return [...prev, currency];
    });
  };

  const normalizedData = useMemo(() => 
    normalizeData(data, selectedCurrencies),
    [data, selectedCurrencies]
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            통화 비교
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USD 대비 각 통화의 상대적 변동률 (시작일=100)</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CURRENCY_CONFIG) as CurrencyKey[]).map(currency => (
            <button
              key={currency}
              onClick={() => toggleCurrency(currency)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedCurrencies.includes(currency)
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              style={selectedCurrencies.includes(currency) ? { backgroundColor: CURRENCY_CONFIG[currency].color } : {}}
            >
              <span>{CURRENCY_CONFIG[currency].flag}</span>
              <span>{CURRENCY_CONFIG[currency].name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px]">
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
              tickFormatter={(value) => `${value.toFixed(1)}`}
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
                const currencyName = String(name) as CurrencyKey;
                return [
                  `${numValue.toFixed(2)}%`,
                  `${CURRENCY_CONFIG[currencyName]?.flag || ''} ${CURRENCY_CONFIG[currencyName]?.name || name}`
                ];
              }}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-sm">
                  {CURRENCY_CONFIG[value as CurrencyKey]?.flag} {CURRENCY_CONFIG[value as CurrencyKey]?.name}
                </span>
              )}
            />
            {selectedCurrencies.map(currency => (
              <Line
                key={currency}
                type="monotone"
                dataKey={currency}
                stroke={CURRENCY_CONFIG[currency].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
