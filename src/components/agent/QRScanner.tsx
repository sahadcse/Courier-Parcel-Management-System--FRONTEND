// components/agent/QRScanner.tsx

'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/esm/core';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  // Use a ref to hold the scanner instance to ensure we are always
  // interacting with the same object.
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const isInitializedRef = useRef(false);

  // Use refs to hold the latest callback props. This allows our useEffect
  // to have an empty dependency array but still call the latest functions.
  const onScanSuccessRef = useRef(onScanSuccess);
  onScanSuccessRef.current = onScanSuccess;

  useEffect(() => {

    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Initialize the scanner only if it doesn't exist yet.
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        /* verbose= */ false
      );
    }

    const scanner = scannerRef.current;

    const handleSuccess = (decodedText: string, decodedResult: Html5QrcodeResult) => {
      console.log(`QR Code detected: ${decodedText}`, decodedResult);
      // Use the ref to ensure the latest callback is called.
      onScanSuccessRef.current(decodedText);
      // Optionally, you can stop scanning after a successful scan.
      if (scannerRef.current) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };

    const handleError = (error: unknown) => {
      // We can ignore scan errors.
      // console.warn("QR Scan Error:", error);
    };

    // Start the scanner using the render method.
    // Add a check to ensure the DOM element exists before rendering
    const qrReaderElement = document.getElementById("qr-reader");
    if (qrReaderElement && scannerRef.current) {
      scanner.render(handleSuccess, handleError);
    }

    // This cleanup function will be called when the component unmounts.
    return () => {
      // Reset the flag on unmount
      isInitializedRef.current = false;
      // The clear() method is promise-based. We'll attach a catch
      // to handle potential errors during cleanup in strict mode.
      if (scannerRef.current) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };
  }, []); // <-- CRUCIAL: An empty dependency array.

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