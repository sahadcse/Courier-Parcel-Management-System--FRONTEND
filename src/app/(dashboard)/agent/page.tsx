// src/app/agent/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels } from '@/lib/parcelSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import AgentParcelList from '@/components/agent/AgentParcelList';
import AgentHistoryList from '@/components/agent/AgentHistoryList';
import UserProfile from '@/components/dashboard/UserProfile';
import RouteViewList from '@/components/agent/RouteViewList';
import { useClientTranslation } from '@/hooks/useClientTranslation';

import { AlertTriangle } from 'lucide-react';

export default function AgentDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'active';
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { parcels } = useSelector((state: RootState) => state.parcels);
  const { t } = useClientTranslation();

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return <AgentParcelList parcels={parcels} />;
      case 'history':
        return <AgentHistoryList parcels={parcels} />;
      case 'profile':
        return <UserProfile />;
      case 'route':
        return <RouteViewList />;
      default:
        return <AgentParcelList parcels={parcels} />;
    }
  };

  return (
    <AuthGuard allowedRoles={['agent']}>
      {user && !user.isActive ? (
        // Inactive agent message
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
        // Active agent content
        <div className="pb-16 sm:pb-0">{renderContent()}</div>
      )}
    </AuthGuard>
  );
}
