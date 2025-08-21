// components/ReduxProvider.tsx
'use client'; // This directive makes this a Client Component

import { Provider } from 'react-redux';
import { store } from '@/lib/store'; // Assuming your Redux store is correctly exported from here

/**
 * ReduxProvider is a Client Component that wraps the Redux store Provider.
 * This ensures that all Redux-related logic runs exclusively on the client-side,
 * preventing conflicts with React Server Components.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
