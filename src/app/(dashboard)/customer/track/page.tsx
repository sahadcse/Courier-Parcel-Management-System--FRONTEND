'use client';

import { useSearchParams } from 'next/navigation';
import TrackParcel from '@/components/dashboard/TrackParcel';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialParcelId = searchParams.get('id');

  return (
    <div className="pb-20 sm:pb-0">
      <TrackParcel initialParcelId={initialParcelId} />
    </div>
  );
}
