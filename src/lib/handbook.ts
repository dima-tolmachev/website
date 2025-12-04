import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const handbookDirectory = path.join(process.cwd(), 'content/handbook');

export interface HandbookPage {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  order: number;
  category?: string;
  categoryOrder?: number;
  content: string;
  contentHtml?: string;
}

export interface HandbookNavItem {
  slug: string;
  title: string;
  order: number;
  category?: string;
  categoryOrder?: number;
}

export interface HandbookCategory {
  name: string;
  slug: string;
  order: number;
  items: HandbookNavItem[];
}

export interface HandbookNavigation {
  introduction: HandbookNavItem | null;
  categories: HandbookCategory[];
}

// SEO: Category metadata for structured data
export const categoryMeta: Record<string, { description: string; keywords: string[] }> = {
  'Fundamentals': {
    description: 'Master the core concepts of front-end development including JavaScript, HTML, CSS, and browser fundamentals.',
    keywords: ['javascript fundamentals', 'web fundamentals', 'frontend basics', 'browser apis'],
  },
  'Frameworks & Libraries': {
    description: 'Learn modern front-end frameworks and libraries including React, TypeScript, and state management.',
    keywords: ['react', 'typescript', 'frontend frameworks', 'state management', 'react hooks'],
  },
  'Advanced Topics': {
    description: 'Advanced front-end engineering topics including performance optimization, system design, and architecture.',
    keywords: ['web performance', 'frontend architecture', 'system design', 'scalability'],
  },
  'Career': {
    description: 'Career development guidance for front-end engineers including interview preparation and growth strategies.',
    keywords: ['frontend career', 'software engineering career', 'tech interviews', 'career growth'],
  },
};

function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getHandbookNavigation(): HandbookNavigation {
  const fileNames = fs.readdirSync(handbookDirectory);
  
  const allPages = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(handbookDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: slug === 'index' ? '' : slug,
        title: data.title || slug,
        order: data.order ?? 999,
        category: data.category || null,
        categoryOrder: data.categoryOrder ?? 999,
      };
    });

  // Separate introduction (no category) from categorized pages
  const introduction = allPages.find(p => p.slug === '') || null;
  const categorizedPages = allPages.filter(p => p.slug !== '' && p.category);

  // Group by category
  const categoryMap = new Map<string, HandbookNavItem[]>();
  const categoryOrderMap = new Map<string, number>();

  categorizedPages.forEach(page => {
    if (page.category) {
      if (!categoryMap.has(page.category)) {
        categoryMap.set(page.category, []);
        categoryOrderMap.set(page.category, page.categoryOrder || 999);
      }
      categoryMap.get(page.category)!.push(page);
    }
  });

  // Sort items within each category
  categoryMap.forEach((items) => {
    items.sort((a, b) => a.order - b.order);
  });

  // Create sorted categories array
  const categories: HandbookCategory[] = Array.from(categoryMap.entries())
    .map(([name, items]) => ({
      name,
      slug: slugifyCategory(name),
      order: categoryOrderMap.get(name) || 999,
      items,
    }))
    .sort((a, b) => a.order - b.order);

  return { introduction, categories };
}

// Legacy function for backward compatibility
export function getAllHandbookPages(): HandbookNavItem[] {
  const { introduction, categories } = getHandbookNavigation();
  const pages: HandbookNavItem[] = [];
  
  if (introduction) {
    pages.push(introduction);
  }
  
  categories.forEach(cat => {
    pages.push(...cat.items);
  });
  
  return pages;
}

export async function getHandbookPage(slug: string): Promise<HandbookPage | null> {
  const fileName = slug === '' ? 'index.md' : `${slug}.md`;
  const fullPath = path.join(handbookDirectory, fileName);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug: slug === '' ? '' : slug,
    title: data.title || slug,
    description: data.description || '',
    keywords: data.keywords || [],
    order: data.order ?? 999,
    category: data.category || undefined,
    categoryOrder: data.categoryOrder ?? undefined,
    content,
    contentHtml,
  };
}

export function getAllHandbookSlugs(): string[] {
  const fileNames = fs.readdirSync(handbookDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      return slug === 'index' ? '' : slug;
    });
}

// SEO: Get all categories for sitemap generation
export function getAllCategories(): { name: string; slug: string }[] {
  const { categories } = getHandbookNavigation();
  return categories.map(c => ({ name: c.name, slug: c.slug }));
}
