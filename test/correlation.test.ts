import { describe, it, expect } from 'vitest';
import { calculateCorrelation, buildCorrelationMatrix } from '../utils/correlation';

describe('calculateCorrelation', () => {
  it('should return 1.0 for perfectly positive correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    expect(calculateCorrelation(x, y)).toBeCloseTo(1.0);
  });

  it('should return -1.0 for perfectly negative correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 4, 3, 2, 1];
    expect(calculateCorrelation(x, y)).toBeCloseTo(-1.0);
  });

  it('should return approximately 0 for no correlation', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 1, 5, 3];
    const result = calculateCorrelation(x, y);
    expect(Math.abs(result)).toBeLessThan(0.5);
  });

  it('should handle empty arrays', () => {
    expect(calculateCorrelation([], [])).toBe(0);
  });

  it('should handle arrays with NaN values', () => {
    const x = [1, NaN, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    const result = calculateCorrelation(x, y);
    expect(result).not.toBeNaN();
  });

  it('should handle different length arrays', () => {
    const x = [1, 2, 3];
    const y = [1, 2, 3, 4, 5];
    const result = calculateCorrelation(x, y);
    expect(result).toBeCloseTo(1.0);
  });

  it('should clamp results between -1 and 1', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 20, 30, 40, 50];
    const result = calculateCorrelation(x, y);
    expect(result).toBeGreaterThanOrEqual(-1);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe('buildCorrelationMatrix', () => {
  it('should return 4x4 matrix', () => {
    const data = {
      KRW: [1, 2, 3, 4, 5],
      WTI: [1, 2, 3, 4, 5],
      KOSPI: [1, 2, 3, 4, 5],
      Gold: [1, 2, 3, 4, 5]
    };
    
    const matrix = buildCorrelationMatrix(data);
    
    expect(matrix.length).toBe(4);
    matrix.forEach(row => {
      expect(row.length).toBe(4);
    });
  });

  it('should have 1.0 on diagonal', () => {
    const data = {
      KRW: [1, 2, 3, 4, 5],
      WTI: [5, 4, 3, 2, 1],
      KOSPI: [2, 4, 6, 8, 10],
      Gold: [1, 3, 2, 4, 3]
    };
    
    const matrix = buildCorrelationMatrix(data);
    
    for (let i = 0; i < 4; i++) {
      expect(matrix[i][i].value).toBe(1.0);
    }
  });

  it('should have correct row and col labels', () => {
    const data = {
      KRW: [1, 2, 3],
      WTI: [1, 2, 3],
      KOSPI: [1, 2, 3],
      Gold: [1, 2, 3]
    };
    
    const matrix = buildCorrelationMatrix(data);
    
    expect(matrix[0][0].row).toBe('KRW');
    expect(matrix[0][0].col).toBe('KRW');
    expect(matrix[0][1].col).toBe('WTI');
    expect(matrix[1][0].row).toBe('WTI');
  });

  it('should be symmetric (correlation of A,B equals B,A)', () => {
    const data = {
      KRW: [1, 2, 3, 4, 5],
      WTI: [5, 4, 3, 2, 1],
      KOSPI: [2, 3, 4, 5, 6],
      Gold: [1, 3, 2, 4, 5]
    };
    
    const matrix = buildCorrelationMatrix(data);
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        expect(matrix[i][j].value).toBeCloseTo(matrix[j][i].value);
      }
    }
  });
});
