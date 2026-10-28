'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '@/types/article';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Pick<Article, 'slug' | 'title' | 'description' | 'category' | 'readingTime'>[];
}

export default function SearchModal({ isOpen, onClose, articles }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI business guides, costs, agents..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-hidden"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Type to search all articles across our digital magazine.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <p>No articles found matching &ldquo;{query}&rdquo;.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                onClick={onClose}
                className="group block py-3 first:pt-0 last:pb-0 hover:bg-slate-50 rounded-lg px-3 -mx-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">{item.readingTime} min read</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
              </Link>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Found {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</span>
            <span className="flex items-center gap-1">Press ESC to exit</span>
          </div>
        )}
      </div>
    </div>
  );
}
