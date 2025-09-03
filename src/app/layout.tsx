// src/app/layout.tsx
import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import ReduxProvider from '@/components/ReduxProvider';
import I18nProvider from '@/components/I18nProvider';
import { ToastContainer } from '@/components/common/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Courier & Parcel Management System',
  description: 'Track and manage parcels with real-time updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <I18nProvider>
        {/* ReduxProvider creates the client-side boundary for Redux store */}
        <ReduxProvider>
          {/* ClientThemeProvider needs to be within the ReduxProvider to access the store state */}
            <ClientThemeProvider>
              {children} {/* Your page content will be rendered here */}
              <ToastContainer /> {/* Toast notifications container */}
            </ClientThemeProvider>
        </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
