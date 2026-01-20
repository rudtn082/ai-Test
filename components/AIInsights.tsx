
import React, { useState } from 'react';
import { getFXInsights } from '../services/geminiService';
import { HistoryPoint, MarketInsight } from '../types';

interface Props {
  currentRate: number;
  history: HistoryPoint[];
}

export const AIInsights: React.FC<Props> = ({ currentRate, history }) => {
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFXInsights(currentRate, history);
      setInsight(data);
    } catch (err) {
      setError("AI 분석을 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.293 3.293a1 1 0 01-1.414 0l-3.293-3.293a1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zM5.88 15.93a1 1 0 001.415 0l3.292-3.292a1 1 0 00.285-1.05l-1.738-5.42a1 1 0 00-.894-.582 1 1 0 00-.894.582l-1.738 5.42a1 1 0 00.285 1.05l3.292 3.292a1 1 0 001.415 0z" clipRule="evenodd" />
            </svg>
          </div>
          AI 마켓 인사이트
        </h2>
        {!insight && !loading && (
          <button 
            onClick={handleFetchInsights}
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 underline"
          >
            분석하기
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">Gemini AI가 시장을 분석 중입니다...</p>
        </div>
      ) : insight ? (
        <div className="space-y-6 animate-fadeIn">
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            insight.trend === 'UP' ? 'bg-red-50 text-red-700' : 
            insight.trend === 'DOWN' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
          }`}>
            <div className="text-2xl font-bold">
              {insight.trend === 'UP' ? '📈' : insight.trend === 'DOWN' ? '📉' : '➖'}
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider opacity-70">예상 트렌드</p>
              <p className="font-bold text-lg">
                {insight.trend === 'UP' ? '상승 (원화 약세)' : insight.trend === 'DOWN' ? '하락 (원화 강세)' : '보합'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">시장 요약</p>
            <p className="text-sm text-slate-700 leading-relaxed">{insight.summary}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-3">주요 영향 요인</p>
            <div className="space-y-2">
              {insight.factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1 w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <p className="text-xs font-bold text-purple-800 uppercase mb-1">AI 추천 전략</p>
            <p className="text-sm text-purple-900 font-medium italic">"{insight.recommendation}"</p>
          </div>

          <button 
            onClick={handleFetchInsights}
            className="w-full mt-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            업데이트된 분석 받기
          </button>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 mb-4">현재 시장 데이터를 바탕으로 Gemini AI의 정밀 분석을 받아보세요.</p>
          <button 
            onClick={handleFetchInsights}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-200"
          >
            지금 분석 시작
          </button>
        </div>
      )}
    </div>
  );
};
