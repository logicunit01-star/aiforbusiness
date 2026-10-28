import { getAllArticles, getAllCategories, getFeaturedArticle } from '@/lib/articles';
import FeaturedArticle from '@/components/magazine/FeaturedArticle';
import ArticleGrid from '@/components/magazine/ArticleGrid';
import NewsletterCTA from '@/components/magazine/NewsletterCTA';

export default function HomePage() {
  const allArticles = getAllArticles();
  const featuredArticle = getFeaturedArticle();
  const categories = getAllCategories();

  // Exclude featured article from grid so content is not duplicated
  const gridArticles = featuredArticle
    ? allArticles.filter((a) => a.slug !== featuredArticle.slug)
    : allArticles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Masthead */}
      <section className="border-b border-slate-200 pb-8 sm:pb-12 mb-10 sm:mb-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            Digital Publication · 2026 Edition
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-4">
            Practical AI insights for smarter business decisions.
          </h1>
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            Independent cost breakdowns, agent architectures, and strategic implementation playbooks designed for founders, technical leaders, and modern operators.
          </p>
        </div>
      </section>

      {/* Featured Editorial Story */}
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}

      {/* Magazine Articles Grid with Functional Category Filters */}
      <ArticleGrid articles={gridArticles} categories={categories} />

      {/* Editorial Advisory / Newsletter Callout */}
      <NewsletterCTA />
    </div>
  );
}
