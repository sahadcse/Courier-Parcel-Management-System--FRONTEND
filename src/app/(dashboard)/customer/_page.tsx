// src/app/(dashboard)/customer/page.tsx
'use client';

import { useState } from 'react';
import BookingForm from '@/components/dashboard/BookingForm';
import ParcelHistory from '@/components/dashboard/ParcelHistory';
import TrackParcel from '@/components/dashboard/TrackParcel';
import AuthGuard from '@/components/auth/AuthGuard';
import UserProfile from '@/components/dashboard/UserProfile';
// import 'leaflet/dist/leaflet.css';

type Tab = 'history' | 'book' | 'track' | 'profile';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  // This function will be called by the ParcelHistory component
  const handleTrackRequest = (parcelId: string) => {
    setSelectedParcelId(parcelId); // Set the ID to be passed to the tracking component
    setActiveTab('track'); // Switch to the tracking tab
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <ParcelHistory onTrackClick={handleTrackRequest} />;
      case 'book':
        return <BookingForm />;
      case 'track':
        return <TrackParcel initialParcelId={selectedParcelId} />;
      case 'profile':
        return <UserProfile />;
      default:
        return <ParcelHistory onTrackClick={handleTrackRequest} />;
    }
  };

  return (
    <AuthGuard allowedRoles={['customer']}>
      {/* The container and header are now in the layout.tsx */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-primary-500' : ''}`}
        >
          Booking History
        </button>
        <button
          onClick={() => setActiveTab('book')}
          className={`py-2 px-4 ${activeTab === 'book' ? 'border-b-2 border-primary-500' : ''}`}
        >
          Book Parcel
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`py-2 px-4 ${activeTab === 'track' ? 'border-b-2 border-primary-500' : ''}`}
        >
          Track Parcel
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-primary-500' : ''}`}
        >
          User Profile
        </button>
      </div>
      <div>{renderContent()}</div>
    </AuthGuard>
  );
}
