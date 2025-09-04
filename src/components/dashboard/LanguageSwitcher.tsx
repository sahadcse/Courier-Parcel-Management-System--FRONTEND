'use client';

import { useClientTranslation } from '@/hooks/useClientTranslation';
import clsx from 'clsx';

// This could be imported from a central config file in a real-world app
const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'bn', label: 'BN' },
];

/**
 * A UI component that allows the user to switch the application language.
 * It's self-contained and manages its own state via the translation hook.
 */
export default function LanguageSwitcher() {
  const { i18n } = useClientTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div
      className="flex items-center space-x-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
      role="group"
      aria-label="Language selection"
    >
      {SUPPORTED_LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
          className={clsx(
            'rounded-md px-3 py-1 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
            // Use startsWith for broader matches like 'en-US'
            i18n.language.startsWith(code)
              ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-700 dark:text-primary-400'
              : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
          )}
          aria-pressed={i18n.language.startsWith(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}