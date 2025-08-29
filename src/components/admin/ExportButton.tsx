'use client';

import { CSVLink } from 'react-csv';
import { Parcel } from '@/types';

export default function ExportButton({ data }: { data: Parcel[] }) {
  const headers = [
    { label: 'Tracking ID', key: 'parcelId' },
    { label: 'Status', key: 'status' },
    { label: 'Receiver Name', key: 'receiverName' },
    { label: 'Delivery Address', key: 'deliveryAddress' },
    { label: 'Payment Type', key: 'paymentType' },
    { label: 'COD Amount', key: 'codAmount' },
    { label: 'Created At', key: 'createdAt' },
  ];

  const formattedData = data.map(parcel => ({
    ...parcel,
    createdAt: new Date(parcel.createdAt).toLocaleDateString(),
  }));

  return (
    <CSVLink
      data={formattedData}
      headers={headers}
      filename={"parcel-report.csv"}
      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
    >
      Export as CSV
    </CSVLink>
  );
}