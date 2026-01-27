import React, { useState, useMemo, memo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { OHLCData } from '../types';

interface Props {
  data: OHLCData[];
}

interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  openClose: [number, number];
  isPositive: boolean;
}

interface CandlestickShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: CandlestickDataPoint;
  fill?: string;
}

function CandlestickShape({ x, y, width, height, payload, fill }: CandlestickShapeProps): React.ReactElement | null {
  if (x === undefined || y === undefined || !width || !height || !payload) {
    return null;
  }
  
  const { high, low, openClose } = payload;
  const bodyBottom = openClose[0];
  const bodyTop = openClose[1];
  const barCenterX = x + width / 2;
  
  const bodyValueRange = bodyTop - bodyBottom;
  if (bodyValueRange === 0) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={Math.max(height, 2)} fill={fill} />
      </g>
    );
  }
  
  const pixelsPerValue = height / bodyValueRange;
  const wickTopLength = (high - bodyTop) * pixelsPerValue;
  const wickBottomLength = (bodyBottom - low) * pixelsPerValue;
  
  return (
    <g>
      <line
        x1={barCenterX}
        y1={y - wickTopLength}
        x2={barCenterX}
        y2={y}
        stroke={fill}
        strokeWidth={1.5}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
      />
      <line
        x1={barCenterX}
        y1={y + height}
        x2={barCenterX}
        y2={y + height + wickBottomLength}
        stroke={fill}
        strokeWidth={1.5}
      />
    </g>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CandlestickDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps): React.ReactElement | null {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-600 shadow-xl rounded-lg text-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-slate-500 dark:text-slate-400">시가</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{data.open.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</span>
          <span className="text-slate-500 dark:text-slate-400">고가</span>
          <span className="font-medium text-red-600 dark:text-red-400">{data.high.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</span>
          <span className="text-slate-500 dark:text-slate-400">저가</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">{data.low.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</span>
          <span className="text-slate-500 dark:text-slate-400">종가</span>
          <span className={`font-medium ${data.isPositive ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {data.close.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

type Period = '7D' | '30D';

export const CandlestickChart: React.FC<Props> = memo(function CandlestickChart({ data }) {
  const [period, setPeriod] = useState<Period>('30D');

  const filteredData = useMemo(() => {
    if (data.length === 0) return [];
    const daysToShow = period === '7D' ? 7 : 30;
    return data.slice(-daysToShow);
  }, [data, period]);

  const chartData = useMemo<CandlestickDataPoint[]>(() => {
    return filteredData.map(item => {
      const isPositive = item.close >= item.open;
      const bodyTop = Math.max(item.open, item.close);
      const bodyBottom = Math.min(item.open, item.close);
      
      return {
        ...item,
        openClose: [bodyBottom, bodyTop] as [number, number],
        isPositive
      };
    });
  }, [filteredData]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 0 };
    const allPrices = chartData.flatMap(d => [d.high, d.low]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1;
    return { minPrice: min - padding, maxPrice: max + padding };
  }, [chartData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-center h-[300px] text-slate-400 dark:text-slate-500">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            캔들스틱 차트
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USD/KRW 환율 OHLC</p>
        </div>
        
        <div className="flex gap-2">
          {(['7D', '30D'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {p === '7D' ? '7일' : '30일'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 50, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              minTickGap={20}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              orientation="right"
              tickFormatter={(v) => v.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="openClose"
              barSize={12}
              shape={(props: unknown) => <CandlestickShape {...(props as CandlestickShapeProps)} />}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`body-${index}`}
                  fill={entry.isPositive ? '#dc2626' : '#2563eb'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600"></div>
          <span>양봉 (상승)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600"></div>
          <span>음봉 (하락)</span>
        </div>
      </div>
    </div>
  );
});

export default CandlestickChart;
