// src/app/admin/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';

// Import all possible components for this dashboard
import CreateAdminForm from '@/components/admin/CreateAdminForm';
import UserManagementTab from '@/components/admin/UserManagementTab';
import ParcelManagementTab from '@/components/admin/ParcelManagementTab';
import LiveMonitorDashboard from '@/components/admin/LiveMonitorDashboard';
import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';
import UserProfile from '@/components/dashboard/UserProfile';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  // Get the active tab from the URL, defaulting to 'reports'
  const activeTab = searchParams.get('tab') || 'reports';

  // The page's only job is to render the correct content component
  const renderContent = () => {
    switch (activeTab) {
      case 'parcels': return <ParcelManagementTab />;
      case 'register_admin': return <CreateAdminForm />;
      case 'users': return <UserManagementTab />;
      case 'live_monitor': return <LiveMonitorDashboard />;
      case 'reports': return <AdminAnalyticsDashboard />;
      case 'profile': return <UserProfile />;
      default: return <AdminAnalyticsDashboard />; // Fallback content
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      {renderContent()}
    </AuthGuard>
  );
}