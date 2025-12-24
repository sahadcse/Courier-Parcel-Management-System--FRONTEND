// src/components/dashboard/UserProfile.tsx
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { AuthUser } from '@/lib/authSlice';
import { User, Mail, Phone, MapPin, Shield, Calendar, Edit3, Camera, CheckCircle2, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (reduxUser && reduxUser._id) {
      setCurrentUser(reduxUser);
    } else {
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        setCurrentUser(JSON.parse(localUserStr));
      }
    }
  }, [reduxUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <div className="absolute inset-0 bg-primary-600/20 blur-xl rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">

      {/* --- Profile Header Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Banner with Gradient Mesh */}
        <div className="h-48 md:h-60 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="absolute top-6 right-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold transition-all group">
              <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
              <span>Edit Cover</span>
            </button>
          </div>
        </div>

        <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 md:-mt-20 relative z-10">
          {/* Avatar Frame */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white dark:bg-gray-800 p-1.5 shadow-2xl skew-y-0 text-white transform rotate-3 transition-transform group-hover:rotate-0 duration-300">
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center text-4xl theme-font font-bold uppercase overflow-hidden relative">
                {currentUser.customerName?.charAt(0) || 'U'}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-[2px]">
                  <Camera size={24} />
                </div>
              </div>
            </div>
            {currentUser.isActive && (
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg" title="Verified Customer">
                <CheckCircle2 className="text-emerald-500 fill-emerald-100 dark:fill-emerald-900" size={28} />
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-3">
              {currentUser.customerName}
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 uppercase tracking-wider align-middle">
                {currentUser.role}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
              <Mail size={16} /> {currentUser.email}
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg shadow-gray-200/50 dark:shadow-none hover:transform hover:-translate-y-1 transition-all">
              View Parcels
            </button>
          </div>
        </div>
      </motion.div>


      {/* --- Details Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Personal Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-8 relative z-10">
              <User className="text-primary-500" size={20} /> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={12} /> Phone Number
                </label>
                <p className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
                  {currentUser.phone || 'Not provided'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} /> Address
                </label>
                <p className="font-semibold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-2">
                  {currentUser.address || 'Not provided'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} /> Account ID
                </label>
                <p className="font-mono font-medium text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700/50 py-2 px-3 rounded-lg inline-block">
                  {currentUser._id}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} /> Joined Date
                </label>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                  October 24, 2024
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Section (Dummy for visual) */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Preferences</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-primary-200 transition-colors">
                <div className="active-toggle w-12 h-7 bg-primary-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-xs text-gray-500">Receive tracking updates via email</p>
                </div>
              </div>
              <div className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-primary-200 transition-colors">
                <div className="w-12 h-7 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">SMS Alerts</h4>
                  <p className="text-xs text-gray-500">Get text messages for delivery</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Col: Stats & Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 text-center">
              <p className="text-indigo-200 font-medium mb-2 uppercase tracking-widest text-xs">Total Parcels Booked</p>
              <h3 className="text-6xl font-bold mb-4 tracking-tighter">12</h3>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md text-sm font-medium border border-white/10">
                <Package size={14} /> <span>12 Delivered</span>
              </div>
            </div>
            {/* Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              Security Check
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-gray-600 dark:text-gray-300">Email Verified</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-gray-600 dark:text-gray-300">Phone Verified</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-50">
                <Clock size={18} className="text-gray-400" />
                <span className="text-gray-500">2FA Enabled</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Manage Security
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
