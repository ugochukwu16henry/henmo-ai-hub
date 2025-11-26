'use client';

import dynamic from 'next/dynamic';
import { PageSkeleton } from '@/components/loading/PageSkeleton';

const ConversationManager = dynamic(
  () => import('@/components/chat/ConversationManager').then(mod => ({ default: mod.ConversationManager })),
  { loading: () => <PageSkeleton /> }
);

export default function ChatPage() {
  return <ConversationManager />;
}