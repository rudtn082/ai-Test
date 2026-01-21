
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">
            ₩
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">환율 인사이트</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">원/달러 분석</p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Dashboard</a>
        </nav>

        <div className="flex gap-4">
          <button className="text-slate-500 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
            <img src="https://picsum.photos/32/32" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};
