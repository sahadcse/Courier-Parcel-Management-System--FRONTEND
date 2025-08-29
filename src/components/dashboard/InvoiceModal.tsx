'use client';

import { Parcel } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface InvoiceModalProps {
  parcel: Parcel;
  onClose: () => void;
}

export default function InvoiceModal({ parcel, onClose }: InvoiceModalProps) {
  const [mounted, setMounted] = useState(false);

  // --- FIX: Add an effect to manage a class on the body ---
  useEffect(() => {
    setMounted(true);
    // When the modal mounts, add a class to the body
    document.body.classList.add('modal-open');
    // When the modal unmounts, remove the class
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const getPrice = (size: string) => {
    switch (size) {
      case 'small': return 80;
      case 'medium': return 120;
      case 'large': return 160;
      default: return 100;
    }
  };

  const deliveryCharge = getPrice(parcel.parcelSize);
  const codAmount = parcel.paymentType === 'COD' ? parcel.codAmount || 0 : 0;
  const total = deliveryCharge + codAmount;
  const amountDue = parcel.paymentType === 'COD' ? total : 0;

  const handlePrint = () => {
    window.print();
  };
  
  const qrCodeUrl = `${window.location.origin}/track/${parcel.parcelId}`;

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <>
      {/* --- Print-Specific Styles --- */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the printable area using visibility */
          body > *:not(.invoice-printable-area) {
            visibility: hidden !important;
          }
          .invoice-printable-area,
          .invoice-printable-area * {
            visibility: visible !important;
          }
          .invoice-printable-area {
            /* Position and size to cover the full page */
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important; /* Top-align content; change to 'center' for vertical centering */
            background-color: white !important; /* Ensure white background */
            backdrop-filter: none !important; /* Remove blur */
          }
          /* Style the modal content to look like a full-page document */
          .invoice-printable-area > div {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
          /* Optional: Force light mode colors for print */
          .dark\\:bg-gray-900 {
            background-color: white !important;
          }
          .dark\\:text-white {
            color: black !important;
          }
          /* Add more overrides if needed for dark mode elements */
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    
      {/* Backdrop & Printable Area Wrapper */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm invoice-printable-area"
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-auto"
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Invoice</h1>
                <p className="text-sm text-gray-500">ID: {parcel.parcelId}</p>
                <p className="text-sm text-gray-500">Date: {new Date(parcel.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-primary-500">CourierPro</h2>
                <p className="text-sm text-gray-500">+880 1746669174</p>
                <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
                <p className="text-sm text-gray-500">sahaduzzaman.cse@gmail.com</p>
              </div>
            </div>

            {/* Bill To & Shipped From */}
            <div className="grid grid-cols-2 gap-6 mb-8 border-y py-4 dark:border-gray-700">
              <div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Bill To</h3>
                <p className="text-gray-800 dark:text-white font-medium">{parcel.receiverName}</p>
                <p className="text-gray-500">{parcel.deliveryAddress}</p>
                <p className="text-gray-500">{parcel.receiverNumber}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Shipment Details</h3>
                <p className="text-gray-500">From: {parcel.pickupAddress}</p>
                <p className="text-gray-500">Type: {parcel.parcelType} ({parcel.parcelSize})</p>
                <p className="text-gray-500">Status: <span className='border border-black rounded-md px-1 '>{parcel.status}</span></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-8">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 rounded-l-lg font-semibold">Description</th>
                  <th className="p-2 text-right rounded-r-lg font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="p-2">Delivery Charge</td>
                  <td className="p-2 text-right">{deliveryCharge.toFixed(2)} BDT</td>
                </tr>
                {parcel.paymentType === 'COD' && (
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-2">Cash on Delivery Collection</td>
                    <td className="p-2 text-right">{codAmount.toFixed(2)} BDT</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals & QR Code */}
            <div className="flex justify-between items-end">
              <div className="text-center">
                <QRCodeSVG value={qrCodeUrl} size={80} bgColor={"#ffffff"} fgColor={"#000000"} />
                <p className="text-xs text-gray-500 mt-1">Scan to Verify</p>
              </div>
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span>{total.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-semibold">{parcel.paymentType === 'COD' ? 'COD - Unpaid' : 'Prepaid - Paid'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary-500 border-t pt-2 dark:border-gray-700">
                  <span>Amount Due</span>
                  <span>{amountDue.toFixed(2)} BDT</span>
                </div>
              </div>
            </div>
          </div>

          <p className=' text-center text-gray-500 text-xs'>System generated, Signature not required</p>
          
          {/* Action Buttons (will be hidden on print) */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-end gap-2 rounded-b-lg no-print">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Close</button>
              <button onClick={handlePrint} className="px-4 py-2 text-sm text-white bg-primary-500 rounded-lg hover:bg-primary-600">Print Invoice</button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}