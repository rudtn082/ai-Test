import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Converter } from '../components/Converter';

describe('Converter', () => {
  const baseRate = 1350;

  it('should render with initial state', () => {
    render(<Converter baseRate={baseRate} />);

    expect(screen.getByLabelText(/USD 금액 입력/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/통화 교환/i)).toBeInTheDocument();
    expect(screen.getByText(/환율 정보:/i)).toBeInTheDocument();
  });

  it('should convert USD to KRW', () => {
    render(<Converter baseRate={baseRate} />);

    const input = screen.getByLabelText(/USD 금액 입력/i);
    fireEvent.change(input, { target: { value: '100' } });

    expect(screen.getByRole('status')).toHaveTextContent('135,000.00');
  });

  it('should swap currencies', () => {
    render(<Converter baseRate={baseRate} />);

    const swapButton = screen.getByLabelText(/통화 교환/i);
    fireEvent.click(swapButton);

    expect(screen.getByLabelText(/KRW 금액 입력/i)).toBeInTheDocument();
  });

  it('should handle empty input', () => {
    render(<Converter baseRate={baseRate} />);

    const input = screen.getByLabelText(/USD 금액 입력/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByRole('status')).toHaveTextContent('0.00');
  });

  it('should prevent negative values', () => {
    render(<Converter baseRate={baseRate} />);

    const input = screen.getByLabelText(/USD 금액 입력/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '-100' } });

    expect(input.value).toBe('0');
  });

  it('should display exchange rate info', () => {
    render(<Converter baseRate={baseRate} />);

    expect(screen.getByText(/1 USD = 1,350 KRW/i)).toBeInTheDocument();
  });
});
