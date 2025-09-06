'use client';

import AuthGuard from '@/components/auth/AuthGuard';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  // This layout protects all child pages, ensuring only customers can access them.
  return (
    <AuthGuard allowedRoles={['customer']}>
      {children}
    </AuthGuard>
  );
}