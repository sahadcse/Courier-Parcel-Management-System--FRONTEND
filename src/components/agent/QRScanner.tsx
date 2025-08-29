'use client';

import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const onScanSuccessRef = useRef(onScanSuccess);
  onScanSuccessRef.current = onScanSuccess;

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("qr-reader");

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const startScan = async () => {
      try {
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.start(
            { facingMode: "environment" }, // Prefers back camera; adjust if needed
            config,
            (decodedText) => {
              onScanSuccessRef.current(decodedText);
            },
            (errorMessage) => {
              // Ignore scan errors (scanner will retry)
            }
          );
          isRunningRef.current = true;
        }
      } catch (err) {
        console.error("Failed to start QR scanner:", err);
      }
    };

    startScan();

    return () => {
      if (isRunningRef.current && html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            isRunningRef.current = false;
          })
          .catch((err) => {
            console.error("Failed to stop QR scanner:", err);
          });
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-sm">
        <div id="qr-reader" className="w-full"></div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Cancel Scan
        </button>
      </div>
    </div>
  );
}