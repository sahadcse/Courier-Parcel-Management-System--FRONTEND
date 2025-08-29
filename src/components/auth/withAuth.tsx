// src/components/auth/withAuth.tsx
'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Array<'admin' | 'agent' | 'customer'>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      // This effect handles all redirection logic
      if (loading === 'succeeded' || loading === 'failed') {
        if (!isAuthenticated) {
          router.replace('/login');
        } else if (user?.role && !allowedRoles.includes(user.role)) {
          router.replace(`/${user.role}`);
        }
      }
    }, [isAuthenticated, user, loading, router]);

    // If the user is fully authenticated and authorized, show the page.
    if (isAuthenticated && user?.role && allowedRoles.includes(user.role)) {
      return <WrappedComponent {...props} />;
    }

    // **THE FIX**: Show a loading screen whenever the auth state is being determined.
    if (loading === 'idle' || loading === 'pending') {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    

    // Fallback while redirecting
    return null;
  };

  return AuthComponent;
};

export default withAuth;