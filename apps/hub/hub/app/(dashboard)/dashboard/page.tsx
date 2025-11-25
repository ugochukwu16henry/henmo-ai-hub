'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Brain, Users, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  total_conversations: number;
  total_messages: number;
  total_tokens: number;
  active_conversations: number;
  total_memories: number;
  notes: number;
  code_snippets: number;
}

export default function DashboardPage() {
  const [conversationStats, setConversationStats] = useState<Stats | null>(null);
  const [memoryStats, setMemoryStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [convResponse, memResponse] = await Promise.all([
          api.get('/conversations/stats'),
          api.get('/memory/stats'),
        ]);

        setConversationStats((convResponse.data as any).data);
        setMemoryStats((memResponse.data as any).data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Conversations"
            value={conversationStats?.total_conversations || 0}
            description={`${conversationStats?.active_conversations || 0} active`}
            icon={<MessageSquare className="h-4 w-4 text-blue-600" />}
            loading={loading}
          />
          <StatsCard
            title="Total Messages"
            value={conversationStats?.total_messages || 0}
            description="AI interactions"
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            loading={loading}
          />
          <StatsCard
            title="Memory Items"
            value={memoryStats?.total_memories || 0}
            description={`${memoryStats?.notes || 0} notes, ${memoryStats?.code_snippets || 0} code`}
            icon={<Brain className="h-4 w-4 text-purple-600" />}
            loading={loading}
          />
          <StatsCard
            title="Tokens Used"
            value={conversationStats?.total_tokens || 0}
            description="Across all conversations"
            icon={<Users className="h-4 w-4 text-orange-600" />}
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                title="New AI Chat"
                description="Start a conversation with ChatBoss"
                href="/chat"
              />
              <QuickAction
                title="Add Memory"
                description="Store a note or code snippet"
                href="/memory"
              />
              <QuickAction
                title="View History"
                description="Browse past conversations"
                href="/chat"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>API and services health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusItem label="API Connection" status="online" />
              <StatusItem label="AI Providers" status="online" />
              <StatusItem label="Memory System" status="online" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <p className="text-xs text-gray-600">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border p-3 transition-colors hover:bg-gray-50"
    >
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}

function StatusItem({
  label,
  status,
}: {
  label: string;
  status: 'online' | 'offline';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status === 'online' ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>
    </div>
  );
}