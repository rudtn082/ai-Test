
import React, { useState, useEffect } from 'react';
import { Currency } from '../types';

interface Props {
  baseRate: number;
}

export const Converter: React.FC<Props> = ({ baseRate }) => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
  const [result, setResult] = useState<number>(baseRate);

  useEffect(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) {
      setResult(0);
      return;
    }

    if (fromCurrency === Currency.USD) {
      setResult(val * baseRate);
    } else {
      setResult(val / baseRate);
    }
  }, [amount, fromCurrency, baseRate]);

  const handleSwap = () => {
    setFromCurrency(prev => prev === Currency.USD ? Currency.KRW : Currency.USD);
    // When swapping, try to keep the logic natural
    const currentResult = result.toString();
    setAmount(currentResult.includes('.') ? parseFloat(currentResult).toFixed(2) : currentResult);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">보내는 금액</label>
        <div className="flex items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            placeholder="0.00"
          />
          <div className="absolute right-3 flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-700">{fromCurrency}</span>
            <img 
              src={fromCurrency === Currency.USD ? "https://flagcdn.com/w20/us.png" : "https://flagcdn.com/w20/kr.png"} 
              alt={fromCurrency}
              className="w-5 h-auto rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-2 relative z-10">
        <button 
          onClick={handleSwap}
          className="bg-white border border-slate-200 p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">받는 금액</label>
        <div className="flex items-center">
          <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-lg font-bold text-blue-900">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="absolute right-3 flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-700">{fromCurrency === Currency.USD ? Currency.KRW : Currency.USD}</span>
            <img 
              src={fromCurrency === Currency.USD ? "https://flagcdn.com/w20/kr.png" : "https://flagcdn.com/w20/us.png"} 
              alt="target"
              className="w-5 h-auto rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between text-sm text-slate-500 px-1">
          <span>환율 정보:</span>
          <span className="font-semibold text-slate-700">1 {Currency.USD} = {baseRate.toLocaleString()} {Currency.KRW}</span>
        </div>
      </div>
    </div>
  );
};
