import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleCategory, CategoryInfo } from '@/types/article';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles: Article[] = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const slug = data.slug || fileName.replace(/\.mdx?$/, '');

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        modifiedDate: data.modifiedDate || data.date || '',
        category: (data.category as ArticleCategory) || 'Business Strategy',
        featuredImage: data.featuredImage || '/images/placeholder.webp',
        featuredImageAlt: data.featuredImageAlt || data.title || '',
        readingTime: data.readingTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
        wordCount: data.wordCount || content.split(/\s+/).length,
        author: data.author || 'AIForBusinessHub Editorial',
        faqs: data.faqs || [],
        content,
      };
    });

  // Sort articles by date descending
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedArticle(): Article | null {
  const articles = getAllArticles();
  return articles.length > 0 ? articles[0] : null;
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 3): Article[] {
  const articles = getAllArticles();
  const sameCategory = articles.filter(
    (a) => a.slug !== currentSlug && a.category === category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const otherArticles = articles.filter(
    (a) => a.slug !== currentSlug && a.category !== category
  );

  return [...sameCategory, ...otherArticles].slice(0, limit);
}

export function getAllCategories(): CategoryInfo[] {
  const articles = getAllArticles();
  const counts: Record<string, number> = {};

  articles.forEach((article) => {
    counts[article.category] = (counts[article.category] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name: name as ArticleCategory,
    count,
  }));
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const articles = getAllArticles();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.content.toLowerCase().includes(q)
  );
}
