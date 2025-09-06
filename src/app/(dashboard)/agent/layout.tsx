'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AuthGuard from '@/components/auth/AuthGuard';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { AlertTriangle } from 'lucide-react';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useClientTranslation();

  return (
    <AuthGuard allowedRoles={['agent']}>
      {user && !user.isActive ? (
        // Inactive agent message - This now protects all agent routes
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-lg border border-yellow-300 bg-yellow-50 p-8 text-center dark:border-yellow-700 dark:bg-gray-800">
          <div className="text-yellow-500 mb-4">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
            {t('agent_inactive_title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('agent_inactive_message')}</p>
        </div>
      ) : (
        // If agent is active, render the specific page (e.g., active, history, etc.)
        <div className="pb-16 sm:pb-0">{children}</div>
      )}
    </AuthGuard>
  );
}