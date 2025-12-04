'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { HandbookNavigation, HandbookCategory, HandbookNavItem } from '@/lib/handbook';

// Memoized category item to prevent unnecessary re-renders
const CategoryItem = memo(function CategoryItem({
  page,
  isActive,
  onClose,
}: {
  page: HandbookNavItem;
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={`/front-end-engineer-handbook/${page.slug}`}
      onClick={onClose}
      className={`
        block pl-6 pr-3 py-2 rounded-md text-sm
        transition-colors
        ${isActive 
          ? 'bg-slate-50 text-slate-900 font-medium border-l-2 border-slate-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      {page.title}
    </Link>
  );
});

// Memoized category section
const CategorySection = memo(function CategorySection({
  category,
  isExpanded,
  hasActiveItem,
  currentSlug,
  onToggle,
  onClose,
}: {
  category: HandbookCategory;
  isExpanded: boolean;
  hasActiveItem: boolean;
  currentSlug: string;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between px-3 py-2 rounded-md
          text-xs font-semibold uppercase tracking-wider
          transition-colors
          ${hasActiveItem ? 'text-slate-900' : 'text-gray-500 hover:text-gray-700'}
        `}
        aria-expanded={isExpanded}
        aria-controls={`category-${category.slug}`}
      >
        <span>{category.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div
          id={`category-${category.slug}`}
          className="space-y-0.5"
        >
          {category.items.map((page) => (
            <CategoryItem
              key={page.slug}
              page={page}
              isActive={currentSlug === page.slug}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
});

interface SidebarProps {
  navigation: HandbookNavigation;
  isOpen: boolean;
  onClose: () => void;
}

function SidebarComponent({ navigation, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Memoize current slug calculation
  const currentSlug = useMemo(() => {
    const path = pathname.replace('/front-end-engineer-handbook', '');
    return path === '' || path === '/' ? '' : path.slice(1);
  }, [pathname]);

  // Start with empty set to match server, then expand on mount
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Expand active category after mount
  useEffect(() => {
    setMounted(true);
    const activeCategory = navigation.categories.find(category =>
      category.items.some(item => item.slug === currentSlug)
    );
    if (activeCategory) {
      setExpandedCategories(new Set([activeCategory.slug]));
    }
  }, []); // Only run on mount

  // Update expanded categories when navigating to new page
  useEffect(() => {
    if (!mounted) return;
    
    const activeCategory = navigation.categories.find(category =>
      category.items.some(item => item.slug === currentSlug)
    );
    
    if (activeCategory && !expandedCategories.has(activeCategory.slug)) {
      setExpandedCategories(prev => new Set(prev).add(activeCategory.slug));
    }
  }, [currentSlug, mounted, navigation.categories, expandedCategories]);

  // Memoized toggle handler
  const toggleCategory = useCallback((categorySlug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categorySlug)) {
        next.delete(categorySlug);
      } else {
        next.add(categorySlug);
      }
      return next;
    });
  }, []);

  // Memoized close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Pre-compute active states
  const categoryActiveStates = useMemo(() => {
    const states = new Map<string, boolean>();
    navigation.categories.forEach(category => {
      states.set(category.slug, category.items.some(item => item.slug === currentSlug));
    });
    return states;
  }, [navigation.categories, currentSlug]);

  return (
    <>
      {/* Mobile overlay - always rendered, visibility controlled by CSS */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-40 lg:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-screen lg:h-[calc(100vh-0px)]
          w-72 lg:w-64
          bg-white lg:bg-transparent
          transition-transform duration-300 ease-out
          will-change-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
          border-r border-gray-200
        `}
      >
        <div className="p-6">
          {/* Logo/Home link */}
          <Link 
            href="/front-end-engineer-handbook"
            className="flex items-center gap-3 mb-6 group"
            onClick={handleClose}
          >
            <Image
              src="/images/profile.webp"
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-gray-900 font-semibold text-sm tracking-tight group-hover:text-slate-600 transition-colors">
              Dima&apos;s FE Handbook
            </span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-4">
            {/* Introduction link */}
            {navigation.introduction && (
              <div className="pb-2 border-b border-gray-100">
                <Link
                  href="/front-end-engineer-handbook"
                  onClick={handleClose}
                  className={`
                    block px-3 py-2 rounded-md text-sm font-medium
                    transition-colors
                    ${currentSlug === '' 
                      ? 'bg-slate-50 text-slate-900 border-l-2 border-slate-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  Introduction
                </Link>
              </div>
            )}

            {/* Categories */}
            {navigation.categories.map((category) => (
              <CategorySection
                key={category.slug}
                category={category}
                isExpanded={expandedCategories.has(category.slug)}
                hasActiveItem={categoryActiveStates.get(category.slug) || false}
                currentSlug={currentSlug}
                onToggle={() => toggleCategory(category.slug)}
                onClose={handleClose}
              />
            ))}
          </nav>

          {/* Back to home */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to main site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

// Export memoized sidebar
export const Sidebar = memo(SidebarComponent);
