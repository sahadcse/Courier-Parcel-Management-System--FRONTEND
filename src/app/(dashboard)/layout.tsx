// src/app/(dashboard)/layout.tsx

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { DASHBOARD_TABS } from '@/config/dashboard.config'; // Import the new config

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BottomNavigation from '@/components/common/BottomNavigation';
import { SocketProvider } from '@/hooks/useRealtimeParcels';
import ClientOnly from '@/components/ClientOnly';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  // Determine the active tab from the URL, or use the first tab as a default
  const activeTab = searchParams.get('tab');
  const userRole = user?.role as keyof typeof DASHBOARD_TABS | undefined;
  const tabs = userRole ? DASHBOARD_TABS[userRole] : [];
  const currentActiveTab =
    activeTab && tabs.some(t => t.id === activeTab) ? activeTab : tabs[0]?.id;

  const setActiveTab = (tabId: string) => {
    router.push(`?tab=${tabId}`);
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8 dark:text-white dark:bg-black min-h-screen">
      <DashboardHeader />

      {/* --- Navigation is now centralized here in the layout --- */}
      {tabs.length > 0 && (
        <div className="pb-16 sm:pb-0">
          {/* Top navigation for larger screens */}
          <nav className="hidden sm:flex border-b mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 font-medium transition-colors text-sm
                  ${
                    currentActiveTab === tab.id
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Main page content is passed through */}
          <main>
            <ClientOnly>
              <SocketProvider>{children}</SocketProvider>
            </ClientOnly>
          </main>

          {/* Bottom navigation for smaller screens */}
          <BottomNavigation
            tabs={tabs} // Using `any` here to satisfy the generic component
            activeTab={currentActiveTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
    </div>
  );
}
