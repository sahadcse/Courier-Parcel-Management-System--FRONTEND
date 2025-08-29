// src/app/agent/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels } from '@/lib/parcelSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import AgentParcelList from '@/components/agent/AgentParcelList';
import AgentHistoryList from '@/components/agent/AgentHistoryList';
import UserProfile from '@/components/dashboard/UserProfile';
import RouteViewList from '@/components/agent/RouteViewList'; // The correct component for the route tab
import { useClientTranslation } from '@/hooks/useClientTranslation';

type AgentTab = 'active' | 'route' | 'history' | 'profile';

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<AgentTab>('active');
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { parcels } = useSelector((state: RootState) => state.parcels);
  const { t } = useClientTranslation();

  // Fetch data once in the parent component
  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  return (
    <AuthGuard allowedRoles={['agent']}>
      {user && !user.isActive ? (
        <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-yellow-50 dark:bg-gray-800 border-yellow-300 dark:border-yellow-700">
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
            {t('agent_inactive_title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('agent_inactive_message')}</p>
        </div>
      ) : (
        <div>
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-4 ${activeTab === 'active' ? 'border-b-2 border-primary-500' : ''}`}
            >
              {t('agent_menu_1')}
            </button>
            <button
              onClick={() => setActiveTab('route')}
              className={`py-2 px-4 ${activeTab === 'route' ? 'border-b-2 border-primary-500' : ''}`}
            >
              {t('route_view')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-primary-500' : ''}`}
            >
              {t('delivery_history')}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-primary-500' : ''}`}
            >
              {t('profile')}
            </button>
          </div>

          {/* Use 'as any' to resolve the minor type mismatch for the prop */}
          {activeTab === 'active' && (
            <AgentParcelList parcels={parcels} setActiveTab={setActiveTab} />
          )}
          {activeTab === 'history' && <AgentHistoryList parcels={parcels} />}
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'route' && <RouteViewList />}
        </div>
      )}
    </AuthGuard>
  );
}
