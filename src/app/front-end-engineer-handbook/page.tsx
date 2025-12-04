import { Metadata } from 'next';
import { getHandbookNavigation, getHandbookPage, getAllHandbookPages, categoryMeta } from '@/lib/handbook';
import { HandbookLayout } from '@/components/handbook/handbook-layout';
import { ArticleContent } from '@/components/handbook/article-content';

// SEO: Generate optimized metadata
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHandbookPage('');
  
  if (!page) {
    return {
      title: 'Front-end Engineer Handbook',
    };
  }

  const title = `${page.title} | Dima Tolmachev`;
  const description = page.description;
  const keywords = page.keywords;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Dima Tolmachev' }],
    creator: 'Dima Tolmachev',
    publisher: 'Dima Tolmachev',
    
    // Open Graph
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://dima-tolmachev.com/front-end-engineer-handbook',
      siteName: 'Dima Tolmachev',
      locale: 'en_US',
      images: [
        {
          url: '/og-handbook.png',
          width: 1200,
          height: 630,
          alt: 'Front-end Engineer Handbook',
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@dimatolmachev',
      images: ['/og-handbook.png'],
    },
    
    // Robots
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
    
    // Alternates
    alternates: {
      canonical: 'https://dima-tolmachev.com/front-end-engineer-handbook',
    },
  };
}

// SEO: Generate JSON-LD structured data for the handbook
function generateJsonLd(page: NonNullable<Awaited<ReturnType<typeof getHandbookPage>>>) {
  const categories = Object.keys(categoryMeta);
  
  return [
    // Book structured data
    {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: page.title,
      description: page.description,
      author: {
        '@type': 'Person',
        name: 'Dima Tolmachev',
        url: 'https://dima-tolmachev.com',
      },
      publisher: {
        '@type': 'Person',
        name: 'Dima Tolmachev',
      },
      url: 'https://dima-tolmachev.com/front-end-engineer-handbook',
      inLanguage: 'en-US',
      genre: 'Technology',
      about: {
        '@type': 'Thing',
        name: 'Front-end Development',
      },
    },
    // WebPage structured data
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: 'https://dima-tolmachev.com/front-end-engineer-handbook',
      mainEntity: {
        '@type': 'Book',
        name: page.title,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://dima-tolmachev.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Front-end Engineer Handbook',
            item: 'https://dima-tolmachev.com/front-end-engineer-handbook',
          },
        ],
      },
    },
    // ItemList for categories (SEO for discoverability)
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Handbook Categories',
      description: 'Categories in the Front-end Engineer Handbook',
      itemListElement: categories.map((cat, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cat,
        description: categoryMeta[cat]?.description || '',
      })),
    },
  ];
}

export default async function HandbookPage() {
  const navigation = getHandbookNavigation();
  const pages = getAllHandbookPages();
  const page = await getHandbookPage('');

  if (!page) {
    return <div>Page not found</div>;
  }

  const jsonLdItems = generateJsonLd(page);

  return (
    <>
      {/* SEO: JSON-LD Structured Data */}
      {jsonLdItems.map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      
      <HandbookLayout navigation={navigation}>
        <ArticleContent page={page} pages={pages} />
      </HandbookLayout>
    </>
  );
}
