// BottomNavigation.tsx
import React from 'react';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react'; // Icon for the 'More' button

export interface Tab<T extends string> {
  id: T;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavigationProps<T extends string> {
  activeTab: T;
  setActiveTab: (tab: T) => void;
  tabs: Tab<T>[];
}

// You can adjust this number to control how many tabs are visible before collapsing
const MAX_VISIBLE_TABS = 4;

export default function BottomNavigation<T extends string>({
  activeTab,
  setActiveTab,
  tabs,
}: BottomNavigationProps<T>) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const shouldCollapse = tabs.length > MAX_VISIBLE_TABS;

  const visibleTabs = shouldCollapse ? tabs.slice(0, MAX_VISIBLE_TABS - 1) : tabs;
  const hiddenTabs = shouldCollapse ? tabs.slice(MAX_VISIBLE_TABS - 1) : [];

  // The "More" tab is active if the currently active tab is one of the hidden ones
  const isMoreTabActive = hiddenTabs.some(tab => tab.id === activeTab);

  const handleHiddenTabClick = (tabId: T) => {
    setActiveTab(tabId);
    setIsMoreMenuOpen(false);
  };

  return (
    <section className="z-50">
      {/* --- Overlay Menu for "More" Tab --- */}
      {isMoreMenuOpen && (
        // Backdrop to close the menu when clicked
        <div 
          onClick={() => setIsMoreMenuOpen(false)}
          className="fixed inset-0 z-40 block sm:hidden"
        >
          <div className="absolute bottom-16 right-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 p-2">
            {hiddenTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleHiddenTabClick(tab.id)}
                className={`w-full flex items-center gap-3 p-2 text-left rounded-md text-sm font-medium
                  ${activeTab === tab.id 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- Main Navigation Bar --- */}
      <div className="block sm:hidden fixed bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex h-16 justify-around">
          {/* Render the visible tabs */}
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 pt-2 text-xs font-medium transition-colors duration-200 focus:outline-none
                ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          
          {/* Render the "More" tab if needed */}
          {shouldCollapse && (
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 pt-2 text-xs font-medium transition-colors duration-200 focus:outline-none
                ${isMoreTabActive || isMoreMenuOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
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