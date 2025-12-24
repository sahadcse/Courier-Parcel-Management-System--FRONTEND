'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels, updateParcelStatus } from '@/lib/parcelSlice';
import { Parcel } from '@/types';
import { motion } from 'framer-motion';

import ActionHeader from '@/components/agent/parcelList/ActionHeader';
import PermissionAlerts from '@/components/agent/parcelList/PermissionAlerts';
import PendingPickupsList from '@/components/agent/parcelList/PendingPickupsList';
import OngoingDeliveriesList from '@/components/agent/parcelList/OngoingDeliveriesList';
import ParcelDetailsModal from '@/components/dashboard/ParcelDetailsModal';
import InvoiceModal from '@/components/dashboard/InvoiceModal';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { RefreshCw } from 'lucide-react';

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
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span className="text-gray-500 font-medium">{t('loading_assigned_parcels')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Actions Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <ActionHeader
            pendingCount={pendingPickups.length}
            ongoingCount={ongoingDeliveries.length}
            onScanSuccess={handleScanSuccess}
          />
        </section>

        {/* Alerts Section */}
        <PermissionAlerts ongoingDeliveries={ongoingDeliveries} />

        {/* Support Grid Layout for Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Pending Pickups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                Pending Pickups
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                {pendingPickups.length}
              </span>
            </div>
            <PendingPickupsList
              parcels={pendingPickups}
              onViewDetails={setSelectedParcel}
              onViewInvoice={setInvoiceParcel}
            />
          </div>

          {/* Section 2: Ongoing Deliveries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                Ongoing Deliveries
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                {ongoingDeliveries.length}
              </span>
            </div>
            <OngoingDeliveriesList
              parcels={ongoingDeliveries}
              onViewDetails={setSelectedParcel}
            />
          </div>
        </div>
      </motion.div>

      {/* Modals are rendered here, controlled by the page's state */}
      {selectedParcel && <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />}
      {invoiceParcel && <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />}
    </>
  );
}