import type { CorrelationIndicator, CorrelationCell } from '../types';

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  let validCount = 0;
  
  for (let i = 0; i < n; i++) {
    if (isNaN(x[i]) || isNaN(y[i]) || x[i] == null || y[i] == null) continue;
    
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
    validCount++;
  }
  
  if (validCount === 0) return 0;
  
  const numerator = validCount * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (validCount * sumX2 - sumX * sumX) * (validCount * sumY2 - sumY * sumY)
  );
  
  if (denominator === 0) return 0;
  
  const correlation = numerator / denominator;
  
  return Math.max(-1, Math.min(1, correlation));
}

export function buildCorrelationMatrix(
  data: Record<CorrelationIndicator, number[]>
): CorrelationCell[][] {
  const indicators: CorrelationIndicator[] = ['KRW', 'WTI', 'KOSPI', 'Gold'];
  const matrix: CorrelationCell[][] = [];
  
  for (const row of indicators) {
    const rowCells: CorrelationCell[] = [];
    for (const col of indicators) {
      const value = row === col ? 1.0 : calculateCorrelation(data[row], data[col]);
      rowCells.push({ row, col, value });
    }
    matrix.push(rowCells);
  }
  
  return matrix;
}
