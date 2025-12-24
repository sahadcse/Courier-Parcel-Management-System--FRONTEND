// BottomNavigation.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface BottomNavigationProps {
  tabs: Tab[];
}

const MAX_VISIBLE_TABS = 4;

export default function BottomNavigation({ tabs }: BottomNavigationProps) {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const shouldCollapse = tabs.length > MAX_VISIBLE_TABS;
  const visibleTabs = shouldCollapse ? tabs.slice(0, MAX_VISIBLE_TABS - 1) : tabs;
  const hiddenTabs = shouldCollapse ? tabs.slice(MAX_VISIBLE_TABS - 1) : [];

  const isMoreTabActive = hiddenTabs.some(tab => pathname === tab.href);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md">

        {/* --- More Menu Popup --- */}
        <AnimatePresence>
          {isMoreMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMoreMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-20 right-4 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
              >
                {hiddenTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors
                      ${pathname === tab.href
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- Main Bar --- */}
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="flex items-center justify-around h-16 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg rounded-full px-2"
        >
          {visibleTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-1 flex-col items-center justify-center h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-2 w-8 h-1 bg-primary-500 rounded-full"
                  />
                )}
                <div className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {tab.icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </div>
              </Link>
            );
          })}

          {shouldCollapse && (
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="relative flex flex-1 flex-col items-center justify-center h-full"
            >
              {(isMoreTabActive || isMoreMenuOpen) && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-2 w-8 h-1 bg-primary-500 rounded-full"
                />
              )}
              <div className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isMoreTabActive || isMoreMenuOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <MoreHorizontal size={20} />
                <span className="text-[10px] font-medium">More</span>
              </div>
            </button>
          )}
        </motion.nav>
      </div>
    </div>
  );
}