'use client';

import { ReactNode, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  Globe,
  LogOut,
  BookOpen,
  Code2,
  BarChart3,
  Camera,
  Award,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'AI Tools', href: '/ai-tools', icon: Brain },
  { name: 'Learning', href: '/learning', icon: BookOpen },
  { name: 'Development', href: '/development', icon: Code2 },
  { name: 'Memory', href: '/memory', icon: Brain },
  { name: 'Notes & Upgrades', href: '/notes', icon: BookOpen },
  { name: 'Plugins', href: '/plugins', icon: Code2 },
  { name: 'VS Code', href: '/vscode', icon: Code2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Streets', href: '/streets', icon: Camera },
  { name: 'Contributor', href: '/contributor', icon: Award },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
  { name: 'Invitations', href: '/admin/invitations', icon: UserPlus },
  { name: 'Finance', href: '/finance', icon: DollarSign },
];

const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  // Skip auth check for now
  // if (!isLoading && !isAuthenticated) {
  //   window.location.href = '/login';
  //   return null;
  // }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
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
          
          <div className="absolute bottom-4 left-3 right-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
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
});

export { DashboardLayout };