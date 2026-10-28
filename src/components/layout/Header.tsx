'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import SearchModal from './SearchModal';
import { Article } from '@/types/article';

interface HeaderProps {
  searchArticles?: Pick<Article, 'slug' | 'title' | 'description' | 'category' | 'readingTime'>[];
}

export default function Header({ searchArticles = [] }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/#articles' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Official Logo Brandmark */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="group flex items-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm py-1"
                aria-label="AIForBusinessHub Home"
              >
                <Image
                  src="/images/logo.png"
                  alt="AIForBusinessHub Logo"
                  width={240}
                  height={65}
                  priority
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors hover:text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm py-1 ${
                      isActive ? 'text-slate-950 font-bold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search & Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Open search"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Search articles...</span>
                <kbd className="hidden lg:inline-block text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded-xs border border-slate-200">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Get in Touch
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-center shadow-xs"
              >
                Contact Editorial Team
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={searchArticles}
      />
    </>
  );
}
