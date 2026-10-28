export type ArticleCategory =
  | 'AI Automation'
  | 'AI Tools'
  | 'Business Strategy'
  | 'AI Development';

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  modifiedDate?: string;
  category: ArticleCategory;
  featuredImage: string;
  featuredImageAlt: string;
  readingTime: number;
  wordCount: number;
  author: string;
  faqs?: ArticleFaq[];
  content: string;
}

export interface CategoryInfo {
  name: ArticleCategory;
  count: number;
}
