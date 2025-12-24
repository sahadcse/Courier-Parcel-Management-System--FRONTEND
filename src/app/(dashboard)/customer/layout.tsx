'use client';

import AuthGuard from '@/components/auth/AuthGuard';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  // This layout protects all child pages, ensuring only customers can access them.
  return (
    <AuthGuard allowedRoles={['customer']}>
      <div className="min-h-[calc(100vh-64px)] p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {children}
      </div>
    </AuthGuard>
  );
}