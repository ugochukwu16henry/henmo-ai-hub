'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, User, Mail, Calendar, Activity, MessageSquare, Zap } from 'lucide-react';

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

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUserAction: (userId: string, action: string, value?: any) => void;
}

export function UserDetailModal({ user, onClose, onUserAction }: UserDetailModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge className={getRoleBadge(user.role)}>
                {user.role.replace('_', ' ')}
              </Badge>
              <Badge className={getStatusBadge(user.status)}>
                {user.status}
              </Badge>
              <Badge variant="outline">
                {user.subscription}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Account Created
              </h4>
              <p className="text-sm text-gray-600">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Last Login
              </h4>
              <p className="text-sm text-gray-600">
                {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div>
            <h4 className="font-medium mb-4">Usage Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">API Requests</span>
                  </div>
                  <div className="text-2xl font-bold">{user.usage_stats.requests}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Conversations</span>
                  </div>
                  <div className="text-2xl font-bold">{user.usage_stats.conversations}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            {user.status === 'active' ? (
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm(`Suspend ${user.name}?`)) {
                    onUserAction(user.id, 'suspend');
                    onClose();
                  }
                }}
              >
                Suspend User
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  onUserAction(user.id, 'activate');
                  onClose();
                }}
              >
                Activate User
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}