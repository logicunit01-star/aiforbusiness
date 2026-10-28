import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllArticles } from '@/lib/articles';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aiforbusinesshub.com'),
  title: {
    default: 'AIForBusinessHub | Practical AI Insights for Smarter Business Decisions',
    template: '%s | AIForBusinessHub',
  },
  description:
    'Practical AI insights for smarter business decisions. In-depth pricing guides, AI agent architecture, automation workflows, and real-world deployment frameworks.',
  keywords: [
    'AI for Business',
    'AI Agent Development Cost',
    'AI Chatbot Pricing',
    'AI Workflow Automation',
    'AI MVP Development',
    'Business AI Strategy',
  ],
  authors: [{ name: 'AIForBusinessHub Editorial Team' }],
  creator: 'AIForBusinessHub',
  publisher: 'AIForBusinessHub',
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiforbusinesshub.com',
    siteName: 'AIForBusinessHub',
    title: 'AIForBusinessHub | Modern Digital Magazine for Enterprise AI',
    description:
      'Practical AI insights for smarter business decisions. Discover realistic pricing breakdowns, automation playbooks, and strategic AI guides.',
    images: [
      {
        url: '/images/articles/How-to-Plan-an-AI-System-in-7-Days.webp',
        width: 1200,
        height: 630,
        alt: 'AIForBusinessHub Magazine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForBusinessHub',
    description: 'Practical AI insights for smarter business decisions.',
    images: ['/images/articles/How-to-Plan-an-AI-System-in-7-Days.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const articles = getAllArticles();
  const searchArticles = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    readingTime: a.readingTime,
  }));

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FBFBFD] text-slate-900 antialiased font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header searchArticles={searchArticles} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
