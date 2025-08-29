'use client';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SocketProvider } from '@/hooks/useRealtimeParcels';
import ClientOnly from '@/components/ClientOnly'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <DashboardHeader />
      <main>
        {/* 2. Wrap the SocketProvider in ClientOnly */}
        <ClientOnly>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ClientOnly>
      </main>
    </div>
  );
}