'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import LogoutButton from '@/components/auth/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { motion } from 'framer-motion';

/**
 * Renders the primary header for the dashboard view.
 * Refactored for a cleaner, more modern aesthetic.
 */
export default function DashboardHeader() {
  const { t } = useClientTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center sticky top-0 md:relative z-30 bg-white/50 dark:bg-black/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none px-0"
    >
      {/* Left Side: Welcome & Context */}
      <div className="w-full text-center sm:w-auto sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('dashboard_title')}
        </h1>
        {user?.customerName && (
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('welcome_message', { name: user.customerName })}
          </p>
        )}
      </div>

      {/* Right Side: Actions (Hidden on mobile if handled by Sidebar/BottomNav, but commonly kept for profile/settings) */}
      <div className="hidden sm:flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-end">
        <LanguageSwitcher />
        {/* We keep Logout here for Desktop if not in Sidebar, or as a secondary option. 
            Since Sidebar has logout, we might want to hide it here or keep it for redundancy/profile menu 
            For now, I'll keep it but style it minimally or rely on the components' own styles.
            Actually, let's keep it consistent. */}
        {/* <LogoutButton /> Optionally remove this if Sidebar covers it, but for top-right user area key functions are good. */}
      </div>
    </motion.header>
  );
}