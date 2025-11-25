import dynamic from 'next/dynamic';

export const LazyConversationManager = dynamic(
  () => import('@/components/chat/ConversationManager').then(mod => ({ default: mod.ConversationManager })),
  { loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" /> }
);

export const LazyAnalyticsCharts = dynamic(
  () => import('@/components/analytics/ConversationTrendsChart'),
  { loading: () => <div className="animate-pulse h-80 bg-gray-200 rounded" /> }
);

export const LazyMemoryBrowser = dynamic(
  () => import('@/app/(dashboard)/memory/page'),
  { loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded" /> }
);