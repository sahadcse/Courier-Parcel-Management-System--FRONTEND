// ParcelManagementTab.tsx

'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels, assignAgentToParcel } from '@/lib/parcelSlice';
import { fetchAllUsers } from '@/lib/adminSlice';
import ParcelDetailsModal from '../dashboard/ParcelDetailsModal';
import { Parcel } from '@/types';
import ExportButton from './ExportButton'; 
import { MoreVertical, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import InvoiceModal from '../dashboard/InvoiceModal';

// --- Skeleton Component for Loading State ---
const ParcelCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 animate-pulse">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 h-16 border-t dark:border-gray-700 rounded-b-lg"></div>
  </div>
);

export default function ParcelManagementTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { parcels, loading: parcelsLoading } = useSelector((state: RootState) => state.parcels);
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.admin);
  
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  // --- FIX #1: Re-introduce the state for the invoice modal ---
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<{ [parcelId: string]: string }>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchParcels());
    dispatch(fetchAllUsers());

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dispatch]);

  const activeAgents = useMemo(() => {
    return users.filter(user => user.role === 'agent' && user.isActive);
  }, [users]);

  const handleAgentSelect = (parcelId: string, agentId: string) => {
    setSelectedAgents(prev => ({ ...prev, [parcelId]: agentId }));
  };

  const handleAssignAgent = (parcelId: string) => {
    const agentId = selectedAgents[parcelId];
    if (agentId) {
      dispatch(assignAgentToParcel({ parcelId, agentId }));
    }
  };

  const getAgentName = (agentId: string) => {
    const agent = users.find(u => u._id === agentId);
    return agent ? agent.customerName : 'Unknown Agent';
  };

  if (parcelsLoading === 'pending' || usersLoading === 'pending') {
    return (
      <section className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ParcelCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4">
      <div className="mb-4 text-right">
        <ExportButton data={parcels} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels.map(parcel => {
          const statusStyles = {
            'Delivered': 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
            'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
            'Picked Up': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400',
            'Failed': 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
            'Assigned': 'bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400',
            'Booked': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
          };
          const currentStatusStyle = statusStyles[parcel.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

          return (
            <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${currentStatusStyle}`}>
                    {parcel.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg text-gray-800 dark:text-white truncate pr-2">
                    To: {parcel.receiverName}
                  </p>
                  
                  <div className="relative" ref={openMenuId === parcel._id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === parcel._id ? null : parcel._id)}
                      className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === parcel._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10">
                        <button onClick={() => { setSelectedParcel(parcel); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Eye size={16} /> View Details
                        </button>
                        {/* --- FIX #2: Changed the Link back to a button that opens the modal --- */}
                        <button onClick={() => { setInvoiceParcel(parcel); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FileText size={16} /> Invoice
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 border-t dark:border-gray-700 rounded-b-lg">
                {parcel.assignedAgent ? (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Assigned to: </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{getAgentName(parcel.assignedAgent)}</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                      onChange={e => handleAgentSelect(parcel.parcelId, e.target.value)}
                      className="w-full border rounded-md dark:bg-gray-700 text-sm py-1.5 px-2 focus:ring-2 focus:ring-primary-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Select agent</option>
                      {activeAgents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.customerName}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssignAgent(parcel.parcelId)}
                      disabled={!selectedAgents[parcel.parcelId]}
                      className="w-full sm:w-auto bg-primary-600 text-white bg-black rounded-md py-1.5 px-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedParcel && (
        <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}

      {/* --- FIX #3: Render the InvoiceModal when its state is set --- */}
      {invoiceParcel && (
        <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />
      )}
    </section>
  );
}

