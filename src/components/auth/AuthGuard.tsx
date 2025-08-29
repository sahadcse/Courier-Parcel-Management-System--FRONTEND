'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'agent' | 'customer'>;
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // This redirect logic is the same as before
    if (loading === 'succeeded' || loading === 'failed') {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role && !allowedRoles.includes(user.role)) {
        router.replace(`/${user.role}`);
      }
    }
  }, [isAuthenticated, user, loading, router, allowedRoles]);

  // Show a loading indicator while the auth state is being determined
  if (loading === 'idle' || loading === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If the user is authenticated and has the correct role, render the page content
  if (isAuthenticated && user?.role && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, render nothing while the useEffect handles the redirect
  return null;
}