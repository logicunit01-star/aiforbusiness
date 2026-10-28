import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllArticles, getAllSlugs, getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { extractToc, renderMarkdownToHtml } from '@/lib/markdown';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleBody from '@/components/blog/ArticleBody';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedArticles from '@/components/blog/RelatedArticles';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const canonicalUrl = `https://aiforbusinesshub.com/blog/${article.slug}`;
  const ogImage = article.featuredImage.startsWith('http')
    ? article.featuredImage
    : `https://aiforbusinesshub.com${article.featuredImage}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.modifiedDate || article.date,
      authors: [article.author],
      section: article.category,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.featuredImageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const tocItems = extractToc(article.content);
  const htmlContent = renderMarkdownToHtml(article.content);

  // Suggested Articles
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);
  
  // Other suggested reads for sidebar and in-content
  const otherArticles = allArticles.filter(
    (a) => a.slug !== article.slug && !relatedArticles.some((r) => r.slug === a.slug)
  );

  const sidebarSuggestions = otherArticles.slice(0, 2);
  const inContentSuggestion = relatedArticles.length > 0 ? relatedArticles[0] : null;

  // JSON-LD Schemas
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: [
      article.featuredImage.startsWith('http')
        ? article.featuredImage
        : `https://aiforbusinesshub.com${article.featuredImage}`,
    ],
    datePublished: article.date,
    dateModified: article.modifiedDate || article.date,
    author: {
      '@type': 'Organization',
      name: 'AIForBusinessHub Editorial Team',
      url: 'https://aiforbusinesshub.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIForBusinessHub',
      url: 'https://aiforbusinesshub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aiforbusinesshub.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aiforbusinesshub.com/blog/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aiforbusinesshub.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category,
        item: `https://aiforbusinesshub.com/#articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://aiforbusinesshub.com/blog/${article.slug}`,
      },
    ],
  };

  const faqJsonLd =
    article.faqs && article.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Structured Data Script Tags */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        {/* Unified 12-Column Editorial Grid: Header & Body Perfectly Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Editorial Column (8 Cols): Title, Meta, Image, and Body Text share exact alignment */}
          <div className="lg:col-span-8 min-w-0">
            {/* Article Header (Breadcrumb, Category, Title, Excerpt, Metadata, Image) */}
            <ArticleHeader article={article} />

            {/* Main Article Content, Callouts, and FAQs */}
            <ArticleBody
              htmlContent={htmlContent}
              faqs={article.faqs}
              suggestedInContent={inContentSuggestion}
            />
          </div>

          {/* Sticky Sidebar (4 Cols): Table of Contents & Suggested Reads */}
          <div className="lg:col-span-4 min-w-0">
            <TableOfContents
              items={tocItems}
              suggestedArticles={sidebarSuggestions}
            />
          </div>
        </div>

        {/* Suggested / Related Articles Section across full container */}
        <RelatedArticles
          articles={relatedArticles}
          currentCategory={article.category}
        />
      </article>
    </>
  );
}
