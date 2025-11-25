'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, UserCheck, UserX, Shield, Ban } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'suspended' | 'pending';
}

interface UserActionsProps {
  user: User;
  onAction: (userId: string, action: string, value?: any) => void;
}

export function UserActions({ user, onAction }: UserActionsProps) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const handleRoleChange = (newRole: string) => {
    onAction(user.id, 'changeRole', newRole);
    setShowRoleSelect(false);
  };

  const handleSuspend = () => {
    if (confirm(`Suspend ${user.name}?`)) {
      onAction(user.id, 'suspend');
    }
  };

  const handleActivate = () => {
    onAction(user.id, 'activate');
  };

  if (showRoleSelect) {
    return (
      <Select value={user.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setShowRoleSelect(true)}>
          <Shield className="w-4 h-4 mr-2" />
          Change Role
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {user.status === 'active' ? (
          <DropdownMenuItem onClick={handleSuspend} className="text-red-600">
            <UserX className="w-4 h-4 mr-2" />
            Suspend User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleActivate} className="text-green-600">
            <UserCheck className="w-4 h-4 mr-2" />
            Activate User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}