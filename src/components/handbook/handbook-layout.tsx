'use client';

import { useState, useCallback, memo } from 'react';
import { Sidebar } from './sidebar';
import { MobileHeader } from './mobile-header';
import type { HandbookNavigation } from '@/lib/handbook';

interface HandbookLayoutProps {
  children: React.ReactNode;
  navigation: HandbookNavigation;
}

function HandbookLayoutComponent({ children, navigation }: HandbookLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader onMenuClick={openSidebar} />
      
      <div className="flex relative">
        <Sidebar 
          navigation={navigation} 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
        />
        
        <main className="flex-1 min-w-0 pt-16 lg:pt-0 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export const HandbookLayout = memo(HandbookLayoutComponent);
