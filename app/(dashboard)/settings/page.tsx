'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { AIPreferences } from '@/components/settings/AIPreferences';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { Bell, Palette, Trash2, Download, AlertTriangle } from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface AISettings {
  openai_api_key?: string;
  anthropic_api_key?: string;
  default_provider: 'openai' | 'anthropic';
  default_model: string;
  temperature: number;
  max_tokens: number;
}

interface AppSettings {
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  auto_save: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Henry Maobughichi Ugochukwu',
    email: 'ugochukwuhenry16@gmail.com'
  });
  
  const [aiSettings, setAiSettings] = useState<AISettings>({
    default_provider: 'anthropic',
    default_model: 'claude-3-sonnet',
    temperature: 0.7,
    max_tokens: 2000
  });
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    notifications_enabled: true,
    theme: 'system',
    auto_save: true
  });
  
  const [subscription] = useState({
    tier: 'pro' as const,
    usage: { requests: 1250, limit: 5000 },
    features: [
      'Advanced AI Models',
      'Priority Support', 
      'Custom Integrations',
      'Team Collaboration'
    ],
    nextBilling: 'January 15, 2024'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedProfile = localStorage.getItem('user-profile');
    const savedAI = localStorage.getItem('ai-settings');
    const savedApp = localStorage.getItem('app-settings');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedAI) setAiSettings(JSON.parse(savedAI));
    if (savedApp) setAppSettings(JSON.parse(savedApp));
    
    // Track settings page access
    trackDevelopment(
      'Settings Page Enhancement',
      'Enhanced settings with profile, security, AI preferences, and subscription management',
      [
        'apps/hub/hub/components/settings/ProfileSettings.tsx',
        'apps/hub/hub/components/settings/SecuritySettings.tsx',
        'apps/hub/hub/components/settings/AIPreferences.tsx',
        'apps/hub/hub/components/settings/SubscriptionCard.tsx',
        'apps/hub/hub/app/(dashboard)/settings/page.tsx'
      ],
      'feature'
    );
  }, []);

  const handleProfileSave = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('user-profile', JSON.stringify(newProfile));
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password changed');
  };

  const handleAISave = async (newSettings: AISettings) => {
    setAiSettings(newSettings);
    localStorage.setItem('ai-settings', JSON.stringify(newSettings));
    alert('AI settings saved!');
  };

  const handleUpgrade = () => {
    alert('Upgrade functionality would redirect to billing');
  };

  const handleExportData = () => {
    const data = { profile, aiSettings, appSettings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'henmo-ai-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('This will clear all conversations and memories. Continue?')) {
      localStorage.removeItem('memories');
      localStorage.removeItem('conversations');
      alert('Data cleared successfully');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('This will permanently delete your account. This cannot be undone. Continue?')) {
      alert('Account deletion would be processed');
    }
  };



  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileSettings profile={profile} onSave={handleProfileSave} />
            <SubscriptionCard subscription={subscription} onUpgrade={handleUpgrade} />
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="max-w-md">
            <SecuritySettings onPasswordChange={handlePasswordChange} />
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="max-w-2xl">
            <AIPreferences settings={aiSettings} onSave={handleAISave} />
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about important events</p>
                </div>
                <Switch
                  checked={appSettings.notifications_enabled}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...appSettings, notifications_enabled: checked };
                    setAppSettings(newSettings);
                    localStorage.setItem('app-settings', JSON.stringify(newSettings));
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-save Development</Label>
                  <p className="text-sm text-gray-600">Automatically track code changes</p>
                </div>
                <Switch
                  checked={appSettings.auto_save}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...appSettings, auto_save: checked };
                    setAppSettings(newSettings);
                    localStorage.setItem('app-settings', JSON.stringify(newSettings));
                  }}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label>Theme</Label>
                <Select
                  value={appSettings.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') => {
                    const newSettings = { ...appSettings, theme: value };
                    setAppSettings(newSettings);
                    localStorage.setItem('app-settings', JSON.stringify(newSettings));
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full" onClick={handleClearData}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}