'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import QRScanner from '../QRScanner'; // Assuming QRScanner is in the same folder or path is updated

interface ActionHeaderProps {
  pendingCount: number;
  ongoingCount: number;
  onScanSuccess: (decodedText: string) => void;
}

export default function ActionHeader({ pendingCount, ongoingCount, onScanSuccess }: ActionHeaderProps) {
  const { t } = useClientTranslation();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const isRouteAvailable = useMemo(() => ongoingCount > 0, [ongoingCount]);

  // Logic for the dynamic scan button
  const isScanButtonDisabled = pendingCount === 0 && ongoingCount === 0;
  const scanButtonText = pendingCount > 0 ? t('scan_to_pickup') : t('scan_to_deliver');

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between p-2 rounded-lg gap-4">
        <h2 className="text-xl font-semibold">{t('active_deliveries')}</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <Link
            href="/agent/route"
            className={`bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors ${
              !isRouteAvailable ? 'opacity-50 pointer-events-none' : ''
            }`}
            aria-disabled={!isRouteAvailable}
            onClick={(e) => {
              if (!isRouteAvailable) e.preventDefault();
            }}
          >
            {t('view_optimized_route')}
          </Link>
          <button
            onClick={() => setIsScannerOpen(true)}
            disabled={isScanButtonDisabled}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {scanButtonText}
          </button>
        </div>
      </div>
      {/* QR Scanner Modal is now coupled with the header that opens it */}
      {isScannerOpen && <QRScanner onScanSuccess={onScanSuccess} onClose={() => setIsScannerOpen(false)} />}
    </>
  );
}