// components/auth/AuthGuard.tsx

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/lib/store';
import { verifyAuth } from '@/lib/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'agent' | 'customer'>;
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(verifyAuth());
    }
    // This effect is the single source of truth for redirection.
    // It runs whenever the authentication state changes.
    if (loading === 'succeeded' || loading === 'failed') {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role && !allowedRoles.includes(user.role)) {
        // If the user is logged in but has the wrong role, send them to their own dashboard.
        router.replace(`/${user.role}`);
      }
    }
  }, [dispatch,isAuthenticated, user, loading, router, allowedRoles]);

  // If the check is complete AND the user is authenticated and has the correct role, render the page content.
  if (loading === 'succeeded' && isAuthenticated && user?.role && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // In all other cases (idle, pending, failed, or wrong role), show a loading indicator.
  // This prevents the screen from flickering to blank while the useEffect handles the redirect.
  return (
    <div className="flex justify-center items-center pt-20">
      <p className="text-lg font-semibold text-white animate-pulse bg-black rounded px-6 py-4 shadow-md">
        Route Not Found....
      </p>
    </div>
  );
}
