'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

function MobileHeaderComponent({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link 
          href="/front-end-engineer-handbook"
          className="flex items-center gap-2"
        >
          <Image
            src="/images/profile.webp"
            alt="Profile"
            width={28}
            height={28}
            className="w-7 h-7 rounded-lg object-cover"
          />
          <span className="text-gray-900 font-semibold text-sm">Dima&apos;s FE Handbook</span>
        </Link>
        
        <div className="w-10" />
      </div>
    </header>
  );
}

export const MobileHeader = memo(MobileHeaderComponent);
