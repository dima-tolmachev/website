import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHandbookNavigation, getHandbookPage, getAllHandbookSlugs, getAllHandbookPages, categoryMeta } from '@/lib/handbook';
import { HandbookLayout } from '@/components/handbook/handbook-layout';
import { ArticleContent } from '@/components/handbook/article-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// SEO: Static generation of all pages
export async function generateStaticParams() {
  const slugs = getAllHandbookSlugs();
  return slugs
    .filter(slug => slug !== '') // Filter out index page
    .map((slug) => ({ slug }));
}

// SEO: Generate optimized metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getHandbookPage(slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  // Build title with category context for better SEO
  const categoryPart = page.category ? ` - ${page.category}` : '';
  const title = page.title;
  const fullTitle = `${title} | Front-end Engineer Handbook`;
  const description = page.description;
  const keywords = [
    ...page.keywords,
    ...(page.category && categoryMeta[page.category]?.keywords || []),
  ];
  const url = `https://dima-tolmachev.com/front-end-engineer-handbook/${slug}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Dima Tolmachev' }],
    creator: 'Dima Tolmachev',
    publisher: 'Dima Tolmachev',
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      url,
      siteName: 'Front-end Engineer Handbook',
      locale: 'en_US',
      images: [
        {
          url: '/og-handbook.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(page.category && {
        section: page.category,
      }),
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
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
      canonical: url,
    },
  };
}

// SEO: Generate JSON-LD structured data with category context
function generateJsonLd(
  page: NonNullable<Awaited<ReturnType<typeof getHandbookPage>>>,
  slug: string
) {
  const url = `https://dima-tolmachev.com/front-end-engineer-handbook/${slug}`;
  const categorySlug = page.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.title,
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    keywords: page.keywords.join(', '),
    articleSection: page.category || 'Technology',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'Book',
      name: 'Front-end Engineer Handbook',
      url: 'https://dima-tolmachev.com/front-end-engineer-handbook',
    },
    ...(page.category && categoryMeta[page.category] && {
      about: {
        '@type': 'Thing',
        name: page.category,
        description: categoryMeta[page.category].description,
      },
    }),
  };
}

// SEO: Breadcrumb JSON-LD with category
function generateBreadcrumbJsonLd(
  page: NonNullable<Awaited<ReturnType<typeof getHandbookPage>>>,
  slug: string
) {
  const breadcrumbs = [
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
  ];

  // Add category breadcrumb if present
  if (page.category) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: page.category,
      item: `https://dima-tolmachev.com/front-end-engineer-handbook#${page.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    });
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 4,
      name: page.title,
      item: `https://dima-tolmachev.com/front-end-engineer-handbook/${slug}`,
    });
  } else {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: page.title,
      item: `https://dima-tolmachev.com/front-end-engineer-handbook/${slug}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

// SEO: FAQ Schema for articles with common questions
function generateFAQJsonLd(page: NonNullable<Awaited<ReturnType<typeof getHandbookPage>>>) {
  // Only add FAQ schema for certain types of content
  if (!page.category) return null;
  
  const faqs: { question: string; answer: string }[] = [];
  
  // Generate contextual FAQs based on category
  if (page.category === 'Fundamentals') {
    faqs.push({
      question: `What are the key ${page.title.toLowerCase()} concepts every front-end developer should know?`,
      answer: page.description,
    });
  } else if (page.category === 'Frameworks & Libraries') {
    faqs.push({
      question: `How do I get started with ${page.title}?`,
      answer: page.description,
    });
  } else if (page.category === 'Career') {
    faqs.push({
      question: `How can ${page.title.toLowerCase()} help my front-end career?`,
      answer: page.description,
    });
  }
  
  if (faqs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export default async function HandbookArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const navigation = getHandbookNavigation();
  const pages = getAllHandbookPages();
  const page = await getHandbookPage(slug);

  if (!page) {
    notFound();
  }

  const articleJsonLd = generateJsonLd(page, slug);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(page, slug);
  const faqJsonLd = generateFAQJsonLd(page);

  return (
    <>
      {/* SEO: JSON-LD Structured Data */}
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
      
      <HandbookLayout navigation={navigation}>
        <ArticleContent page={page} pages={pages} />
      </HandbookLayout>
    </>
  );
}
