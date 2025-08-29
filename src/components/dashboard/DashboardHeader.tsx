'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import LogoutButton from '@/components/auth/LogoutButton';
// import { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function DashboardHeader() {
    const { t, i18n } = useClientTranslation(); 
  const { user } = useSelector((state: RootState) => state.auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left Side: Title and Welcome Message */}
      <div>
        {/* 3. You can now use the 't' function directly and safely. */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('dashboard_title')}
        </h1>
        {user?.customerName && (
          <p className="text-gray-500 dark:text-gray-400">
            {t('welcome_message', { name: user.customerName })}
          </p>
        )}
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-12">
        {/* Language Switcher */}
        <div className="flex gap-2 text-sm">
          <button 
            onClick={() => changeLanguage('en')} 
            className={`cursor-pointer ${i18n.language === 'en' ? 'font-bold text-primary-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            EN
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => changeLanguage('bn')} 
            className={`cursor-pointer ${i18n.language === 'bn' ? 'font-bold text-primary-500' : 'text-gray-500 hover:text-gray-800'}`}
          >
            BN
          </button>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
