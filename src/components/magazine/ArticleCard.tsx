import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Thumbnail */}
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-16/10 bg-slate-100 overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
        tabIndex={-1}
      >
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-sm shadow-xs border border-slate-200/60">
            {article.category}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-2.5">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            <Link
              href={`/blog/${article.slug}`}
              className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xs"
            >
              {article.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>

        <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(article.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readingTime} min
            </span>
          </div>

          <Link
            href={`/blog/${article.slug}`}
            className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn"
            aria-label={`Read ${article.title}`}
          >
            <span>Read</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
