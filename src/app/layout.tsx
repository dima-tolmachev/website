import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Determine analytics mode based on environment
const getAnalyticsMode = (): 'production' | 'development' => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  return 'development';
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dima-tolmachev.com'),
  title: "Dima Tolmachev - Software Engineer",
  description: "Personal website and portfolio",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dima Tolmachev',
    title: 'Dima Tolmachev - Software Engineer',
    description: 'Personal website and portfolio',
    images: [
      {
        url: '/og/open-graph.jpg',
        width: 1200,
        height: 630,
        alt: 'Dima Tolmachev - Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dima Tolmachev - Software Engineer',
    description: 'Personal website and portfolio',
    images: ['/og/open-graph.jpg'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics mode={getAnalyticsMode()} />
        <SpeedInsights />
      </body>
    </html>
  );
}
