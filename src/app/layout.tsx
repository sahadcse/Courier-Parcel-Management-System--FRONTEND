// src/app/layout.tsx
import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import ReduxProvider from '@/components/ReduxProvider';
import I18nProvider from '@/components/I18nProvider';
import { ToastContainer } from '@/components/common/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ProCourier',
    default: 'ProCourier - Global Logistics & Delivery Services',
  },
  description: 'Experience world-class courier services with real-time tracking, secure delivery, and global reach. Fast, reliable, and efficient.',
  keywords: ['courier', 'delivery', 'logistics', 'tracking', 'shipping', 'parcel'],
};

export const viewport: Viewport = {
  themeColor: '#3b82f6', // Primary color
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-primary-500 selection:text-white">
        <I18nProvider>
          <ReduxProvider>
            <ClientThemeProvider>
              {children}
              <ToastContainer />
            </ClientThemeProvider>
          </ReduxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
