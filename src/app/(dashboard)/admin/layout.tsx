'use client';

import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This layout protects all child pages and ensures only admins can access them.
  return (
    <AuthGuard allowedRoles={['admin']}>
      {children}
    </AuthGuard>
  );
}