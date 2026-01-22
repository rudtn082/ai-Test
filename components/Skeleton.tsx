import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
    style={style}
    aria-hidden="true"
  />
);

export const ConverterSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
    <div className="pt-2">
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="h-full min-h-[400px] flex flex-col">
    <div className="flex justify-between mb-8">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
    <div className="flex-grow flex items-end gap-2 px-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
    <Skeleton className="h-4 w-full mt-4" />
  </div>
);

export const StatisticsSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const NewsSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const RateCardSkeleton: React.FC = () => (
  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
    <Skeleton className="h-3 w-32 mb-4" />
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
  </div>
);

export const AppSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
    
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
            </div>
            <ConverterSkeleton />
            <RateCardSkeleton />
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <StatisticsSkeleton />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    </main>
  </div>
);
