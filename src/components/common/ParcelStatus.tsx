'use client';

import { Parcel } from '@/types';

// Helper component for individual timeline steps
const TimelineStep = ({
  icon,
  label,
  isCompleted,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}) => {
  const textColor = isActive || isCompleted ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500';
  const iconColor = isCompleted ? 'bg-primary-500 text-white' : isActive ? 'bg-primary-500 text-white ring-4 ring-primary-200 dark:ring-primary-900/50' : 'bg-gray-200 dark:bg-gray-700 text-gray-500';

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${iconColor}`}>
        {icon}
      </div>
      <p className={`mt-2 text-xs font-semibold transition-colors duration-300 ${textColor}`}>{label}</p>
    </div>
  );
};

// Main component
export default function StatusTimeline({ status }: { status: Parcel['status'] }) {
  const allStatuses = ['Booked', 'Assigned', 'Picked Up', 'In Transit', 'Delivered'];
  const statusOrder = { 'Booked': 0, 'Assigned': 1, 'Picked Up': 2, 'In Transit': 3, 'Delivered': 4, 'Failed': -1 };
  const currentStatusIndex = statusOrder[status] ?? -1;

  // Icons for each status
  const icons = {
    Booked: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    Assigned: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>,
    'Picked Up': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H12a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" /></svg>,
    'In Transit': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h3.97a1 1 0 00.93-.64l1.5-4A1 1 0 0017 4H3z" /></svg>,
    Delivered: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
  };

  return (
    <div>
      <div className="flex items-center">
        {allStatuses.map((s, index, arr) => {
          const isActive = index === currentStatusIndex;
          const isCompleted = index < currentStatusIndex;
          const lineClass = isCompleted ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700';

          return (
            <div key={s} className="flex items-center w-full">
              <TimelineStep
                label={s}
                icon={icons[s as keyof typeof icons]}
                isActive={isActive}
                isCompleted={isCompleted}
              />
              {index < arr.length - 1 && (
                <div className={`flex-auto h-1 rounded transition-colors duration-500 ${lineClass}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {status === 'Failed' && (
        <div className="text-center mt-4 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg text-sm font-semibold">
          Delivery Failed
        </div>
      )}
    </div>
  );
}