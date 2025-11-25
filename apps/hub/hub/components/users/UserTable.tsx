'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserActions } from './UserActions';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'pending';
  subscription: 'free' | 'pro' | 'enterprise';
  created_at: string;
  last_login?: string;
  usage_stats: {
    requests: number;
    conversations: number;
  };
}

interface UserTableProps {
  users: User[];
  onUserSelect: (user: User) => void;
  onUserAction: (userId: string, action: string, value?: any) => void;
}

export function UserTable({ users, onUserSelect, onUserAction }: UserTableProps) {
  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getSubscriptionBadge = (subscription: string) => {
    const colors = {
      enterprise: 'bg-purple-100 text-purple-800',
      pro: 'bg-blue-100 text-blue-800',
      free: 'bg-gray-100 text-gray-800'
    };
    return colors[subscription as keyof typeof colors] || colors.free;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Subscription</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Last Login</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getSubscriptionBadge(user.subscription)}>
                      {user.subscription}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{user.usage_stats.requests} requests</div>
                      <div className="text-gray-500">{user.usage_stats.conversations} chats</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUserSelect(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <UserActions user={user} onAction={onUserAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}