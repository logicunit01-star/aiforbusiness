import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section className="mb-14 sm:mb-20">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-shadow hover:shadow-md group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          {/* Image Column */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px] bg-slate-100 overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-sm">
                  Featured Story · {article.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-[1.2]">
                <Link href={`/blog/${article.slug}`} className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">
                  {article.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                {article.description}
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(article.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {article.readingTime} min read
                </span>
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group/link"
              >
                Read Article
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
