import type { Metadata } from 'next';

// SEO: Base metadata for handbook section
export const metadata: Metadata = {
  metadataBase: new URL('https://dima-tolmachev.com'),
  title: {
    template: '%s | Front-end Engineer Handbook',
    default: 'Front-end Engineer Handbook | Dima Tolmachev',
  },
  description: 'A comprehensive guide to becoming a world-class front-end engineer. Master JavaScript, React, TypeScript, performance optimization, and system design.',
  keywords: [
    'front-end development',
    'web development', 
    'javascript',
    'react',
    'typescript',
    'frontend engineer',
    'web engineer handbook',
    'coding tutorials',
    'software engineering',
  ],
  authors: [{ name: 'Dima Tolmachev', url: 'https://dima-tolmachev.com' }],
  creator: 'Dima Tolmachev',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Front-end Engineer Handbook',
    images: [
      {
        url: '/og/open-graph.jpg',
        width: 1200,
        height: 630,
        alt: 'Dima Tolmachev - Front-end Engineer Handbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@dimatolmachev',
    images: ['/og/open-graph.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default function HandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

