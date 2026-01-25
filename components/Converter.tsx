
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Currency } from '../types';

interface Props {
  baseRate: number;
}

const MAX_AMOUNT_USD = 1_000_000_000;
const MAX_AMOUNT_KRW = 1_000_000_000_000;

export const Converter: React.FC<Props> = ({ baseRate }) => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
  const [result, setResult] = useState<number>(baseRate);

  const maxAmount = useMemo(() => 
    fromCurrency === Currency.USD ? MAX_AMOUNT_USD : MAX_AMOUNT_KRW,
    [fromCurrency]
  );

  useEffect(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) {
      setResult(0);
      return;
    }

    if (fromCurrency === Currency.USD) {
      setResult(val * baseRate);
    } else {
      setResult(val / baseRate);
    }
  }, [amount, fromCurrency, baseRate]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '') {
      setAmount('');
      return;
    }

    const numValue = parseFloat(value);
    
    if (numValue < 0) {
      setAmount('0');
      return;
    }

    if (numValue > maxAmount) {
      setAmount(maxAmount.toString());
      return;
    }

    setAmount(value);
  }, [maxAmount]);

  const handleSwap = useCallback(() => {
    setFromCurrency(prev => prev === Currency.USD ? Currency.KRW : Currency.USD);
    const currentResult = result.toString();
    setAmount(currentResult.includes('.') ? parseFloat(currentResult).toFixed(2) : currentResult);
  }, [result]);

  const toCurrency = fromCurrency === Currency.USD ? Currency.KRW : Currency.USD;

  return (
    <div className="space-y-4">
      <div>
        <label 
          htmlFor="converter-amount"
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider"
        >
          보내는 금액
        </label>
        <div className="flex items-center gap-2">
          <input
            id="converter-amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            max={maxAmount}
            step="any"
            aria-label={`${fromCurrency} 금액 입력`}
            aria-describedby="converter-rate-info"
            className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="0.00"
          />
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-600 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-slate-200 dark:border-slate-500 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{fromCurrency}</span>
            <img 
              src={fromCurrency === Currency.USD ? "https://flagcdn.com/w20/us.png" : "https://flagcdn.com/w20/kr.png"} 
              alt={`${fromCurrency} 국기`}
              className="w-4 sm:w-5 h-auto rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-2 relative z-10">
        <button 
          onClick={handleSwap}
          aria-label="통화 교환"
          className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all text-blue-600 dark:text-blue-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          받는 금액
        </label>
        <div className="flex items-center gap-2">
          <div 
            role="status"
            aria-live="polite"
            aria-label={`변환 결과: ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`}
            className="flex-1 min-w-0 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-blue-900 dark:text-blue-200 truncate"
          >
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-600 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border border-slate-200 dark:border-slate-500 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{toCurrency}</span>
            <img 
              src={fromCurrency === Currency.USD ? "https://flagcdn.com/w20/kr.png" : "https://flagcdn.com/w20/us.png"} 
              alt={`${toCurrency} 국기`}
              className="w-4 sm:w-5 h-auto rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div id="converter-rate-info" className="flex justify-between text-sm text-slate-500 dark:text-slate-400 px-1">
          <span>환율 정보:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">1 {Currency.USD} = {baseRate.toLocaleString()} {Currency.KRW}</span>
        </div>
      </div>
    </div>
  );
};
