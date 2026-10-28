import { marked, Renderer } from 'marked';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  const usedIds = new Set<string>();

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText.replace(/\*\*|__/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
    let id = slugify(cleanText);
    if (!id) id = `section-${items.length + 1}`;

    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    items.push({
      id: uniqueId,
      text: cleanText,
      level,
    });
  }

  return items;
}

export function renderMarkdownToHtml(markdown: string): string {
  const renderer = new Renderer();
  const usedIds = new Set<string>();

  renderer.heading = function ({ text, depth }) {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    let id = slugify(cleanText);
    if (!id) id = `heading-${depth}`;

    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    return `<h${depth} id="${uniqueId}" class="scroll-mt-24 group">${text}</h${depth}>`;
  };

  return marked.parse(markdown, { renderer, gfm: true, breaks: true }) as string;
}
