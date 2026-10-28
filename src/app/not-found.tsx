import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6 border border-slate-200">
        404 — Article or Page Not Found
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4">
        This page could not be located.
      </h1>

      <p className="text-slate-600 max-w-md text-base sm:text-lg mb-8 leading-relaxed">
        The page or article you are looking for does not exist or has moved. Explore our latest AI business intelligence and guides on the homepage.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse All Articles</span>
        </Link>
      </div>
    </div>
  );
}
