// src/components/dashboard/BookingForm.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/lib/store';
import { createParcel, fetchParcels  } from '@/lib/parcelSlice';
import { ParcelCreateInput, Parcel } from '@/types';

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
interface PickupPoint {
  id: string;
  name: string;
  address: string;
}

// --- Initial State Definitions ---
const initialFormData: Omit<ParcelCreateInput, 'deliveryAddress'> = {
  pickupAddress: '',
  receiverName: '',
  receiverNumber: '',
  parcelType: 'Document',
  parcelSize: 'small',
  paymentType: 'prepaid',
  codAmount: 0,
};

export default function BookingForm() {
  const dispatch = useAppDispatch();

  // --- State Hooks ---
  const [formData, setFormData] = useState(initialFormData);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
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

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllLocationData = async () => {
      try {
        setIsLoading(true);
        const responses = await Promise.all([
          fetch('/data/pickup-points.json'),
          fetch('/data/divisions.json'),
          fetch('/data/districts.json'),
          fetch('/data/upazilas.json'),
          fetch('/data/unions.json'),
        ]);
        const data = await Promise.all(responses.map(res => res.json()));
        setPickupPoints(data[0]);
        setDivisions(data[1]);
        setDistricts(data[2]);
        setUpazilas(data[3]);
        setUnions(data[4]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // FIX: Specifically handle the codAmount to ensure it's a number
    if (name === 'codAmount') {
      // Allow empty string to clear the input, otherwise parse as a number
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue, // Fallback to 0 if parsing fails
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    const unionName = unions.find(u => u.id === selectedUnion)?.name || '';
    const upazilaName = upazilas.find(u => u.id === selectedUpazila)?.name || '';
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || '';
    const deliveryAddress = `${unionName}, ${upazilaName}, ${districtName}`;

    if (!unionName || !upazilaName || !districtName) {
      alert('Please select a complete delivery address.');
      return;
    }

    const finalPayload: ParcelCreateInput = {
      ...formData,
      deliveryAddress,
      parcelSize: formData.parcelSize as 'small' | 'medium' | 'large',
      paymentType: formData.paymentType as 'COD' | 'prepaid',
    };

    setIsSubmitting(true);
    try {
      const result = await dispatch(createParcel(finalPayload)).unwrap();
      console.log('Parcel booked successfully:', result.data);
      setSubmissionResult(result.data);
      dispatch(fetchParcels());
    } catch (err: unknown) {
      // Show the specific validation error from the backend
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to book parcel. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Conditional Rendering for Success Message ---
  if (submissionResult) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900 h-12 w-12 rounded-full flex items-center justify-center">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mt-4">Booking Successful!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your parcel has been booked. Your tracking ID is:
        </p>
        <p className="text-lg font-bold text-primary-500 mt-1">
          {submissionResult.parcelId || 'ID Pending...'}
        </p>

        <button
          onClick={resetForm}
          className="mt-6 bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-700 w-full md:w-auto"
        >
          Book Another Parcel
        </button>
      </div>
    );
  }

  // --- Main Form Render ---
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Book a New Parcel</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Parcel Details --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            placeholder="Receiver's Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="receiverNumber"
            value={formData.receiverNumber}
            onChange={handleChange}
            placeholder="Receiver's Number"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="parcelSize"
            value={formData.parcelSize}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <select
            name="parcelType"
            value={formData.parcelType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Document">Document</option>
            <option value="Apparel">Apparel & Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books & Stationery</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Food">Food Items (Non-Perishable)</option>
            <option value="Gift">Gifts & Hampers</option>
            <option value="Fragile">Fragile Items</option>
          </select>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="prepaid">Prepaid</option>
            <option value="COD">Cash on Delivery (COD)</option>
          </select>
          {formData.paymentType === 'COD' && (
            <input
              type="number"
              name="codAmount"
              value={formData.codAmount}
              onChange={handleChange}
              placeholder="COD Amount"
              className="w-full p-2 border rounded"
              required
            />
          )}
        </div>

        {/* --- Pickup & Delivery Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
          {/* Pickup Point */}
          <div>
            <label className="block font-medium mb-1">Pickup Point</label>
            <select
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? 'Loading...' : 'Select a pickup hub'}
              </option>
              {pickupPoints.map(p => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block font-medium mb-1">Delivery Address</label>
            <div className="space-y-2">
              <select
                value={selectedDivision}
                onChange={handleDivisionChange}
                className="w-full p-2 border rounded"
                required
                disabled={isLoading}
              >
                <option value="" disabled>
                  {isLoading ? 'Loading...' : 'Select Division'}
                </option>
                {divisions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full p-2 border rounded"
                required
                disabled={!selectedDivision}
              >
                <option value="" disabled>
                  Select District
                </option>
                {filteredDistricts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedUpazila}
                onChange={handleUpazilaChange}
                className="w-full p-2 border rounded"
                required
                disabled={!selectedDistrict}
              >
                <option value="" disabled>
                  Select Upazila/Thana
                </option>
                {filteredUpazilas.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedUnion}
                onChange={e => setSelectedUnion(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={!selectedUpazila}
              >
                <option value="" disabled>
                  Select Union
                </option>
                {filteredUnions.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-700 w-full md:w-auto disabled:opacity-50"
        >
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
