'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchAnalyticsData } from '@/lib/adminSlice';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <div className="bg-white p-4 rounded-lg shadow dark:text-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mb-4">
    <div className="flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminAnalyticsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports: analyticsData, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAnalyticsData());
  }, [dispatch]);


  const { totalCod, failedDeliveries } = useMemo(() => {
    if (!analyticsData?.statusStats) return { totalCod: 0, failedDeliveries: 0 };

    const failedStat = analyticsData.statusStats.find(s => s._id === 'Failed');
    const failedDeliveries = failedStat ? failedStat.count : 0;
    
    const totalCod = analyticsData.statusStats.reduce((acc, stat) => acc + stat.totalCodAmount, 0);

    return { totalCod, failedDeliveries };
  }, [analyticsData]);

  if (loading === 'pending' || !analyticsData) return <p>Loading analytics...</p>;



  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };


  const barChartData = {
    labels: analyticsData.dailyBookings.map(d => d._id),
    datasets: [
      {
        label: 'Daily Bookings',
        data: analyticsData.dailyBookings.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: analyticsData.statusStats.map(s => s._id),
    datasets: [
      {
        label: 'Parcel Status Count',
        data: analyticsData.statusStats.map(s => s.count),
        backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'],
      },
    ],
  };

  return (
    <div className="space-y- mt-4">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <StatCard title="Total COD Amount" value={`${totalCod} BDT`} icon="💰" />
        <StatCard title="Failed Deliveries" value={failedDeliveries} icon="❌"/>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <div className="bg-white p-4 rounded-lg shadow dark:text-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-2">Daily Bookings (Last 7 Days)</h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:text-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-2 text-center">Parcel Status Distribution</h3>
          <div className="relative mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }}>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
