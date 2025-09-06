'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels, updateParcelStatus } from '@/lib/parcelSlice';
import { Parcel } from '@/types';

import ActionHeader from '@/components/agent/parcelList/ActionHeader';
import PermissionAlerts from '@/components/agent/parcelList/PermissionAlerts';
import PendingPickupsList from '@/components/agent/parcelList/PendingPickupsList';
import OngoingDeliveriesList from '@/components/agent/parcelList/OngoingDeliveriesList';
import ParcelDetailsModal from '@/components/dashboard/ParcelDetailsModal';
import InvoiceModal from '@/components/dashboard/InvoiceModal';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function AgentActivePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useClientTranslation();
  const { parcels, loading } = useSelector((state: RootState) => state.parcels);

  // State for modals is managed by the parent page component
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  // --- Memoized Filtering and Logic ---
  const pendingPickups = useMemo(() => parcels.filter(p => p.status === 'Assigned'), [parcels]);
  const ongoingDeliveries = useMemo(() => parcels.filter(p => p.status === 'Picked Up' || p.status === 'In Transit'), [parcels]);

  // Handler for QR Scan Success
  const handleScanSuccess = (decodedText: string) => {
    const urlParts = decodedText.split('/');
    const parcelId = urlParts.pop();
    if (!parcelId) {
      alert('Invalid QR code scanned.');
      return;
    }
    
    const parcelToUpdate = [...pendingPickups, ...ongoingDeliveries].find(p => p.parcelId === parcelId);
    if (parcelToUpdate) {
      const nextStatus = parcelToUpdate.status === 'Assigned' ? 'Picked Up' : 'Delivered';
      dispatch(updateParcelStatus({ parcelId, status: nextStatus }));
      alert(`Parcel ${parcelId} status updated to ${nextStatus}!`);
    } else {
      alert('Scanned parcel not found in your assigned list.');
    }
  };
  
  if (loading === 'pending') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2">{t('loading_assigned_parcels')}</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <ActionHeader 
          pendingCount={pendingPickups.length} 
          ongoingCount={ongoingDeliveries.length}
          onScanSuccess={handleScanSuccess}
        />
        <PermissionAlerts ongoingDeliveries={ongoingDeliveries} />
        <PendingPickupsList
          parcels={pendingPickups}
          onViewDetails={setSelectedParcel}
          onViewInvoice={setInvoiceParcel}
        />
        <OngoingDeliveriesList
          parcels={ongoingDeliveries}
          onViewDetails={setSelectedParcel}
        />
      </div>

      {/* Modals are rendered here, controlled by the page's state */}
      {selectedParcel && <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />}
      {invoiceParcel && <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />}
    </>
  );
}