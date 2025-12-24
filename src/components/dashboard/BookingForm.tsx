// src/components/dashboard/BookingForm.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { createParcel, fetchParcels } from '@/lib/parcelSlice';
import { ParcelCreateInput, Parcel } from '@/types';
import { addToast } from '@/lib/toastSlice';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Box, Truck, CreditCard, MapPin,
  Package, Check, AlertCircle, Loader2, Info
} from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <p className="text-sm text-slate-500">Loading Map...</p>,
});

// --- Type Definitions for our location data ---
interface BaseLocation {
  id: string;
  name: string;
  bn_name: string;
}
interface District extends BaseLocation {
  division_id: string;
}
interface Upazila extends BaseLocation {
  district_id: string;
}
interface Union extends BaseLocation {
  upazilla_id: string;
}


// --- Initial State Definitions ---
const initialFormData: ParcelCreateInput = {
  pickupAddress: '',
  pickupExactLocation: '',
  pickupCoordinates: undefined,
  deliveryAddress: '',
  deliveryCoordinates: undefined,
  receiverName: '',
  receiverNumber: '',
  parcelType: 'Document',
  parcelSize: 'small',
  paymentType: 'prepaid',
  codAmount: 0,
};

interface BookingFormProps {
  redirectIfUnauthenticated?: boolean;
}

