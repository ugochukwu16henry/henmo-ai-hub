'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Brain, 
  Settings, 
  LayoutDashboard,
  Users,
  UserPlus,
  Shield,
  Globe
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Memory', href: '/memory', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
  { name: 'Invitations', href: '/admin/invitations', icon: UserPlus },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const isAdmin = user && ['admin', 'super_admin'].includes(user.role);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">HenMo AI</h2>
          {user && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <div className="flex items-center mt-1">
                <Badge variant={user.role === 'super_admin' ? 'destructive' : 'secondary'}>
                  {user.role === 'super_admin' ? 'Super Admin' : 
                   user.role === 'admin' ? 'Country Admin' : 
                   user.role === 'moderator' ? 'Moderator' : 'User'}
                </Badge>
                {user.assigned_country && (
                  <div className="flex items-center ml-2 text-xs text-gray-500">
                    <Globe className="h-3 w-3 mr-1" />
                    {user.assigned_country}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <nav className="px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {isAdmin && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </p>
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}