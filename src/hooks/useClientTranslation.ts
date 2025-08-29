// hooks/useClientTransation.ts

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TOptions } from 'i18next'; // 1. Import the correct type for options

export function useClientTranslation() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2. Use the specific 'TOptions' type for the options parameter
  const tSafe = (key: string, options?: TOptions) => {
    // 3. If the component is rendering on the server, return an empty string
    //    or a simple placeholder to prevent a hydration mismatch.
    if (!isClient) {
      return '';
    }
    // Once on the client, use the real translation function.
    return t(key, options);
  };

  return {
    t: tSafe,
    i18n,
    isClient,
  };
}
