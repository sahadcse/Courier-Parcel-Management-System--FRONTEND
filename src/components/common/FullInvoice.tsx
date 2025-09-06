'use client';

import { Parcel } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Loader2, FileWarning } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { fetchParcels } from '@/lib/parcelSlice';

// --- Full Invoice Component ---
export default function FullInvoice() {
  const params = useParams();
    const router = useRouter();
    const parcelId = params.parcelId as string;
    const dispatch = useDispatch<AppDispatch>();

    const { parcels, loading } = useSelector((state: RootState) => state.parcels);
    const parcel = parcels.find(p => p.parcelId === parcelId);
    
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        if (parcels.length === 0) {
            dispatch(fetchParcels());
        }
        setQrCodeUrl(`${window.location.origin}/track/${parcelId}`);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                router.back();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [dispatch, parcels.length, parcelId, router]);
    
    // Return null on the server and on the first client render to prevent hydration errors.
    if (!isMounted) {
        return null;
    }

    // --- Pricing Calculation ---
    // This is moved up to be accessible by the success render logic
    const getPrice = (size: string) => {
        switch (size) {
            case 'small': return 80;
            case 'medium': return 120;
            case 'large': return 160;
            default: return 100;
        }
    };

    let deliveryCharge = 0, codAmount = 0, subtotal = 0, amountDue = 0;
    if (parcel) {
        deliveryCharge = getPrice(parcel.parcelSize);
        codAmount = parcel.paymentType === 'COD' ? parcel.codAmount || 0 : 0;
        subtotal = deliveryCharge + codAmount;
        amountDue = parcel.paymentType === 'COD' ? subtotal : 0;
    }

    // --- FIX: All rendering logic is now inside a single portal ---
    return createPortal(
        <section>
            {/* Loading State */}
            {(loading === 'pending' && parcels.length === 0) && (
                <div className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-gray-500 dark:bg-gray-900">
                    <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
                    <p className="font-semibold">Loading Invoice...</p>
                </div>
            )}

            {/* Not Found State */}
            {(loading !== 'pending' && !parcel) && (
                <div className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-center p-4 dark:bg-gray-900">
                    <FileWarning className="h-12 w-12 text-red-500" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Invoice Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400">The parcel with ID <span className="font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded-md">{parcelId}</span> could not be found.</p>
                    <Link href="/admin?tab=parcels" className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary-700">
                        Back to Dashboard
                    </Link>
                </div>
            )}

            {/* Success State (Invoice Content) */}
            {parcel && (
                <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-100 dark:bg-gray-950 font-sans invoice-portal">
                    <style jsx global>{`
                        @media print {
                            .no-print { display: none !important; }
                            body > div:not(.invoice-portal) { display: none !important; }
                            .invoice-portal {
                                position: static !important;
                                overflow: visible !important;
                            }
                            #invoice-page { padding: 0 !important; }
                            #invoice-content { 
                                box-shadow: none !important; border: none !important; margin: 0 !important; 
                                max-width: 100% !important; border-radius: 0 !important;
                            }
                        }
                        @page { size: A4; margin: 0.5in; }
                    `}</style>
                    
                    <div className="no-print fixed bottom-18 md:bottom-8 right-8 z-50">
                        <button onClick={() => window.print()} className="flex items-center justify-center rounded-full bg-primary-600 p-4 text-white bg-black shadow-lg hover:bg-primary-700 transition-transform hover:scale-110">
                            <Printer size={24} />
                        </button>
                    </div>

                    <main id="invoice-page" className="p-4 sm:p-8">
                      <div id="invoice-content" className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl dark:bg-gray-900 border dark:border-gray-800 flex">
                        <div className="hidden sm:flex w-12 items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-l-lg">
                            <h1 className="text-xl font-bold text-gray-400 dark:text-gray-500 transform -rotate-90 whitespace-nowrap tracking-wider">
                                INVOICE #{parcel.parcelId.slice(-6)}
                            </h1>
                        </div>
                        <div className="p-8 sm:p-10 w-full">
                            <header className="flex flex-col sm:flex-row justify-between items-start pb-6 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">ProCourier</h2>
                                    <p className="text-sm text-gray-500">123 Business Avenue, Dhaka</p>
                                    <p className="text-sm text-gray-500">support@procourier.com</p>
                                    <p className="text-sm text-gray-500">+880 123 456 7890</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center p-2">
                                       {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={80} bgColor="transparent" fgColor={typeof window !== 'undefined' && document.body.classList.contains('dark') ? '#FFFFFF' : '#000000'} />}
                                    </div>
                                </div>
                            </header>
                            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-sm">
                                <div className="sm:col-span-1">
                                    <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 border-b dark:border-gray-700 pb-1">Bill To</h3>
                                    <p className="font-bold text-gray-800 dark:text-white">{parcel.receiverName}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{parcel.deliveryAddress}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{parcel.receiverNumber}</p>
                                </div>
                                 <div className="sm:col-span-1">
                                    <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 border-b dark:border-gray-700 pb-1">Location</h3>
                                    <p className="font-bold text-gray-800 dark:text-white">From:</p>
                                    <p className="text-gray-600 dark:text-gray-300">{parcel.pickupAddress}</p>
                                </div>
                                <div className="sm:col-span-1 text-left sm:text-right">
                                     <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 border-b dark:border-gray-700 pb-1">Details</h3>
                                     <p className="text-gray-600 dark:text-gray-300">Invoice Date: <span className="font-medium text-gray-800 dark:text-white">{new Date(parcel.createdAt).toLocaleDateString()}</span></p>
                                     <p className="text-gray-600 dark:text-gray-300">Due Date: <span className="font-medium text-gray-800 dark:text-white">{new Date(parcel.createdAt).toLocaleDateString()}</span></p>
                                </div>
                            </section>
                            <section className="mb-8">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-primary-600 text-white text-sm">
                                            <th className="p-3 font-semibold rounded-l-lg">Description</th>
                                            <th className="p-3 font-semibold text-center">QTY</th>
                                            <th className="p-3 font-semibold text-right">Unit Price</th>
                                            <th className="p-3 font-semibold text-right rounded-r-lg">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b dark:border-gray-700">
                                            <td className="p-3 text-gray-800 dark:text-gray-200">Delivery Charge ({parcel.parcelSize})</td>
                                            <td className="p-3 text-center text-gray-600 dark:text-gray-400">1</td>
                                            <td className="p-3 text-right text-gray-600 dark:text-gray-400">{deliveryCharge.toFixed(2)}</td>
                                            <td className="p-3 text-right text-gray-800 dark:text-gray-200">{deliveryCharge.toFixed(2)} BDT</td>
                                        </tr>
                                        {parcel.paymentType === 'COD' && (
                                            <tr className="border-b dark:border-gray-700">
                                                <td className="p-3 text-gray-800 dark:text-gray-200">Cash on Delivery Collection</td>
                                                <td className="p-3 text-center text-gray-600 dark:text-gray-400">1</td>
                                                <td className="p-3 text-right text-gray-600 dark:text-gray-400">{codAmount.toFixed(2)}</td>
                                                <td className="p-3 text-right text-gray-800 dark:text-gray-200">{codAmount.toFixed(2)} BDT</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </section>
                            <footer className="flex justify-between items-start pt-6 border-t dark:border-gray-700">
                                <div className="text-sm text-gray-500">
                                    <h4 className="font-semibold mb-1">Terms & Instructions</h4>
                                    <p>Payment is due within 15 days.</p>
                                    <p className="mt-4">Thank you for your Order!</p>
                                </div>
                                <div className="w-full sm:max-w-xs space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Tax (0%)</span>
                                        <span>0.00 BDT</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-primary-600 dark:text-primary-400 mt-2 pt-2 border-t dark:border-gray-700">
                                        <span>Balance Due</span>
                                        <span>{amountDue.toFixed(2)} BDT</span>
                                    </div>
                                </div>
                            </footer>
                            <p className="mt-14 text-xs text-gray-500 text-center">
                                This is a system generated invoice and does not require a signature.
                            </p>
                        </div>
                      </div>
                    </main>
                </div>
            )}
        </section>,
        document.body
    );
}