'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import LogoutButton from '@/components/auth/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher'; // Import the new component

/**
 * Renders the primary header for the dashboard view.
 * It's responsive and adjusts its layout for different screen sizes.
 */
export default function DashboardHeader() {
  const { t } = useClientTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-center">
      {/* Left Side: Title and Welcome Message */}
      <div className="w-full text-center sm:w-auto sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('dashboard_title')}
        </h1>
        {user?.customerName && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('welcome_message', { name: user.customerName })}
          </p>
        )}
      </div>

      {/* Right Side: Actions */}
      <div className="flex w-full items-center justify-center gap-4 sm:w-auto sm:justify-end">
        <LanguageSwitcher />
        <LogoutButton />
      </div>
    </header>
  );
}