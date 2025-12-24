// src/components/common/FullInvoice.tsx
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Loader2, FileWarning, ArrowLeft, Download } from 'lucide-react';
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
        <section className="font-sans antialiased text-gray-900 bg-gray-100 dark:bg-gray-950 min-h-screen fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:block">
            {/* Loading State */}
            {(loading === 'pending' && parcels.length === 0) && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-400">Retrieving Invoice Details...</p>
                </div>
            )}

            {/* Not Found State */}
            {(loading !== 'pending' && !parcel) && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <FileWarning size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invoice Not Found</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        We couldn't locate an invoice for ID <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200 font-bold">{parcelId}</span>.
                    </p>
                    <button onClick={() => router.back()} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            )}

            {/* Success State (Invoice Content) */}
            {parcel && (
                <>
                    {/* Print & Action Controls (Hidden when printing) */}
                    <div className="print:hidden fixed top-4 right-4 md:right-8 flex gap-3 z-50">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-primary-600 text-white dark:bg-primary-500 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
                        >
                            <Printer size={18} /> Print Invoice
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    <style jsx global>{`
                        @media print {
                            @page { size: A4; margin: 0; }
                            body { background: white; -webkit-print-color-adjust: exact; }
                            .print\\:hidden { display: none !important; }
                            .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; border: none !important; border-radius: 0 !important; }
                        }
                    `}</style>

                    <main className="invoice-container bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl rounded-none md:rounded-lg overflow-hidden relative">
                        {/* Top Decorative Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600"></div>

                        <div className="p-12 md:p-16">
                            {/* Header */}
                            <header className="flex justify-between items-start mb-16">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">INVOICE</h1>
                                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">#{parcel.parcelId}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-primary-600 tracking-tight flex items-center justify-end gap-2">
                                        Logistics<span className="text-gray-900">Pro</span>
                                    </h2>
                                    <div className="text-gray-500 text-sm mt-2 space-y-1">
                                        <p>123 Logistics Way, Dhaka, Bangladesh</p>
                                        <p>support@logisticspro.com</p>
                                        <p>+880 123 456 7890</p>
                                    </div>
                                </div>
                            </header>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-12 mb-16">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
                                    <div className="text-gray-900">
                                        <p className="font-bold text-lg mb-1">{parcel.receiverName}</p>
                                        <p className="text-gray-600 max-w-xs leading-relaxed">{parcel.deliveryAddress}</p>
                                        <p className="text-gray-600 mt-2">{parcel.receiverNumber}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Invoice Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-end gap-8">
                                                <span className="text-gray-500">Date Issued:</span>
                                                <span className="font-semibold text-gray-900">{new Date(parcel.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-end gap-8">
                                                <span className="text-gray-500">Due Date:</span>
                                                <span className="font-semibold text-gray-900">{new Date(parcel.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-end gap-8">
                                                <span className="text-gray-500">Service Type:</span>
                                                <span className="font-semibold text-gray-900 capitalize">{parcel.parcelSize} Package</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div className="mb-12">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-primary-600">
                                            <th className="py-4 text-left font-bold text-gray-900 uppercase text-xs tracking-wider w-1/2">Description</th>
                                            <th className="py-4 text-center font-bold text-gray-900 uppercase text-xs tracking-wider">Qty</th>
                                            <th className="py-4 text-right font-bold text-gray-900 uppercase text-xs tracking-wider">Price</th>
                                            <th className="py-4 text-right font-bold text-gray-900 uppercase text-xs tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="py-6">
                                                <p className="font-bold text-gray-900">Delivery Charge</p>
                                                <p className="text-sm text-gray-500 mt-1">Standard shipping for {parcel.parcelSize} sized parcel</p>
                                            </td>
                                            <td className="py-6 text-center text-gray-600">1</td>
                                            <td className="py-6 text-right text-gray-600">{deliveryCharge.toFixed(2)}</td>
                                            <td className="py-6 text-right font-semibold text-gray-900">{deliveryCharge.toFixed(2)}</td>
                                        </tr>
                                        {parcel.paymentType === 'COD' && (
                                            <tr>
                                                <td className="py-6">
                                                    <p className="font-bold text-gray-900">COD Collection</p>
                                                    <p className="text-sm text-gray-500 mt-1">Cash on Delivery amount to be collected</p>
                                                </td>
                                                <td className="py-6 text-center text-gray-600">1</td>
                                                <td className="py-6 text-right text-gray-600">{codAmount.toFixed(2)}</td>
                                                <td className="py-6 text-right font-semibold text-gray-900">{codAmount.toFixed(2)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Section */}
                            <div className="flex justify-end mb-20">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} BDT</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax (0%)</span>
                                        <span>0.00 BDT</span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-4"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900 text-lg">Total Due</span>
                                        <span className="font-bold text-primary-600 text-2xl">{amountDue.toFixed(2)} BDT</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end pt-8 border-t border-gray-100">
                                <div className="text-xs text-gray-400 max-w-sm leading-relaxed">
                                    <p className="font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Instructions</p>
                                    <p>Please ensure payment is made by the due date. Checks should be made payable to LogisticsPro Inc.</p>
                                </div>
                                <div className="bg-white p-2 border border-gray-100 rounded-lg">
                                    {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={80} />}
                                </div>
                            </div>
                        </div>
                    </main>
                </>
            )}
        </section>,
        document.body
    );
}