export default function BookingForm({ redirectIfUnauthenticated = false }: BookingFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // --- State Hooks ---
  const [formData, setFormData] = useState(initialFormData);
  const [divisions, setDivisions] = useState<BaseLocation[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing submission status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<Parcel | null>(null);

  // Live Summary State
  const [estimatedCost, setEstimatedCost] = useState(0);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllLocationData = async () => {
      try {
        setIsLoading(true);
        const responses = await Promise.all([
          // fetch('/data/pickup-points.json'), // Removed as per new requirement
          fetch('/data/divisions.json'),
          fetch('/data/districts.json'),
          fetch('/data/upazilas.json'),
          fetch('/data/unions.json'),
        ]);
        const data = await Promise.all(responses.map(res => res.json()));
        // setPickupPoints(data[0]); // Removed as per new requirement
        setDivisions(data[0]); // Adjusted index
        setDistricts(data[1]);
        setUpazilas(data[2]);
        setUnions(data[3]);
      } catch {
        setError('Failed to load location data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllLocationData();
  }, []);

  // --- Memoized Filtering Logic ---
  const filteredDistricts = useMemo(
    () => districts.filter(d => d.division_id === selectedDivision),
    [selectedDivision, districts],
  );
  const filteredUpazilas = useMemo(
    () => upazilas.filter(u => u.district_id === selectedDistrict),
    [selectedDistrict, upazilas],
  );
  const filteredUnions = useMemo(
    () => unions.filter(u => u.upazilla_id === selectedUpazila),
    [selectedUpazila, unions],
  );

  // --- Cost Estimation Logic ---
  useEffect(() => {
    let baseRate = 60; // Base delivery charge
    if (formData.parcelSize === 'medium') baseRate = 100;
    if (formData.parcelSize === 'large') baseRate = 150;

    // Extra charge for outside Dhaka
    if (selectedDivision && selectedDivision !== '1') {
      baseRate += 40;
    }

    if (formData.paymentType === 'COD') {
      // 1% COD charge
      baseRate += (formData.codAmount || 0) * 0.01;
    }

    setEstimatedCost(Math.round(baseRate));
  }, [formData.parcelSize, formData.paymentType, formData.codAmount, selectedDivision]);


  // --- Event Handlers ---
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setSelectedUnion('');
    setSubmissionResult(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'codAmount') {
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelection = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDivision(e.target.value);
    setSelectedDistrict('');
    setSelectedUpazila('');
    setSelectedUnion('');
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedUpazila('');
    setSelectedUnion('');
  };
  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUpazila(e.target.value);
    setSelectedUnion('');
  };

  // Determine delivery address from dropdowns to auto-fill (optional helper)
  useEffect(() => {
    if (selectedUnion && selectedUpazila && selectedDistrict) {
      const unionName = unions.find(u => u.id === selectedUnion)?.name || '';
      const upazilaName = upazilas.find(u => u.id === selectedUpazila)?.name || '';
      const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';

      // Only auto-fill if the text field is empty or contains previous auto-filled value
      // Ideally we just append or let user click a button, but for now simple auto-fill:
      const autoAddress = `${unionName}, ${upazilaName}, ${districtName}`;
      setFormData(prev => ({ ...prev, deliveryAddress: autoAddress }));
    }
  }, [selectedUnion, selectedUpazila, selectedDistrict, unions, upazilas, districts]);


  const handleInteraction = () => {
    if (redirectIfUnauthenticated && !isAuthenticated) {
      dispatch(addToast({ message: 'Please login to book a parcel', type: 'error' }));
      router.push('/login');
    }
  };

  const handlePickupLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      pickupCoordinates: { lat, lng }
    }));
  };

  const handleDeliveryLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      deliveryCoordinates: { lat, lng }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (redirectIfUnauthenticated && !isAuthenticated) {
      handleInteraction();
      return;
    }

    setError(null);

    // --- Validation Logic ---

    // 1. Pickup Validation: Text OR Map
    const hasPickupText = !!formData.pickupExactLocation?.trim();
    const hasPickupMap = !!formData.pickupCoordinates;

    if (!hasPickupText && !hasPickupMap) {
      const msg = 'Please provide either an Exact Pickup Address OR Select a Location on the Map.';
      dispatch(addToast({ message: msg, type: 'error' }));
      setError(msg);
      return;
    }

    // 2. Delivery Validation: Text OR Map
    const hasDeliveryText = !!formData.deliveryAddress?.trim();
    const hasDeliveryMap = !!formData.deliveryCoordinates;

    if (!hasDeliveryText && !hasDeliveryMap) {
      const msg = 'Please provide either a Delivery Address OR Select a Location on the Map.';
      dispatch(addToast({ message: msg, type: 'error' }));
      setError(msg);
      return;
    }


    const finalPayload: ParcelCreateInput = {
      ...formData,
      pickupAddress: '', // Defaulting to empty
      parcelSize: formData.parcelSize as 'small' | 'medium' | 'large',
      paymentType: formData.paymentType as 'COD' | 'prepaid',
    };

    setIsSubmitting(true);
    try {
      const result = await dispatch(createParcel(finalPayload)).unwrap();
      dispatch(addToast({ message: 'Parcel booked successfully!', type: 'success' }));
      setSubmissionResult(result.data);
      dispatch(fetchParcels());
    } catch (err: unknown) {
      dispatch(addToast({ message: typeof err === 'string' ? err : 'Failed to book parcel.', type: 'error' }));
      if (typeof err === 'string') setError(err);
      else if (err instanceof Error) setError(err.message);
      else setError('Failed to book parcel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success View ---
  if (submissionResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center shadow-xl border border-dashed border-green-500/50"
      >
        <div className="mx-auto bg-green-500/10 h-20 w-20 rounded-full flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-500" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Your package is ready for pickup.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 max-w-sm mx-auto mb-8 border border-slate-200 dark:border-slate-700">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Tracking ID</p>
          <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
            {submissionResult.parcelId || 'PENDING'}
          </p>
        </div>

        <button
          onClick={resetForm}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Book Another Parcel
        </button>
      </motion.div>
    );
  }

  // --- Main Form Render ---
  const FormContent = (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

      {/* --- Left Column: Input Form --- */}
      <div className="flex-1 p-8 lg:p-10 relative">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Package size={20} />
          </span>
          New Booking
        </h2>
        <p className="text-slate-500 text-sm ml-14 mb-8">Fill in the details to schedule a pickup.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} onClick={handleInteraction} onFocus={handleInteraction} className="space-y-8">

          {/* Receiver Info Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <User size={14} /> Receiver Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                />
                <label className="absolute left-12 top-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-0.5 peer-focus:text-[10px] peer-focus:text-indigo-500 pointer-events-none">
                  Receiver Name
                </label>
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  name="receiverNumber"
                  value={formData.receiverNumber}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                />
                <label className="absolute left-12 top-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-0.5 peer-focus:text-[10px] peer-focus:text-indigo-500 pointer-events-none">
                  Phone Number
                </label>
              </div>
            </div>
          </section>

          {/* Parcel Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <Box size={14} /> Parcel Configuration
            </div>

            {/* Service Type Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Document', 'Electronics', 'Apparel', 'Fragile'].map((type) => (
                <div
                  key={type}
                  onClick={() => handleSelection('parcelType', type)}
                  className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.parcelType === type
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-[10px] font-bold uppercase">{type}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {/* Parcel Size Select */}
              <div className="relative group">
                <Box className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <select
                  name="parcelSize"
                  value={formData.parcelSize}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-12 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="small">Small (Up to 1kg)</option>
                  <option value="medium">Medium (1kg - 5kg)</option>
                  <option value="large">Large (5kg+)</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Payment Method */}
              <div className="relative group">
                <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 pl-12 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="prepaid">Prepaid</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {formData.paymentType === 'COD' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative group"
              >
                <div className="absolute left-4 top-3.5 font-bold text-slate-400">৳</div>
                <input
                  type="number"
                  name="codAmount"
                  value={formData.codAmount}
                  onChange={handleChange}
                  placeholder="CID Amount to Collect"
                  className="w-full bg-white border-2 border-green-100 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none font-bold text-green-700 placeholder-green-700/50"
                  required
                />
              </motion.div>
            )}
          </section>

          {/* Location Details */}
          <section className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Location Settings</h3>

            {/* PICKUP LOCATION SECTION */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-500 uppercase tracking-widest mb-4">
                <MapPin size={14} /> Pickup Location
              </div>

              <div className="space-y-4">
                {/* Exact Pickup Location Type Input */}
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Address (Text)
                  </label>
                  <input
                    name="pickupExactLocation"
                    value={formData.pickupExactLocation}
                    onChange={handleChange}
                    placeholder="House No, Road No, Area details..."
                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                {/* Map Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Map Selection</label>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-[250px] relative">
                    <MapPicker onLocationSelect={handlePickupLocationSelect} />
                    {formData.pickupCoordinates && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-[1000]">
                        Pinned
                      </div>
                    )}
                  </div>
                  {formData.pickupCoordinates && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <MapPin size={12} /> Pinned: {formData.pickupCoordinates.lat.toFixed(5)}, {formData.pickupCoordinates.lng.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>
            </div>


            {/* DELIVERY LOCATION SECTION */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 uppercase tracking-widest mb-4">
                <Truck size={14} /> Delivery Location
              </div>

              <div className="space-y-4">
                {/* Area Selector Helpers */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <select value={selectedDivision} onChange={handleDivisionChange} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs focus:border-indigo-500 outline-none">
                    <option value="" disabled>Select Division</option>
                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedDivision} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs focus:border-indigo-500 outline-none disabled:opacity-50">
                    <option value="" disabled>Select District</option>
                    {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select value={selectedUpazila} onChange={handleUpazilaChange} disabled={!selectedDistrict} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs focus:border-indigo-500 outline-none disabled:opacity-50">
                    <option value="" disabled>Select Upazila</option>
                    {filteredUpazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <select value={selectedUnion} onChange={e => setSelectedUnion(e.target.value)} disabled={!selectedUpazila} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs focus:border-indigo-500 outline-none disabled:opacity-50">
                    <option value="" disabled>Select Union</option>
                    {filteredUnions.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                {/* Delivery Address Input */}
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Address (Text)
                  </label>
                  <textarea
                    name="deliveryAddress"
                    rows={2}
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Full Delivery Address..."
                    className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                </div>

                {/* Delivery Map Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Map Selection</label>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-[250px] relative">
                    <MapPicker onLocationSelect={handleDeliveryLocationSelect} />
                    {formData.deliveryCoordinates && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-[1000]">
                        Pinned
                      </div>
                    )}
                  </div>
                  {formData.deliveryCoordinates && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <MapPin size={12} /> Pinned: {formData.deliveryCoordinates.lat.toFixed(5)}, {formData.deliveryCoordinates.lng.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </section>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
            {!isSubmitting && <Truck size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

        </form>
      </div>

      {/* --- Right Column: Live Summary (Sticky) --- */}
      <div className="w-full lg:w-[320px] bg-slate-50 dark:bg-slate-800/50 p-8 border-l border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="sticky top-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Info size={14} /> Estimate Summary
          </h3>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 text-sm">Service</span>
              <span className="font-semibold text-slate-800 dark:text-white capitalize">{formData.parcelSize} Package</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 text-sm">Payment</span>
              <span className="font-semibold text-slate-800 dark:text-white capitalize">{formData.paymentType}</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Estimated Cost</span>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    ৳{estimatedCost}
                  </div>
                </div>
                <span className="text-xs text-slate-400 mb-1">*Incl. VAT</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
            <p className="text-xs text-orange-600 dark:text-orange-300 leading-relaxed">
              <strong>Note:</strong> Final price may vary based on exact weight measurements during pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (redirectIfUnauthenticated) {
    return (
      <section id="booking" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Quick Booking</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Schedule your delivery in minutes. Secure, fast, and reliable.</p>
            </div>
            {FormContent}
          </motion.div>
        </div>
      </section>
    );
  }

  return FormContent;
}
