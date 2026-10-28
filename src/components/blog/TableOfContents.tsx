'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TocItem } from '@/lib/markdown';
import { Article } from '@/types/article';
import { ListFilter, ArrowUp, Bookmark, Sparkles, Clock, Check } from 'lucide-react';

interface TableOfContentsProps {
  items: TocItem[];
  suggestedArticles?: Article[];
}

export default function TableOfContents({ items, suggestedArticles = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (items.length === 0) return;

    // Set first item as default active if near top
    if (!activeId && items[0]) {
      setActiveId(items[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-90px 0% -65% 0%',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, activeId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (items.length === 0) return null;

  // Compute H2 index for numbering
  let h2Count = 0;

  return (
    <>
      {/* Mobile Sticky Floating Pill / Accordion */}
      <div className="lg:hidden mb-8 p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex items-center justify-between w-full text-sm font-bold text-slate-900"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-blue-600" />
            <span>Table of Contents</span>
            <span className="text-xs font-normal text-slate-400">({items.length} sections)</span>
          </span>
          <span className="text-xs text-blue-600 font-semibold">
            {isOpenMobile ? 'Hide ▲' : 'Show ▼'}
          </span>
        </button>

        {isOpenMobile && (
          <nav className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2 max-h-72 overflow-y-auto pr-2">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpenMobile(false)}
                  className={`block py-1.5 transition-colors ${
                    item.level === 3 ? 'pl-4 text-slate-500 text-[11px]' : 'font-medium text-slate-800'
                  } ${isActive ? 'text-blue-600 font-bold bg-blue-50/80 px-2 rounded-sm' : 'hover:text-blue-600'}`}
                >
                  {item.text}
                </a>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside aria-label="Table of contents and suggestions" className="hidden lg:block w-full">
        <div className="sticky top-24 space-y-6">
          {/* Table of Contents Box */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <ListFilter className="w-4 h-4 text-blue-600" />
                <span>Contents</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {items.length} Sections
              </span>
            </div>

            <nav className="max-h-[45vh] overflow-y-auto space-y-1 text-xs pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {items.map((item) => {
                const isActive = activeId === item.id;
                if (item.level === 2) h2Count++;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`group flex items-start gap-2 py-1.5 px-2.5 rounded-lg transition-all leading-snug ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border-l-3 border-blue-600'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {item.level === 2 ? (
                      <span
                        className={`text-[10px] font-mono shrink-0 mt-0.5 ${
                          isActive ? 'text-blue-600 font-bold' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {String(h2Count).padStart(2, '0')}
                      </span>
                    ) : (
                      <span className="text-slate-300 shrink-0 mt-0.5 pl-2">↳</span>
                    )}
                    <span className={`truncate ${item.level === 3 ? 'text-[11px] text-slate-500' : ''}`}>
                      {item.text}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions Footer inside TOC */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1 hover:text-blue-600 font-medium transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1 hover:text-blue-600 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suggested Articles Widget in Sidebar */}
          {suggestedArticles.length > 0 && (
            <div className="p-5 bg-gradient-to-b from-slate-50/80 to-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-2 border-b border-slate-200/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Suggested Reads</span>
              </div>

              <div className="space-y-3.5">
                {suggestedArticles.slice(0, 2).map((sug) => (
                  <Link
                    key={sug.slug}
                    href={`/blog/${sug.slug}`}
                    className="group block space-y-1.5 p-2 rounded-xl hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-slate-200"
                  >
                    <div className="relative aspect-16/9 w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                      <Image
                        src={sug.featuredImage}
                        alt={sug.title}
                        fill
                        sizes="260px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {sug.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {sug.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{sug.readingTime} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
