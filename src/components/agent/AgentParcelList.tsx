// components/agent/AgentParcelList.tsx

'use client';

import { useEffect, useState, useMemo, useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { updateParcelStatus } from '@/lib/parcelSlice';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import { Parcel } from '@/types';
import ParcelDetailsModal from '../dashboard/ParcelDetailsModal';
import InvoiceModal from '../dashboard/InvoiceModal';
import QRScanner from './QRScanner';
import { useClientTranslation } from '@/hooks/useClientTranslation';

// Define the component's props
interface AgentParcelListProps {
  parcels: Parcel[];
  setActiveTab: (tab: 'active' | 'route' | 'history' | 'profile') => void;
}

export default function AgentParcelList({ parcels, setActiveTab }: AgentParcelListProps) {
  // --- State and Redux Hooks ---
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.parcels);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  
  // State for modals
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const { t } = useClientTranslation();

  // --- Memoized Filtering ---
  // Parcels that are assigned but not yet picked up
  const pendingPickups = useMemo(() =>
    parcels.filter(p => p.status === 'Assigned'),
    [parcels]
  );

  // Parcels that are actively being delivered
  const ongoingDeliveries = useMemo(() =>
    parcels.filter(p => p.status === 'Picked Up' || p.status === 'In Transit'),
    [parcels]
  );
  
  const activeParcelForTracking = useMemo(() => ongoingDeliveries[0], [ongoingDeliveries]);
  
  const isRouteAvailable = useMemo(() =>
    ongoingDeliveries.some(p => p.deliveryCoordinates),
    [ongoingDeliveries]
  );

    // --- Determine the current scanning action ---
  const scanAction = useMemo(() => {
    if (pendingPickups.length > 0) return 'pickup';
    if (ongoingDeliveries.length > 0) return 'delivery';
    return 'idle'; // No active tasks
  }, [pendingPickups, ongoingDeliveries]);

  // --- Effects ---
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      });
    }
  }, []);

  useLocationTracker(activeParcelForTracking ? activeParcelForTracking.parcelId : null);

  // --- MODIFIED: Event Handler for successful scan ---
  const handleScanSuccess = useCallback((decodedText: string) => {
    setIsScannerOpen(false);
    
    // Extract parcelId from the URL (e.g., http://.../track/PARCEL_ID)
    const urlParts = decodedText.split('/');
    const parcelId = urlParts.pop() || urlParts.pop(); // Handles trailing slash

    if (!parcelId) {
      alert('Invalid QR code format.');
      return;
    }

    if (scanAction === 'pickup') {
      const parcelToUpdate = pendingPickups.find(p => p.parcelId === parcelId);
      if (parcelToUpdate) {
        dispatch(updateParcelStatus({ parcelId, status: 'Picked Up' }));
        alert(`Parcel ${parcelId} confirmed for pickup!`);
      } else {
        alert('Error: This parcel is not on your current pickup list.');
      }
    } else if (scanAction === 'delivery') {
      const parcelToUpdate = ongoingDeliveries.find(p => p.parcelId === parcelId);
      if (parcelToUpdate) {
        dispatch(updateParcelStatus({ parcelId, status: 'Delivered' }));
        alert(`Parcel ${parcelId} confirmed as delivered!`);
      } else {
        alert('Error: This parcel is not on your current delivery route.');
      }
    }
  }, [scanAction, pendingPickups, ongoingDeliveries, dispatch]);

  const handleStatusChange = (parcelId: string, status: string) => {
    setSelectedStatus(prev => ({ ...prev, [parcelId]: status }));
  };

  const handleUpdate = (parcelId: string) => {
    const status = selectedStatus[parcelId];
    if (status) {
      dispatch(updateParcelStatus({ parcelId, status }));
    }
  };
  
  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => setLocationPermission('granted'),
      () => setLocationPermission('denied')
    );
  };
  
  const getNextStatusOptions = (currentStatus: Parcel['status']) => {
    if (currentStatus === 'Assigned') return ['Assigned', 'Picked Up'];
    if (currentStatus === 'Picked Up') return ['Picked Up', 'In Transit', 'Delivered', 'Failed'];
    if (currentStatus === 'In Transit') return ['In Transit', 'Delivered', 'Failed'];
    return [currentStatus];
  };

  // --- Render Logic ---
  if (loading === 'pending') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-2">{t('loading_assigned_parcels')}</span>
      </div>
    );
  }

  // --- NEW: Define dynamic button properties ---
  const scanButtonText = scanAction === 'pickup' 
    ? t('Scan to confirm pickup')
    : scanAction === 'delivery' 
    ? t('Scan to confirm delivery') 
    : t('No active tasks');
    
  const isScanButtonDisabled = scanAction === 'idle';

  return (
    <>
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex justify-between items-center p-2 rounded-lg">
          <h2 className="text-xl font-semibold">{t('active_deliveries')}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('route')}
              disabled={!isRouteAvailable}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {t('view_optimized_route')}
            </button>
            {/* --- Dynamic Scan Button --- */}
            <button
              onClick={() => setIsScannerOpen(true)}
              disabled={isScanButtonDisabled}
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {scanButtonText}
            </button>
          </div>
        </div>

        {/* Permission & Tracking Alerts */}
        {activeParcelForTracking && locationPermission !== 'granted' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 flex items-center justify-between rounded-r-lg">
            <strong>{t('location_access_required')}</strong>
            {locationPermission !== 'denied' && (
              <button onClick={requestLocationPermission} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                {t('enable')}
              </button>
            )}
          </div>
        )}
        {activeParcelForTracking && locationPermission === 'granted' && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
            {t('currently_tracking', { parcelId: activeParcelForTracking.parcelId })}
          </div>
        )}

        {/* --- PENDING PICKUPS SECTION --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">Pending Pickups ({pendingPickups.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPickups.length > 0 ? (
              pendingPickups.map(parcel => {
                const availableStatuses = getNextStatusOptions(parcel.status);
                return (
                  <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                        <button onClick={() => setInvoiceParcel(parcel)} className="text-xs text-blue-500 hover:underline">{t('invoice')}</button>
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white">To: {parcel.receiverName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.deliveryAddress}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-between gap-2 border-t dark:border-gray-700 rounded-b-lg">
                      <button onClick={() => setSelectedParcel(parcel)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500">{t('view_details')}</button>
                      <div className="flex items-center gap-2">
                        <select onChange={e => handleStatusChange(parcel.parcelId, e.target.value)} className="p-2 border rounded text-sm w-full" defaultValue={parcel.status}>
                          {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <button onClick={() => handleUpdate(parcel.parcelId)} className="bg-primary-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-700 disabled:opacity-50" disabled={!selectedStatus[parcel.parcelId] || selectedStatus[parcel.parcelId] === parcel.status}>{t('update')}</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : <p className="col-span-full text-center text-gray-500 py-4">No parcels waiting for pickup.</p>}
          </div>
        </div>

        {/* --- ONGOING DELIVERIES SECTION --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">Ongoing Deliveries ({ongoingDeliveries.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingDeliveries.length > 0 ? (
              ongoingDeliveries.map(parcel => {
                const availableStatuses = getNextStatusOptions(parcel.status);
                return (
                  <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{t('live_tracking')}</span>
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white">To: {parcel.receiverName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{parcel.deliveryAddress}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-between gap-2 border-t dark:border-gray-700 rounded-b-lg">
                      <button onClick={() => setSelectedParcel(parcel)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500">{t('view_details')}</button>
                      <div className="flex items-center gap-2">
                        <select onChange={e => handleStatusChange(parcel.parcelId, e.target.value)} className="p-2 border rounded text-sm w-full" defaultValue={parcel.status}>
                          {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <button onClick={() => handleUpdate(parcel.parcelId)} className="bg-primary-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-700 disabled:opacity-50" disabled={!selectedStatus[parcel.parcelId] || selectedStatus[parcel.parcelId] === parcel.status}>{t('update')}</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : <p className="col-span-full text-center text-gray-500 py-4">No parcels are currently in transit.</p>}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {selectedParcel && <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />}
      {invoiceParcel && <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />}
      {isScannerOpen && <QRScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
    </>
  );
}
