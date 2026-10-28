'use client';

import { ArticleCategory, CategoryInfo } from '@/types/article';

interface CategoryNavigationProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalArticles: number;
}

export default function CategoryNavigation({
  categories,
  selectedCategory,
  onSelectCategory,
  totalArticles,
}: CategoryNavigationProps) {
  return (
    <nav aria-label="Category Filters" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 ${
          selectedCategory === 'all'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        All Articles <span className="opacity-70 text-xs ml-1 font-normal">({totalArticles})</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name} <span className="opacity-70 text-xs ml-1 font-normal">({cat.count})</span>
          </button>
        );
      })}
    </nav>
  );
}
