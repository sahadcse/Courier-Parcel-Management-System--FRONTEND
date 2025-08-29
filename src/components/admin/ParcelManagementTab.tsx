// ParcelManagementTab.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels, assignAgentToParcel } from '@/lib/parcelSlice';
import { fetchAllUsers } from '@/lib/adminSlice';
import ParcelDetailsModal from '../dashboard/ParcelDetailsModal';
import { Parcel } from '@/types';
import InvoiceModal from '../dashboard/InvoiceModal';
import ExportButton from './ExportButton'; 

export default function ParcelManagementTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { parcels, loading: parcelsLoading } = useSelector((state: RootState) => state.parcels);
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.admin);
  
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<{ [parcelId: string]: string }>({});

  useEffect(() => {
    dispatch(fetchParcels());
    dispatch(fetchAllUsers());
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
    return <p>Loading parcels and agents...</p>;
  }

  return (
    <>
      <div className="mb-4 text-right">
        <ExportButton data={parcels} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcels.map(parcel => {
          const statusStyles = {
            'Delivered': 'bg-green-100 text-green-800', 'In Transit': 'bg-blue-100 text-blue-800',
            'Picked Up': 'bg-cyan-100 text-cyan-800', 'Failed': 'bg-red-100 text-red-800',
            'Assigned': 'bg-purple-100 text-purple-800', 'Booked': 'bg-yellow-100 text-yellow-800',
          };
          const currentStatusStyle = statusStyles[parcel.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';

          return (
            <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col justify-between">
              {/* Main Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{parcel.parcelId}</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${currentStatusStyle}`}>
                    {parcel.status}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    To: {parcel.receiverName}
                  </p>
                  <button
                    onClick={() => setInvoiceParcel(parcel)}
                    className="text-sm font-medium hover:bg-emerald-500 hover:rounded-md hover:text-white text-gray-600 dark:text-gray-300 underline px-3 py-1"
                  >
                    Invoice
                  </button>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 flex items-center justify-between gap-2 border-t dark:border-gray-700 rounded-b-lg">
                <button
                  onClick={() => setSelectedParcel(parcel)}
                  className="text-sm font-medium hover:bg-emerald-500 hover:rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-500 px-3 py-1"
                >
                  View Details
                </button>

                {parcel.assignedAgent ? (
                  <div className="text-right text-sm flex gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Assigned to:</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {getAgentName(parcel.assignedAgent)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 box-border">
                    <select
                      onChange={e => handleAgentSelect(parcel.parcelId, e.target.value)}
                      className=" border rounded dark:bg-gray-700 text-sm w-full py-1 px-2"
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
                      className="bg-primary-500 text-white rounded py-1 px-2 text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
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
      {invoiceParcel && (
        <InvoiceModal parcel={invoiceParcel} onClose={() => setInvoiceParcel(null)} />
      )}
    </>
  );
}

