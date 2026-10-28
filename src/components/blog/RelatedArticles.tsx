import Link from 'next/link';
import { Article } from '@/types/article';
import ArticleCard from '../magazine/ArticleCard';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface RelatedArticlesProps {
  articles: Article[];
  currentCategory: string;
}

export default function RelatedArticles({ articles, currentCategory }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-20 pt-14 border-t border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            Suggested For You · {currentCategory}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Continue Reading
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Handpicked research and implementation guides to deepen your understanding.
          </p>
        </div>

        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg transition-colors shadow-2xs shrink-0"
        >
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Browse All Publications</span>
        </Link>
      </div>

      {/* Suggested 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
