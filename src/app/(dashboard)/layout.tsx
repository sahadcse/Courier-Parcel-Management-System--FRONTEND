'use client';

import '@/lib/axios';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { SocketProvider } from '@/hooks/useRealtimeParcels';
import ClientOnly from '@/components/ClientOnly';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <AuthGuard allowedRoles={['admin', 'agent', 'customer']}>
        <DashboardHeader />
        <main>
          {/* 2. Wrap the SocketProvider in ClientOnly */}
          <ClientOnly>
            <SocketProvider>{children}</SocketProvider>
        </ClientOnly>
      </main>
      </AuthGuard>
    </div>
  );
}
