import Link from 'next/link';
import { Article, ArticleFaq } from '@/types/article';
import { HelpCircle, Sparkles, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface ArticleBodyProps {
  htmlContent: string;
  faqs?: ArticleFaq[];
  suggestedInContent?: Article | null;
}

export default function ArticleBody({ htmlContent, faqs, suggestedInContent }: ArticleBodyProps) {
  return (
    <div className="w-full">
      {/* Main Prose Content */}
      <div
        className="article-prose w-full max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* In-Article Recommended Read Card */}
      {suggestedInContent && (
        <div className="my-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-100/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Recommended Next Deep Dive
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
            <Link href={`/blog/${suggestedInContent.slug}`}>
              {suggestedInContent.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {suggestedInContent.description}
          </p>
          <Link
            href={`/blog/${suggestedInContent.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Read Full Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Frequently Asked Questions Section */}
      {faqs && faqs.length > 0 && (
        <section className="mt-14 pt-10 border-t-2 border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
            Key Takeaways & Common Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-slate-200/90 p-5 open:shadow-xs transition-all duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg select-none list-none group-open:text-blue-600">
                  <span className="pr-4 leading-snug">{faq.question}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 text-xs">
                    ▼
                  </span>
                </summary>
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Editorial Contact Card */}
      <div className="mt-14 p-6 sm:p-8 bg-slate-900 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <MessageSquareQuote className="w-4 h-4" />
            Have Questions or Need Scoping?
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Discuss your AI project with our team
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            Reach out to our independent research team for scoping reviews, vendor evaluations, or feedback.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition-colors shrink-0 shadow-xs"
        >
          <span>Contact Us</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </Link>
      </div>
    </div>
  );
}
