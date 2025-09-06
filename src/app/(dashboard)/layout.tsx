// src/app/(dashboard)/layout.tsx
// This is the layout file for the dashboard routes

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Changed from useRouter and useSearchParams
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { DASHBOARD_TABS } from '@/config/dashboard.config';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BottomNavigation from '@/components/common/BottomNavigation';
import { SocketProvider } from '@/hooks/useRealtimeParcels';
import ClientOnly from '@/components/ClientOnly';
import AuthGuard from '@/components/auth/AuthGuard';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // <-- Get the current URL path
  const { user } = useSelector((state: RootState) => state.auth);

  const userRole = user?.role as keyof typeof DASHBOARD_TABS | undefined;
  const tabs = userRole ? DASHBOARD_TABS[userRole] : [];
  

  return (
    <AuthGuard allowedRoles={userRole ? [userRole] : []}>
    <div className="container mx-auto max-w-7xl p-4 md:p-8 dark:text-white dark:bg-black min-h-screen">
      <DashboardHeader />

      {tabs.length > 0 && (
        <div className="pb-16 sm:pb-0">
          {/* Top navigation for larger screens */}
          <nav className="hidden sm:flex border-b mb-6">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`py-2 px-4 font-medium transition-colors text-sm
                  ${
                    pathname === tab.href
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <main>
            <ClientOnly>
              <SocketProvider>{children}</SocketProvider>
            </ClientOnly>
          </main>

          {/* Bottom navigation for smaller screens - It needs to be adapted to use Link or a router push */}
          <BottomNavigation tabs={tabs} />
        </div>
      )}
    </div>
    </AuthGuard>
  );
}