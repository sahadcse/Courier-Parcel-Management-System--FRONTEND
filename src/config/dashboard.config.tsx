// src/config/dashboard.config.tsx
// Implement folder based routing for dashboard tabs

import { ShieldCheck, MapPinned, History, User, LineChart, Package, UserPlus, BookMarked, Search } from 'lucide-react';

// The generic Tab type is now simplified
export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Define tabs for each user role
export const DASHBOARD_TABS: {
  admin: NavTab[];
  agent: NavTab[];
  customer: NavTab[];
} = {
  admin: [
    { id: 'reports', label: 'Reports', href: '/admin', icon: <LineChart size={20} /> },
    { id: 'parcels', label: 'Parcels', href: '/admin/parcels', icon: <Package size={20} /> },
    { id: 'live_monitor', label: 'Live Monitor', href: '/admin/live_monitor', icon: <MapPinned size={20} /> },
    { id: 'users', label: 'Users', href: '/admin/users', icon: <User size={20} /> },
    { id: 'register_admin', label: 'New Admin', href: '/admin/register_admin', icon: <UserPlus size={20} /> },
    { id: 'profile', label: 'Profile', href: '/admin/profile', icon: <User size={20} /> },
  ],
  agent: [
    { id: 'active', label: 'Active', href: '/agent', icon: <ShieldCheck size={20} /> },
    { id: 'route', label: 'Route View', href: '/agent/route', icon: <MapPinned size={20} /> },
    { id: 'history', label: 'History', href: '/agent/history', icon: <History size={20} /> },
    { id: 'profile', label: 'Profile', href: '/agent/profile', icon: <User size={20} /> },
  ],
  customer: [
    { id: 'history', label: 'History', href: '/customer', icon: <History size={20} /> },
    { id: 'book', label: 'Book Parcel', href: '/customer/book', icon: <BookMarked size={20} /> },
    { id: 'track', label: 'Track', href: '/customer/track', icon: <Search size={20} /> },
    { id: 'profile', label: 'Profile', href: '/customer/profile', icon: <User size={20} /> },
  ],
};