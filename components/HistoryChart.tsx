
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { HistoryPoint } from '../types';

interface Props {
  data: HistoryPoint[];
}

export const HistoryChart: React.FC<Props> = ({ data }) => {
  // Calculate domain for Y axis to make fluctuations visible
  const rates = data.map(p => p.rate);
  const min = Math.min(...rates) * 0.995;
  const max = Math.max(...rates) * 1.005;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-blue-600">
            {payload[0].value.toLocaleString('ko-KR')} KRW
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
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
      </ResponsiveContainer>
    </div>
  );
};
