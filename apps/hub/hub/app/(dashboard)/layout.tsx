'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Suspense, useEffect } from 'react';
import { initGlobalPerformance, optimizeForRegion } from '@/lib/global-performance';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGlobalPerformance()
    optimizeForRegion()
  }, [])

  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        {children}
      </Suspense>
    </DashboardLayout>
  );
}