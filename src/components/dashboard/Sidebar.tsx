'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Tab } from '@/components/common/BottomNavigation';
import { useClientTranslation } from '@/hooks/useClientTranslation';

import { useDispatch } from 'react-redux';
import { logoutUser } from '@/lib/authSlice';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/lib/store';

interface SidebarProps {
    tabs: Tab[];
}

export default function Sidebar({ tabs }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { t } = useClientTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const sidebarVariants = {
        expanded: { width: '280px' },
        collapsed: { width: '80px' },
    };

    return (
        <motion.aside
            initial="expanded"
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={sidebarVariants}
            className="hidden md:flex flex-col h-screen sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 ease-in-out shadow-sm"
        >
            {/* Header / Logo Area */}
            <div className="flex items-center justify-between p-6 h-20 border-b border-gray-100 dark:border-gray-800">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="font-bold text-2xl tracking-tighter text-primary-600 dark:text-primary-400 whitespace-nowrap overflow-hidden"
                        >
                            Logistics<span className="text-gray-800 dark:text-white">Pro</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto custom-scrollbar">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                }
              `}
                            title={isCollapsed ? tab.label : ''}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}

                            <div className={`min-w-[24px] ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'}`}>
                                {tab.icon}
                            </div>

                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="overflow-hidden whitespace-nowrap font-medium text-sm"
                                    >
                                        {tab.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout Area */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
                    title={t('logout')}
                >
                    <LogOut size={20} />
                    {!isCollapsed && (
                        <span className="font-medium text-sm">{t('logout')}</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
