'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Globe, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface InvitationData {
  email: string;
  role: string;
  country: string;
  invitedBy: string;
}

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (token) {
      verifyInvitation();
    }
  }, [token]);

  const verifyInvitation = async () => {
    try {
      const response = await api.get(`/admin/verify-invitation/${token}`);
      setInvitation(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Invalid or expired invitation');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setAccepting(true);
    try {
      const response = await api.post('/admin/accept-invitation', {
        token,
        name: formData.name,
        password: formData.password
      });

      toast.success('Account created successfully! You can now log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Invalid Invitation</h2>
          <p className="text-gray-600">This invitation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Country Admin';
      case 'moderator': return 'Moderator';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join HenMo AI Team
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You've been invited to join as an admin
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invitation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Role:</span>
                <Badge className={getRoleBadgeColor(invitation.role)}>
                  {getRoleDisplay(invitation.role)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Country:</span>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{invitation.country}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Invited by:</span>
                <span className="text-sm font-semibold">{invitation.invitedBy}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Henry Maobughichi Ugochukwu"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <Button 
                onClick={acceptInvitation} 
                disabled={accepting || !formData.name || !formData.password}
                className="w-full"
              >
                {accepting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Accept Invitation & Create Account
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By accepting this invitation, you agree to HenMo AI's terms of service
          </p>
        </div>
      </div>
    </div>
  );
}