// src/app/(dashboard)/layout.tsx
// This is the layout file for the dashboard routes

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { DASHBOARD_TABS } from '@/config/dashboard.config';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Sidebar from '@/components/dashboard/Sidebar';
import BottomNavigation from '@/components/common/BottomNavigation';
import { SocketProvider } from '@/hooks/useRealtimeParcels';
import ClientOnly from '@/components/ClientOnly';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  const userRole = user?.role as keyof typeof DASHBOARD_TABS | undefined;
  const tabs = userRole ? DASHBOARD_TABS[userRole] : [];


  return (
    <AuthGuard allowedRoles={userRole ? [userRole] : []}>
      <div className="flex min-h-screen bg-gray-50/50 dark:bg-black/90 selection:bg-primary-500/20">
        {/* --- Background Effects --- */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50 pointer-events-none"></div>

        {/* --- Sidebar (Desktop) --- */}
        <Sidebar tabs={tabs} />

        {/* --- Main Content Area --- */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="px-4 md:px-8 pt-4 md:pt-6">
            <DashboardHeader />
          </div>

          <main className="flex-1 px-4 md:px-8 py-6 relative z-0 pb-24 md:pb-8">
            <ClientOnly>
              <SocketProvider>
                <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {children}
                </div>
              </SocketProvider>
            </ClientOnly>
          </main>
        </div>

        {/* --- Bottom Navigation (Mobile) --- */}
        {tabs.length > 0 && (
          <BottomNavigation tabs={tabs} />
        )}
      </div>
    </AuthGuard>
  );
}