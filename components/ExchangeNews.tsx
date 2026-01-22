import React, { useState, useEffect, useCallback } from 'react';
import { NewsItem } from '../types';

const RSS_PROXY_URL = 'https://api.rss2json.com/v1/api.json';
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=원달러+환율&hl=ko&gl=KR&ceid=KR:ko';
const NEWS_COUNT = 5;
const CACHE_DURATION = 5 * 60 * 1000;

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  source?: { name: string };
  author?: string;
}

interface RssResponse {
  status: string;
  items: RssItem[];
}

function isValidRssResponse(data: unknown): data is RssResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return obj.status === 'ok' && Array.isArray(obj.items);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR');
}

function extractSource(item: RssItem): string {
  if (item.source?.name) return item.source.name;
  if (item.author) return item.author;
  return '뉴스';
}

function cleanTitle(title: string): string {
  return title.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim();
}

let cachedNews: NewsItem[] | null = null;
let cacheTimestamp = 0;

export const ExchangeNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    const now = Date.now();
    if (cachedNews && now - cacheTimestamp < CACHE_DURATION) {
      setNews(cachedNews);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${RSS_PROXY_URL}?rss_url=${encodeURIComponent(GOOGLE_NEWS_RSS)}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('뉴스를 불러오는데 실패했습니다.');
      }
      
      const data: unknown = await res.json();
      
      if (!isValidRssResponse(data)) {
        throw new Error('뉴스 데이터 형식이 올바르지 않습니다.');
      }
      
      const newsItems: NewsItem[] = data.items.slice(0, NEWS_COUNT).map((item) => ({
        title: cleanTitle(item.title),
        link: item.link,
        pubDate: item.pubDate,
        source: extractSource(item)
      }));
      
      cachedNews = newsItems;
      cacheTimestamp = now;
      setNews(newsItems);
    } catch (err) {
      const message = err instanceof Error ? err.message : '뉴스를 불러오는데 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: NEWS_COUNT }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        환율 뉴스
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3">
              {item.title}
            </h3>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate max-w-[120px]">{item.source}</span>
              <span>{formatRelativeTime(item.pubDate)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExchangeNews;
