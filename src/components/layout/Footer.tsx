import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Masthead column */}
          <div className="md:col-span-6 space-y-4">
            <Link
              href="/"
              className="inline-block bg-white px-3 py-2 rounded-xl shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 hover:opacity-95 transition-opacity"
              aria-label="AIForBusinessHub Home"
            >
              <Image
                src="/images/logo.png"
                alt="AIForBusinessHub Logo"
                width={220}
                height={60}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Practical AI insights for smarter business decisions. Independent editorial analysis, pricing breakdowns, and real-world implementation guides.
            </p>
          </div>

          {/* Editorial topics */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  AI Automation
                </Link>
              </li>
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  AI Development
                </Link>
              </li>
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  Business Strategy
                </Link>
              </li>
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links & contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} AIForBusinessHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Editorial Inquiries
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
