'use client';

import { useEffect } from 'react';
import { setupExtensionAttributeObserver } from '../utils/extensionUtils';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    // Setup observer to clean up browser extension attributes
    const observer = setupExtensionAttributeObserver();

    // Cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return <>{children}</>;
}
