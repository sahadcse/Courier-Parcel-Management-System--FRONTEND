'use client';

import { useRouter } from 'next/navigation';
import ParcelHistory from '@/components/dashboard/ParcelHistory';

export default function HistoryPage() {
  const router = useRouter();

  // When a user clicks "Track" in the history list, navigate them to the track page.
  const handleTrackRequest = (parcelId: string) => {
    // Pass the parcelId as a search parameter in the URL.
    router.push(`/customer/track?id=${parcelId}`);
  };

  return <ParcelHistory onTrackClick={handleTrackRequest} />;
}