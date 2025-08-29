// components/ReduxProvider.tsx
'use client'; // This directive makes this a Client Component

import { Provider } from 'react-redux';
import { store } from '@/lib/store'; // Assuming your Redux store is correctly exported from here
import { verifyAuth } from '@/lib/authSlice';
import { useEffect } from 'react';

/**
 * ReduxProvider is a Client Component that wraps the Redux store Provider.
 * This ensures that all Redux-related logic runs exclusively on the client-side,
 * preventing conflicts with React Server Components.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for a valid session cookie when the app loads
    store.dispatch(verifyAuth());
  }, []);
  
  return <Provider store={store}>{children}</Provider>;
}
