// BottomNavigation.tsx
'use client'; // <-- This component now uses hooks, so it must be a client component

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Import usePathname hook
import { MoreHorizontal } from 'lucide-react';

// The Tab interface is updated to match our new config, including 'href'
export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string; // <-- Path for navigation
}

interface BottomNavigationProps {
  tabs: Tab[];
}

// You can adjust this number to control how many tabs are visible before collapsing
const MAX_VISIBLE_TABS = 4;

export default function BottomNavigation({ tabs }: BottomNavigationProps) {
  const pathname = usePathname(); // <-- Get the current URL path
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const shouldCollapse = tabs.length > MAX_VISIBLE_TABS;

  const visibleTabs = shouldCollapse ? tabs.slice(0, MAX_VISIBLE_TABS - 1) : tabs;
  const hiddenTabs = shouldCollapse ? tabs.slice(MAX_VISIBLE_TABS - 1) : [];

  // The "More" tab is active if the current URL matches one of the hidden tabs
  const isMoreTabActive = hiddenTabs.some(tab => pathname === tab.href);

  // Close the "More" menu when navigating
  const handleMenuLinkClick = () => {
    setIsMoreMenuOpen(false);
  };

  return (
    <section className="z-50">
      {/* --- Overlay Menu for "More" Tab --- */}
      {isMoreMenuOpen && (
        <div 
          onClick={() => setIsMoreMenuOpen(false)}
          className="fixed inset-0 z-40 block sm:hidden"
        >
          <div className="absolute bottom-16 right-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 p-2">
            {hiddenTabs.map((tab) => (
              // <-- Changed from <button> to <Link>
              <Link
                key={tab.id}
                href={tab.href}
                onClick={handleMenuLinkClick} // <-- Close menu on click
                className={`w-full flex items-center gap-3 p-2 text-left rounded-md text-sm font-medium
                  ${pathname === tab.href // <-- Check active state with pathname
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* --- Main Navigation Bar --- */}
      <div className="block sm:hidden fixed bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex h-16 justify-around">
          {/* Render the visible tabs */}
          {visibleTabs.map((tab) => (
            // <-- Changed from <button> to <Link>
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 pt-2 text-xs font-medium transition-colors duration-200 focus:outline-none
                ${pathname === tab.href // <-- Check active state with pathname
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          ))}
          
          {/* The "More" button remains a button as it only toggles UI state */}
          {shouldCollapse && (
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 pt-2 text-xs font-medium transition-colors duration-200 focus:outline-none
                ${isMoreTabActive || isMoreMenuOpen 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <MoreHorizontal size={20} />
              <span>More</span>
            </button>
          )}
        </nav>
      </div>
    </section>
  );
}