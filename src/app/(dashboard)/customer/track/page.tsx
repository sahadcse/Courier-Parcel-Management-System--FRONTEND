'use client';

import { useSearchParams } from 'next/navigation';
import TrackParcel from '@/components/dashboard/TrackParcel';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialParcelId = searchParams.get('id');

  return (
    <div className="">
      <TrackParcel initialParcelId={initialParcelId} />
    </div>
  );
}
