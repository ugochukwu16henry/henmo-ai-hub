'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Mail, Trash2, Copy, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  role: string;
  country: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
  invited_by_name: string;
}

const countries = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Uganda', 'Tanzania'
];

export default function InvitationsPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'moderator',
    country: ''
  });

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get('/admin/invitations');
      setInvitations(response.data.data.invitations);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    try {
      const response = await api.post('/admin/invitations', formData);
      const { invitation, invitationUrl } = response.data.data;
      
      toast.success('Invitation sent successfully!');
      
      // Copy invitation URL to clipboard
      navigator.clipboard.writeText(invitationUrl);
      toast.info('Invitation link copied to clipboard');
      
      setInvitations([invitation, ...invitations]);
      setShowDialog(false);
      setFormData({ email: '', role: 'moderator', country: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to send invitation');
    }
  };

  const cancelInvitation = async (id: string) => {
    try {
      await api.delete(`/admin/invitations/${id}`);
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast.success('Invitation cancelled');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to cancel invitation');
    }
  };

  const copyInvitationLink = (token: string) => {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Invitation link copied to clipboard');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="text-gray-600">Manage admin and moderator invitations</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Admin Invitation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    {user.role === 'super_admin' && (
                      <SelectItem value="admin">Country Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={sendInvitation} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No invitations</h3>
              <p className="text-gray-600">Send your first invitation to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleBadgeColor(invitation.role)}>
                            {invitation.role}
                          </Badge>
                          <Badge variant="outline">{invitation.country}</Badge>
                          {invitation.used && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Invited by {invitation.invited_by_name} • 
                          Expires {new Date(invitation.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!invitation.used && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyInvitationLink(invitation.token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelInvitation(invitation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}