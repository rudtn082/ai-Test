import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              데이터 출처
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                <span>환율 데이터: <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Frankfurter API</a>, <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Yahoo Finance</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                <span>시장 지표: <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Yahoo Finance</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                <span>뉴스: <a href="https://news.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google News</a></span>
              </li>
            </ul>
          </div>
          
          <div className="md:text-right">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              안내사항
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              본 서비스에서 제공하는 환율 및 시장 데이터는 참고용이며,<br className="hidden sm:inline" />
              실제 거래 시 금융기관의 고시환율을 확인하시기 바랍니다.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              ₩
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">금융 인사이트</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Financial Insights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
