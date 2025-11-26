'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Twitter, Linkedin, Github, Youtube, Instagram, Facebook } from 'lucide-react';

interface SocialHandle {
  platform: string;
  username: string;
  url: string;
  active: boolean;
}

export default function SocialMediaPage() {
  const [handles, setHandles] = useState<SocialHandle[]>([
    { platform: 'Twitter', username: '@henmoai', url: 'https://twitter.com/henmoai', active: true },
    { platform: 'LinkedIn', username: 'henmoai', url: 'https://linkedin.com/company/henmoai', active: true },
    { platform: 'GitHub', username: 'henmoai', url: 'https://github.com/henmoai', active: true },
    { platform: 'YouTube', username: '@henmoai', url: 'https://youtube.com/@henmoai', active: true },
    { platform: 'Instagram', username: '@henmoai', url: 'https://instagram.com/henmoai', active: true },
    { platform: 'Facebook', username: 'henmoai', url: 'https://facebook.com/henmoai', active: false }
  ]);

  const updateHandle = (index: number, field: keyof SocialHandle, value: string | boolean) => {
    const updated = [...handles];
    updated[index] = { ...updated[index], [field]: value };
    setHandles(updated);
  };

  const saveHandles = async () => {
    try {
      await fetch('/api/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(handles)
      });
    } catch (error) {
      console.error('Failed to save social handles:', error);
    }
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter': return <Twitter className="h-5 w-5" />;
      case 'LinkedIn': return <Linkedin className="h-5 w-5" />;
      case 'GitHub': return <Github className="h-5 w-5" />;
      case 'YouTube': return <Youtube className="h-5 w-5" />;
      case 'Instagram': return <Instagram className="h-5 w-5" />;
      case 'Facebook': return <Facebook className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Media Management</h1>
        <Button onClick={saveHandles}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {handles.map((handle, index) => (
          <Card key={handle.platform}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon(handle.platform)}
                {handle.platform}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={handle.username}
                  onChange={(e) => updateHandle(index, 'username', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={handle.url}
                  onChange={(e) => updateHandle(index, 'url', e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={handle.active}
                  onChange={(e) => updateHandle(index, 'active', e.target.checked)}
                />
                <label className="text-sm font-medium">Show on website</label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}