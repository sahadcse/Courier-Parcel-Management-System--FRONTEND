// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import ReduxProvider from '@/components/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Courier & Parcel Management System',
  description: 'Track and manage parcels with real-time updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ReduxProvider creates the client-side boundary for Redux store */}
        <ReduxProvider>
          {/* ClientThemeProvider needs to be within the ReduxProvider to access the store state */}
          <ClientThemeProvider>
            {children} {/* Your page content will be rendered here */}
          </ClientThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
