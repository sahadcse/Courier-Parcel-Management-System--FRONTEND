'use client';

import AgentHistoryList from '@/components/agent/AgentHistoryList';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchParcels } from '@/lib/parcelSlice';

export default function AgentHistoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { parcels } = useSelector((state: RootState) => state.parcels);

  useEffect(() => {
    dispatch(fetchParcels());
  }, [dispatch]);

  return <AgentHistoryList parcels={parcels} />;
}
