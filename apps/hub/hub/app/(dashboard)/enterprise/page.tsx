'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, FileText, Clock, Users, Building, Settings, CheckCircle } from 'lucide-react';

export default function EnterprisePage() {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [auditLogs] = useState([
    { id: '1', action: 'User Login', user: 'john.doe@company.com', timestamp: '2026-03-15 09:30:00', ip: '192.168.1.100' },
    { id: '2', action: 'Model Access', user: 'jane.smith@company.com', timestamp: '2026-03-15 09:25:00', ip: '192.168.1.101' },
    { id: '3', action: 'Data Export', user: 'admin@company.com', timestamp: '2026-03-15 09:20:00', ip: '192.168.1.102' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Features</h1>
          <p className="text-gray-600 mt-2">Advanced security, compliance, and management tools</p>
        </div>
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Enterprise Plan
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">99.9%</div>
            <div className="text-sm text-gray-600">SLA Uptime</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">SOC 2</div>
            <div className="text-sm text-gray-600">Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">GDPR</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sso" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sso">SSO & Auth</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="branding">White Label</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Single Sign-On (SSO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>SSO Status</span>
                    <Badge variant={ssoEnabled ? 'default' : 'secondary'}>
                      {ssoEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SAML 2.0 Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">OAuth 2.0 / OpenID Connect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Active Directory Integration</span>
                    </div>
                  </div>
                  <Button onClick={() => setSsoEnabled(!ssoEnabled)}>
                    {ssoEnabled ? 'Configure SSO' : 'Enable SSO'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-Factor Authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">IP Whitelisting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Advanced Encryption</span>
                    </div>
                  </div>
                  <Button variant="outline">Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Log Retention: 7 years</span>
                  <Button size="sm" variant="outline">Export Logs</Button>
                </div>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-semibold text-sm">
                    <span>Action</span>
                    <span>User</span>
                    <span>Timestamp</span>
                    <span>IP Address</span>
                  </div>
                  {auditLogs.map((log) => (
                    <div key={log.id} className="grid grid-cols-4 gap-4 p-3 border-t text-sm">
                      <span>{log.action}</span>
                      <span>{log.user}</span>
                      <span>{log.timestamp}</span>
                      <span>{log.ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-semibold">SOC 2 Type II</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-semibold">GDPR Compliant</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-semibold">HIPAA Ready</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-semibold">ISO 27001</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Certified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data Encryption at Rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data Encryption in Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data Residency Controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Right to be Forgotten</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data Portability</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                White Label Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <input className="w-full mt-1 p-2 border rounded" placeholder="Your Company Name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Custom Domain</label>
                      <input className="w-full mt-1 p-2 border rounded" placeholder="ai.yourcompany.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Support Email</label>
                      <input className="w-full mt-1 p-2 border rounded" placeholder="support@yourcompany.com" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Logo Upload</label>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <span className="text-gray-500">Drop logo here or click to upload</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Primary Color</label>
                      <input type="color" className="w-full mt-1 h-10 border rounded" defaultValue="#3b82f6" />
                    </div>
                  </div>
                </div>
                <Button>Save Branding</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  SLA Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Uptime (30 days)</span>
                    <span className="font-semibold text-green-600">99.97%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-semibold">< 200ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support Response</span>
                    <span className="font-semibold">< 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution Time</span>
                    <span className="font-semibold">< 4 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Dedicated Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Dedicated Account Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Priority Support Queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Phone & Video Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Custom Training Sessions</span>
                    </div>
                  </div>
                  <Button variant="outline">Contact Support</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}