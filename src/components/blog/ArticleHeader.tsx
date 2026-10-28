import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Calendar, Clock, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';
import ShareButtons from './ShareButtons';

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const currentUrl = `https://aiforbusinesshub.com/blog/${article.slug}`;

  return (
    <header className="mb-10 sm:mb-14">
      {/* Sleek Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-500">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <li>
            <Link href="/#articles" className="hover:text-blue-600 transition-colors">
              {article.category}
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <li className="text-slate-900 font-semibold truncate max-w-[220px] sm:max-w-md">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Category Pill with Glowing Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 border border-blue-200/60 px-3 py-1 rounded-full shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          {article.category}
        </span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Editorial Deep Dive
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-black tracking-tight text-slate-950 leading-[1.14] mb-6 text-balance">
        {article.title}
      </h1>

      {/* Executive Excerpt */}
      {article.description && (
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mb-8">
          {article.description}
        </p>
      )}

      {/* Author & Editorial Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600">
          {/* Author */}
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              AI
            </div>
            <div className="flex items-center gap-1">
              <span>{article.author}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            </div>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(article.date)}</span>
          </div>

          {article.modifiedDate && article.modifiedDate !== article.date && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated {formatDate(article.modifiedDate)}</span>
            </div>
          )}

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Read time */}
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.readingTime} min read</span>
          </div>
        </div>

        {/* Share actions */}
        <ShareButtons title={article.title} url={currentUrl} />
      </div>

      {/* Large Framed Hero Image */}
      {article.featuredImage && (
        <div className="mt-8 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
          <div className="relative aspect-16/9 w-full bg-slate-100">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
          <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-medium truncate mr-2">Featured Figure: {article.title}</span>
            <span className="shrink-0 font-mono text-[10px] text-slate-400 uppercase">AIForBusinessHub Intelligence</span>
          </div>
        </div>
      )}
    </header>
  );
}
