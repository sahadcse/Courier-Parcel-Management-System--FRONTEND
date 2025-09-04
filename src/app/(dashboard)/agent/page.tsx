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
import RouteViewList from '@/components/agent/RouteViewList';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import BottomNavigation from '@/components/common/BottomNavigation';

type AgentTab = 'active' | 'route' | 'history' | 'profile';

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<AgentTab>('active');
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { parcels } = useSelector((state: RootState) => state.parcels);
  const { t } = useClientTranslation();

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  return (
    <AuthGuard allowedRoles={['agent']}>
      {user && !user.isActive ? (
        <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-yellow-50 dark:bg-gray-800 border-yellow-300 dark:border-yellow-700 max-w-lg mx-auto">
          <div className="text-yellow-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
            {t('agent_inactive_title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('agent_inactive_message')}</p>
        </div>
      ) : (
        <div className="pb-16 sm:pb-0">
          {' '}
          <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('active')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              activeTab === 'active'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              >
                {t('agent_menu_1')}
              </button>
              <button
                onClick={() => setActiveTab('route')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              activeTab === 'route'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              >
                {t('route_view')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              >
                {t('delivery_history')}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
              >
                {t('profile')}
              </button>
            </nav>
          </div>
          {/* --- Bottom Navigation Bar (visible on small screens) --- */}
          <BottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={[
              { id: 'active', label: t('agent_menu_1') },
              { id: 'route', label: t('route_view') },
              { id: 'history', label: t('delivery_history') },
              { id: 'profile', label: t('profile') },
            ]}
          />
          <div className="mt-6">
            {activeTab === 'active' && (
              <AgentParcelList parcels={parcels} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'history' && <AgentHistoryList parcels={parcels} />}
            {activeTab === 'profile' && <UserProfile />}
            {activeTab === 'route' && <RouteViewList />}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
