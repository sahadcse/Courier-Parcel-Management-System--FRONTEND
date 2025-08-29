// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import CreateAdminForm from '@/components/admin/CreateAdminForm';
import UserManagementTab from '@/components/admin/UserManagementTab';
import ParcelManagementTab from '@/components/admin/ParcelManagementTab';
import AuthGuard from '@/components/auth/AuthGuard';
import LiveMonitorDashboard from '@/components/admin/LiveMonitorDashboard';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import UserProfile from '@/components/dashboard/UserProfile';

type Tab = 'reports' | 'parcels' | 'register_admin' | 'users' | 'live_monitor' | 'profile';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('reports');

  const renderContent = () => {
    switch (activeTab) {
      case 'parcels': return <ParcelManagementTab />;
      case 'register_admin': return (<div><CreateAdminForm /></div>);
      case 'users': return (<div><UserManagementTab /></div>);
      case 'live_monitor': return (<div><LiveMonitorDashboard /></div>);
      case 'reports': return (<div><AdminAnalyticsDashboard /></div>);
      case 'profile': return (<div><UserProfile /></div>);
      default: return null;
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="flex border-b mb-6">
        <button onClick={() => setActiveTab('reports')} className={`py-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-primary-500' : ''}`}>Reports</button>
        <button onClick={() => setActiveTab('parcels')} className={`py-2 px-4 ${activeTab === 'parcels' ? 'border-b-2 border-primary-500' : ''}`}>Parcels</button>
        <button onClick={() => setActiveTab('register_admin')} className={`py-2 px-4 ${activeTab === 'register_admin' ? 'border-b-2 border-primary-500' : ''}`}>Register Admin</button>
        <button onClick={() => setActiveTab('users')} className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-primary-500' : ''}`}>User Management</button>
        <button onClick={() => setActiveTab('live_monitor')} className={`py-2 px-4 ${activeTab === 'live_monitor' ? 'border-b-2 border-primary-500' : ''}`}>Live Monitor</button>
        <button onClick={() => setActiveTab('profile')} className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-primary-500' : ''}`}>Profile</button>
      </div>
      <div>{renderContent()}</div>
    </AuthGuard>
  );
}
