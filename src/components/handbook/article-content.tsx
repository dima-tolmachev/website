import type { HandbookPage, HandbookNavItem } from '@/lib/handbook';
import Link from 'next/link';

interface ArticleContentProps {
  page: HandbookPage;
  pages: HandbookNavItem[];
}

export function ArticleContent({ page, pages }: ArticleContentProps) {
  // Find prev/next pages
  const currentIndex = pages.findIndex(p => p.slug === page.slug);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <article className="prose-handbook">
      {/* SEO: Breadcrumb navigation */}
      {page.category && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/front-end-engineer-handbook" className="hover:text-gray-700 transition-colors">
                Handbook
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-700 font-medium">
              {page.category}
            </li>
          </ol>
        </nav>
      )}

      {/* Article content */}
      <div 
        className="handbook-content"
        dangerouslySetInnerHTML={{ __html: page.contentHtml || '' }} 
      />
      
      {/* Navigation footer */}
      <nav className="mt-16 pt-8 border-t border-gray-200" aria-label="Article navigation">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {prevPage ? (
            <Link
              href={prevPage.slug === '' ? '/front-end-engineer-handbook' : `/front-end-engineer-handbook/${prevPage.slug}`}
              className="group flex-1 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-slate-400 transition-all duration-300"
            >
              <span className="text-xs text-gray-500 uppercase tracking-wide">Previous</span>
              <span className="block mt-1 text-gray-900 font-medium group-hover:text-slate-700 transition-colors">
                ← {prevPage.title}
              </span>
            </Link>
          ) : <div className="flex-1" />}
          
          {nextPage && (
            <Link
              href={nextPage.slug === '' ? '/front-end-engineer-handbook' : `/front-end-engineer-handbook/${nextPage.slug}`}
              className="group flex-1 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-slate-400 transition-all duration-300 text-right"
            >
              <span className="text-xs text-gray-500 uppercase tracking-wide">Next</span>
              <span className="block mt-1 text-gray-900 font-medium group-hover:text-slate-700 transition-colors">
                {nextPage.title} →
              </span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
