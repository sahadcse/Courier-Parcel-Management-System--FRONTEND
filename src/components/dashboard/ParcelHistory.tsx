// src/components/dashboard/ParcelHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels } from '@/lib/parcelSlice';
import ParcelDetailsModal from './ParcelDetailsModal';
import { Parcel } from '@/types';
import InvoiceModal from './InvoiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, Clock, Search, ExternalLink, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ParcelHistoryProps {
  onTrackClick: (parcelId: string) => void;
}

export default function ParcelHistory({ onTrackClick }: ParcelHistoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { parcels, loading, error } = useSelector((state: RootState) => state.parcels);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [invoiceParcel, setInvoiceParcel] = useState<Parcel | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter parcels based on search (ID or Receiver Name)
  const filteredParcels = parcels.filter(p =>
    p.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'In Transit': return <Truck className="text-blue-500" size={18} />;
      case 'Picked Up': return <Package className="text-indigo-500" size={18} />;
      case 'Failed': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-amber-500" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'In Transit': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Picked Up': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    }
  };

  if (loading === 'pending') {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4"></div>
        <span className="text-gray-500 animate-pulse">Loading shipments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        <XCircle size={24} />
        <div>
          <h3 className="font-semibold">Failed to load shipments</h3>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="text-primary-500" /> Recent Shipments
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track your recent deliveries.</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Parcel ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Parcel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredParcels.length > 0 ? (
              filteredParcels.map((parcel, index) => (
                <motion.div
                  key={parcel._id || parcel.parcelId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary-100 dark:hover:border-gray-600 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Row: ID & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parcel ID</span>
                      <p className="font-mono font-semibold text-gray-800 dark:text-gray-200 text-lg group-hover:text-primary-600 transition-colors">
                        {parcel.parcelId}
                      </p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(parcel.status)}`}>
                      {getStatusIcon(parcel.status)}
                      {parcel.status}
                    </div>
                  </div>

                  {/* Middle Row: Route */}
                  <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-4 mb-6">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full ring-4 ring-white dark:ring-gray-800 transition-colors group-hover:bg-primary-500" />
                      <p className="text-xs text-gray-400 mb-0.5">To</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1" title={parcel.receiverName}>
                        {parcel.receiverName}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">{parcel.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 mt-auto border-t border-gray-50 dark:border-gray-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedParcel(parcel)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                    >
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInvoiceParcel(parcel)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View Invoice"
                      >
                        <FileText size={18} />
                      </button>

                      {(parcel.status === 'Picked Up' || parcel.status === 'In Transit' || parcel.status === 'Booked') && (
                        <button
                          onClick={() => onTrackClick(parcel.parcelId)}
                          className="flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-600 dark:hover:bg-gray-200 transition-colors shadow-sm"
                        >
                          <Search size={14} /> Track
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Parcels Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">You haven&apos;t booked any parcels yet, or no parcels match your search.</p>
                <Link
                  href="/customer/book"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2"
                >
                  Book Your First Parcel <ChevronRight size={16} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modals */}
      {selectedParcel && (
        <ParcelDetailsModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
      {invoiceParcel && (
        <InvoiceModal
          parcel={invoiceParcel}
          onClose={() => setInvoiceParcel(null)}
          userRole={user?.role as 'admin' | 'agent' | 'customer'}
        />
      )}
    </>
  );
}
