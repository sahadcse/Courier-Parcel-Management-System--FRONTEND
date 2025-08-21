'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';

// Component to apply theme dynamically
function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return <>{children}</>;
}

export default ClientThemeProvider;
