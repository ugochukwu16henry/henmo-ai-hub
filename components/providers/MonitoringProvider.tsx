'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { initSentry, initLogRocket, initPostHog, identifyUser } from '@/lib/monitoring';

export default function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize monitoring tools
    initSentry();
    initLogRocket();
    initPostHog();
  }, []);

  useEffect(() => {
    // Identify user when logged in
    if (user) {
      identifyUser(user.id, {
        email: user.email,
        role: user.role,
        username: user.username
      });
    }
  }, [user]);

  return <>{children}</>;
}