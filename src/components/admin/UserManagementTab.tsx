'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchAllUsers, updateAgentStatus, User } from '@/lib/adminSlice';
import UserDetailsModal from './UserDetailsModal';
import { UserCircle, ChevronDown } from 'lucide-react';

// --- Helper Components ---
const UserCardSkeleton = () => (
    <div className="flex animate-pulse items-center justify-between rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
        </div>
        <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>
);
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${enabled ? 'bg-primary-600' : 'bg-red-500 dark:bg-gray-700'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);


// --- UserCard Component ---
const UserCard = ({ user, onStatusToggle, onViewDetails }: {
  user: User;
  onStatusToggle?: (id: string, status: boolean) => void;
  onViewDetails: (user: User) => void;
}) => {
  const roleStyles = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
    agent: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
    customer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  const currentRoleStyle = roleStyles[user.role || 'customer'];

  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:max-w-[50%]">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Side: User Info */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 text-white dark:text-gray-400 hidden md:inline-block">
            <UserCircle size={40} strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 dark:text-white">{user.customerName}</p>
              <span className={`hidden whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium sm:inline-block ${currentRoleStyle}`}>
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        
        {/* Right Side: Actions */}
        <div className="flex w-full items-center justify-between border-t pt-4 dark:border-gray-600 sm:w-auto sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
          {user.role === 'agent' && onStatusToggle && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${user.isActive ? 'text-green-500' : 'text-yellow-500'}`}>
                {user.isActive ? 'Active' : 'Pending'}
              </span>
              <ToggleSwitch enabled={user.isActive} onChange={() => onStatusToggle(user._id, user.isActive)} />
            </div>
          )}
          <button 
            onClick={() => onViewDetails(user)} 
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main User Management Component ---
export default function UserManagementTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.admin);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // State for desktop tabs
  const [activeTab, setActiveTab] = useState<'agents' | 'admins' | 'customers'>('agents');
  // State for mobile accordion
  const [openAccordion, setOpenAccordion] = useState<'agents' | 'admins' | 'customers' | null>('agents');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleStatusToggle = (agentId: string, currentStatus: boolean) => {
    dispatch(updateAgentStatus({ agentId, isActive: !currentStatus }));
  };

  const { admins, agents, customers } = useMemo(() => ({
    admins: users.filter(user => user.role === 'admin'),
    agents: users.filter(user => user.role === 'agent'),
    customers: users.filter(user => user.role === 'customer'),
  }), [users]);
  
  const TABS = {
    agents: { title: 'Agents', data: agents },
    admins: { title: 'Administrators', data: admins },
    customers: { title: 'Customers', data: customers },
  };

  const renderUserList = (userList: User[]) => {
    if (loading === 'pending') {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <UserCardSkeleton key={i} />)}
        </div>
      );
    }
    if (userList.length === 0) {
      return <p className="py-8 text-center text-gray-500 dark:text-gray-400">No users found in this category.</p>;
    }
    return (
      <div className="space-y-4">
        {userList.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onStatusToggle={user.role === 'agent' ? handleStatusToggle : undefined}
            onViewDetails={setSelectedUser}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mt-4">
      {/* --- Desktop Tabs (Hidden on small screens) --- */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {(Object.keys(TABS) as Array<keyof typeof TABS>).map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === tabKey
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {TABS[tabKey].title} ({TABS[tabKey].data.length})
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-6">{renderUserList(TABS[activeTab].data)}</div>
      </div>

      {/* --- Mobile Accordion (Hidden on large screens) --- */}
      <div className="space-y-2 sm:hidden">
        {(Object.keys(TABS) as Array<keyof typeof TABS>).map(tabKey => {
            const isOpen = openAccordion === tabKey;
            return (
                <div key={tabKey} className="overflow-hidden rounded-lg border dark:border-gray-700 dark:bg-gray-800">
                    <button
                        onClick={() => setOpenAccordion(isOpen ? null : tabKey)}
                        className="flex w-full items-center justify-between p-4 text-left font-semibold"
                    >
                        <span>{TABS[tabKey].title} ({TABS[tabKey].data.length})</span>
                        <ChevronDown
                            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            size={20}
                        />
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
                    >
                        <div className="border-t p-4 dark:border-gray-700">
                            {renderUserList(TABS[tabKey].data)}
                        </div>
                    </div>
                </div>
            )
        })}
      </div>

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </section>
  );
}