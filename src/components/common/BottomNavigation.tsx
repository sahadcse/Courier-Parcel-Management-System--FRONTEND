// BottomNavigation.tsx
import React from 'react';

interface Tab {
  id: string;
  label: string;
}
type AgentTab = 'active' | 'route' | 'history' | 'profile';
interface BottomNavigationProps {
  activeTab: AgentTab;
  setActiveTab: (tab: AgentTab) => void;
  tabs: Tab[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="block sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <nav className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AgentTab)}
            className={`flex-1 py-2 text-center text-xs font-medium transition-colors
              ${
                activeTab === tab.id
                  ? 'text-primary-600 border-t-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;