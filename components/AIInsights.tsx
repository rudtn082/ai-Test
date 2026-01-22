
import React, { useState, useCallback } from 'react';
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

  const handleFetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFXInsights(currentRate, history);
      setInsight(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI 분석을 가져오는 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentRate, history]);

  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case 'UP':
        return {
          bgClass: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
          emoji: '📈',
          label: '상승 (원화 약세)'
        };
      case 'DOWN':
        return {
          bgClass: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
          emoji: '📉',
          label: '하락 (원화 강세)'
        };
      default:
        return {
          bgClass: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
          emoji: '➖',
          label: '보합'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05l-3.293 3.293a1 1 0 01-1.414 0l-3.293-3.293a1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zM5.88 15.93a1 1 0 001.415 0l3.292-3.292a1 1 0 00.285-1.05l-1.738-5.42a1 1 0 00-.894-.582 1 1 0 00-.894.582l-1.738 5.42a1 1 0 00.285 1.05l3.292 3.292a1 1 0 001.415 0z" clipRule="evenodd" />
            </svg>
          </div>
          AI 마켓 인사이트
        </h2>
        {!insight && !loading && (
          <button 
            onClick={handleFetchInsights}
            aria-label="AI 시장 분석 시작"
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline"
          >
            분석하기
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center" role="status" aria-live="polite">
          <div className="w-10 h-10 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" aria-hidden="true"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">Gemini AI가 시장을 분석 중입니다...</p>
        </div>
      ) : insight ? (
        <div className="space-y-6 animate-fadeIn" role="region" aria-label="AI 분석 결과">
          {(() => {
            const trendConfig = getTrendConfig(insight.trend);
            return (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${trendConfig.bgClass}`}>
                <div className="text-2xl font-bold" aria-hidden="true">
                  {trendConfig.emoji}
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider opacity-70">예상 트렌드</p>
                  <p className="font-bold text-lg">{trendConfig.label}</p>
                </div>
              </div>
            );
          })()}

          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">시장 요약</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight.summary}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">주요 영향 요인</p>
            <ul className="space-y-2" aria-label="영향 요인 목록">
              {insight.factors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="mt-1 w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" aria-hidden="true"></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <p className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase mb-1">AI 추천 전략</p>
            <p className="text-sm text-purple-900 dark:text-purple-200 font-medium italic">"{insight.recommendation}"</p>
          </div>

          <button 
            onClick={handleFetchInsights}
            aria-label="새로운 AI 분석 요청"
            className="w-full mt-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            업데이트된 분석 받기
          </button>
        </div>
      ) : error ? (
        <div role="alert" className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl">
          {error}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">현재 시장 데이터를 바탕으로 Gemini AI의 정밀 분석을 받아보세요.</p>
          <button 
            onClick={handleFetchInsights}
            aria-label="AI 시장 분석 시작"
            className="bg-purple-600 dark:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all shadow-md shadow-purple-200 dark:shadow-purple-900/50"
          >
            지금 분석 시작
          </button>
        </div>
      )}
    </div>
  );
};
