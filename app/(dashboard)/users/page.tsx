'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserTable } from '@/components/users/UserTable';
import { UserDetailModal } from '@/components/users/UserDetailModal';
import { Users, Search, Filter, Download } from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
    trackDevelopment(
      'User Management Page',
      'Admin-only user management with search, filters, pagination, and user actions',
      [
        'apps/hub/hub/app/(dashboard)/users/page.tsx',
        'apps/hub/hub/components/users/UserTable.tsx',
        'apps/hub/hub/components/users/UserDetailModal.tsx',
        'apps/hub/hub/components/users/UserActions.tsx'
      ],
      'feature'
    );
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = () => {
    // Demo data
    const demoUsers: User[] = [
      {
        id: '1',
        name: 'Henry Maobughichi Ugochukwu',
        email: 'ugochukwuhenry16@gmail.com',
        role: 'super_admin',
        status: 'active',
        subscription: 'enterprise',
        created_at: '2024-01-01',
        last_login: '2024-01-15',
        usage_stats: { requests: 2500, conversations: 150 }
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        subscription: 'pro',
        created_at: '2024-01-05',
        last_login: '2024-01-14',
        usage_stats: { requests: 1200, conversations: 80 }
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'moderator',
        status: 'active',
        subscription: 'pro',
        created_at: '2024-01-10',
        last_login: '2024-01-13',
        usage_stats: { requests: 800, conversations: 45 }
      },
      {
        id: '4',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        role: 'user',
        status: 'suspended',
        subscription: 'free',
        created_at: '2024-01-12',
        usage_stats: { requests: 50, conversations: 5 }
      }
    ];
    setUsers(demoUsers);
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleUserAction = (userId: string, action: string, value?: any) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'changeRole':
            return { ...user, role: value };
          case 'suspend':
            return { ...user, status: 'suspended' };
          case 'activate':
            return { ...user, status: 'active' };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Subscription', 'Created', 'Requests', 'Conversations'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.subscription,
        user.created_at,
        user.usage_stats.requests,
        user.usage_stats.conversations
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <div className="text-sm text-gray-600">Suspended</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.subscription === 'pro' || u.subscription === 'enterprise').length}
            </div>
            <div className="text-sm text-gray-600">Premium</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <UserTable
        users={paginatedUsers}
        onUserSelect={setSelectedUser}
        onUserAction={handleUserAction}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserAction={handleUserAction}
        />
      )}
    </div>
  );
}