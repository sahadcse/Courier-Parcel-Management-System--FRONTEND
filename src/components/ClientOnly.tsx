'use client';

import { useState, useEffect } from 'react';

// This component will only render its children on the client side
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Render nothing on the server and during the initial client hydration
  }

  return <>{children}</>;
}