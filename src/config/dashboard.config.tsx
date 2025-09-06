// src/config/dashboard.config.tsx

import { ShieldCheck, MapPinned, History, User, LineChart, Package, UserPlus, BookMarked, Search } from 'lucide-react';
import { Tab as NavTab } from '@/components/common/BottomNavigation';

// Define the tab IDs for each role
export type AdminTab = 'reports' | 'parcels' | 'register_admin' | 'users' | 'live_monitor' | 'profile';
export type AgentTab = 'active' | 'route' | 'history' | 'profile';
export type CustomerTab = 'history' | 'book' | 'track' | 'profile';

// Map each role to its specific navigation tabs
export const DASHBOARD_TABS: {
  admin: NavTab<AdminTab>[];
  agent: NavTab<AgentTab>[];
  customer: NavTab<CustomerTab>[];
} = {
  admin: [
    { id: 'reports', label: 'Reports', icon: <LineChart size={20} /> },
    { id: 'parcels', label: 'Parcels', icon: <Package size={20} /> },
    { id: 'live_monitor', label: 'Live Monitor', icon: <MapPinned size={20} /> },
    { id: 'users', label: 'Users', icon: <User size={20} /> },
    { id: 'register_admin', label: 'New Admin', icon: <UserPlus size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ],
  agent: [
    { id: 'active', label: 'Active', icon: <ShieldCheck size={20} /> },
    { id: 'route', label: 'Route View', icon: <MapPinned size={20} /> },
    { id: 'history', label: 'History', icon: <History size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ],
  customer: [
    { id: 'history', label: 'History', icon: <History size={20} /> },
    { id: 'book', label: 'Book Parcel', icon: <BookMarked size={20} /> },
    { id: 'track', label: 'Track', icon: <Search size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ],
};
