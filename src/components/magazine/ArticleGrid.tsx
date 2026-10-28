'use client';

import { useState, useMemo } from 'react';
import { Article, CategoryInfo } from '@/types/article';
import ArticleCard from './ArticleCard';
import CategoryNavigation from './CategoryNavigation';
import { Sparkles, ChevronDown } from 'lucide-react';

interface ArticleGridProps {
  articles: Article[];
  categories: CategoryInfo[];
}

const ITEMS_PER_PAGE = 9;

export default function ArticleGrid({ articles, categories }: ArticleGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return articles;
    return articles.filter(
      (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [articles, selectedCategory]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const currentDisplayArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <section id="articles" className="scroll-mt-24 space-y-8">
      {/* Section Header with Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Editorial Collection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Latest Publications & Guides
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            In-depth guides on AI agents, automation architectures, and real development costs.
          </p>
        </div>

        {/* Categories Bar */}
        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          totalArticles={articles.length}
        />
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm">
            No articles found in this category.
          </p>
          <button
            onClick={() => handleSelectCategory('all')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View all articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentDisplayArticles.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              priority={index < 3}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span>Load More Articles</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Showing {currentDisplayArticles.length} of {filteredArticles.length} articles
          </p>
        </div>
      )}
    </section>
  );
}
