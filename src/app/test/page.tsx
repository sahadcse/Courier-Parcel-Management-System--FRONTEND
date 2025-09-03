// src/app/test/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleTheme } from '@/lib/themeSlice';

interface HealthResponse {
  status: string;
  mongodb: string;
  timestamp: string;
}

export default function TestPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get<HealthResponse>(
          `${process.env.API_URL}/api/v1/health/check`,
        );
        setHealth(response.data);
        setError(null);
      } catch (_err) {
        setError('Failed to fetch health status');
        setHealth(null);
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-primary-500 dark:text-primary-300 mb-4">Test Page</h1>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="mb-4 bg-secondary-500 text-white px-4 py-2 rounded hover:bg-secondary-700"
      >
        Toggle Theme (Current: {mode})
      </button>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Backend Health Status
        </h2>
        {health ? (
          <div className="text-gray-700 dark:text-gray-300">
            <p>
              <strong>Status:</strong> {health.status}
            </p>
            <p>
              <strong>MongoDB:</strong> {health.mongodb}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-error">{error || 'Loading...'}</p>
        )}
      </div>
    </div>
  );
}
