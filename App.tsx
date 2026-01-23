
import React, { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Converter } from './components/Converter';
import { AppSkeleton, ChartSkeleton, StatisticsSkeleton, NewsSkeleton } from './components/Skeleton';
import { ToastContainer } from './components/Toast';
import { useExchangeRate } from './hooks/useExchangeRate';
import { useToast } from './hooks/useToast';

const HistoryChart = lazy(() => import('./components/HistoryChart').then(m => ({ default: m.HistoryChart })));
const RateStatistics = lazy(() => import('./components/RateStatistics').then(m => ({ default: m.RateStatistics })));
const ExchangeNews = lazy(() => import('./components/ExchangeNews').then(m => ({ default: m.ExchangeNews })));
const ComparisonChart = lazy(() => import('./components/ComparisonChart').then(m => ({ default: m.ComparisonChart })));

const App: React.FC = () => {
  const {
    data,
    loading,
    error,
    period,
    chartType,
    filteredHistory,
    fetchData,
    handlePeriodChange,
    handleChartTypeToggle,
  } = useExchangeRate();

  const { toasts, addToast, removeToast } = useToast();

  const handleRetry = async () => {
    addToast('환율 정보를 다시 불러오는 중...', 'info');
    await fetchData();
    if (!error) {
      addToast('환율 정보를 성공적으로 불러왔습니다.', 'success');
    }
  };

  if (loading) {
    return (
      <>
        <AppSkeleton />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div 
            role="alert"
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md border border-slate-200 dark:border-slate-700"
          >
            <div className="text-red-500 text-5xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">오류 발생</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <button 
              onClick={handleRetry}
              aria-label="환율 정보 다시 불러오기"
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                통화 변환기
              </h2>
              <Converter baseRate={data.rate} />
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400 dark:text-slate-500">마지막 업데이트: {data.lastUpdate}</p>
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">현재 환율 (1 USD)</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.rate.toLocaleString('ko-KR')} KRW</p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.514 1.31c.356.412.96.816 1.857 1.123.446.152.92.213 1.383.18V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.514-1.31c-.356-.412-.96-.816-1.857-1.123A4.493 4.493 0 0011 5.092V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <Suspense fallback={<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"><StatisticsSkeleton /></div>}>
              <RateStatistics history={filteredHistory} />
            </Suspense>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">환율 추이</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">최근 {period === '7D' ? '7' : '30'}일간의 원/달러 환율 변동 내역입니다.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleChartTypeToggle}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    aria-label={chartType === 'area' ? '막대 그래프로 전환' : '영역 그래프로 전환'}
                  >
                    {chartType === 'area' ? (
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    )}
                  </button>
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                      onClick={() => handlePeriodChange('7D')}
                      aria-label="7일 데이터 보기"
                      aria-pressed={period === '7D'}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                        period === '7D'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      7D
                    </button>
                    <button
                      onClick={() => handlePeriodChange('30D')}
                      aria-label="30일 데이터 보기"
                      aria-pressed={period === '30D'}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                        period === '30D'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      30D
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <Suspense fallback={<ChartSkeleton />}>
                  <HistoryChart
                    data={filteredHistory}
                    chartType={chartType}
                  />
                </Suspense>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-[400px] animate-pulse" />}>
            <ComparisonChart data={data.multiHistory} />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"><NewsSkeleton /></div>}>
            <ExchangeNews />
          </Suspense>
        </div>
      </main>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
