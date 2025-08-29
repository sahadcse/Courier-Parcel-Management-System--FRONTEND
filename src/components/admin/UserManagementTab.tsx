'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchAllUsers, updateAgentStatus, User } from '@/lib/adminSlice';
import UserDetailsModal from './UserDetailsModal'; // Import the new modal

// Reusable component for a list of users with an improved design
const UserList = ({ title, users, onStatusToggle, onViewDetails }: { 
  title: string; 
  users: User[]; 
  onStatusToggle?: (id: string, status: boolean) => void;
  onViewDetails: (user: User) => void;
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold border-b pb-2 mb-4 dark:border-gray-700">{title} ({users.length})</h3>
      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No users found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{user.customerName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button onClick={() => onViewDetails(user)} className="text-xs text-blue-500 hover:underline">Details</button>
              </div>
              {user.role === 'agent' && onStatusToggle && (
                <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.isActive ? 'Active' : 'Pending'}
                  </span>
                  <button
                    onClick={() => onStatusToggle(user._id, user.isActive)}
                    className={`px-3 py-1 text-xs rounded text-white ${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UserManagementTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.admin);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for the modal

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

  if (loading === 'pending') return <p>Loading users...</p>;

  return (
    <>
      <div>
        <UserList title="Administrators" users={admins} onViewDetails={setSelectedUser} />
        <UserList title="Agents" users={agents} onStatusToggle={handleStatusToggle} onViewDetails={setSelectedUser} />
        <UserList title="Customers" users={customers} onViewDetails={setSelectedUser} />
      </div>

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
}
