
import React, { useMemo, memo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { HistoryPoint } from '../types';

interface Props {
  data: HistoryPoint[];
  chartType: 'area' | 'bar';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; payload: HistoryPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps): React.ReactElement | null {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-600 shadow-xl rounded-lg">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {firstPayload.value.toLocaleString('ko-KR')} KRW
        </p>
      </div>
    );
  }
  return null;
}

const DOMAIN_MARGIN = 0.005;

export const HistoryChart: React.FC<Props> = memo(function HistoryChart({ data, chartType }) {
  const { min, max } = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0 };
    const rates = data.map(p => p.rate);
    return {
      min: Math.min(...rates) * (1 - DOMAIN_MARGIN),
      max: Math.max(...rates) * (1 + DOMAIN_MARGIN)
    };
  }, [data]);

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 10, fill: '#94a3b8'}}
              minTickGap={30}
            />
            <YAxis
              domain={[min, max]}
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 10, fill: '#94a3b8'}}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
              animationDuration={1500}
            />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 10, fill: '#94a3b8'}}
              minTickGap={30}
            />
            <YAxis
              domain={[min, max]}
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 10, fill: '#94a3b8'}}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="rate"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
});
