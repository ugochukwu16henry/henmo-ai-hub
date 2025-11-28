'use client';

import { useState } from 'react';
// Assuming these are the component paths from a standard Shadcn setup
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// === MISSING IMPORTS ADDED HERE ===
// Assuming a standard table component (like shadcn's Table, TableBody, etc.) is used for better styling
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// === END OF MISSING IMPORTS ===

// Lucide Icons: Imported correctly in the original code
import { Shield, Key, FileText, Clock, Users, Building, CheckCircle } from 'lucide-react';


// Defined Log Type for better TypeScript safety
interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
}

const auditLogsData: AuditLog[] = [
  { id: '1', action: 'User Login', user: 'john.doe@company.com', timestamp: '2026-03-15 09:30:00', ip: '192.168.1.100' },
  { id: '2', action: 'Model Access', user: 'jane.smith@company.com', timestamp: '2026-03-15 09:25:00', ip: '192.168.1.101' },
  { id: '3', action: 'Data Export', user: 'admin@company.com', timestamp: '2026-03-15 09:20:00', ip: '192.168.1.102' }
];

export default function EnterprisePage() {
  const [ssoEnabled, setSsoEnabled] = useState(false);

  return (
    <div className="space-y-8 p-6 md:p-10"> 
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Enterprise Features</h1>
          <p className="text-lg text-gray-500 mt-1">Advanced security, compliance, and management tools</p>
        </div>
        <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-base py-1 px-3">
          Enterprise Plan
        </Badge>
      </div>

      {/* Metric Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Uptime</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">99.9%</div>
            <p className="text-xs text-muted-foreground">Guaranteed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">SOC 2</div>
            <p className="text-xs text-muted-foreground">Certified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <p className="text-xs text-muted-foreground">Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Law</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GDPR</div>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sso" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sso">SSO & Auth</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="branding">White Label</TabsTrigger>
          <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
        </TabsList>

        {/* ======================================= */}
        {/* TABS CONTENT: SSO & AUTH */}
        {/* ======================================= */}
        <TabsContent value="sso" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-indigo-600" />
                  Single Sign-On (SSO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                    <span className="font-medium">SSO Status</span>
                    <Badge variant={ssoEnabled ? 'default' : 'secondary'} className={ssoEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : ''}>
                      {ssoEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium pt-2">Available Protocols:</p>
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
                  <Button onClick={() => setSsoEnabled(!ssoEnabled)} className="w-full mt-4">
                    {ssoEnabled ? 'Configure Settings' : 'Enable SSO'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-Factor Authentication (MFA)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">IP Whitelisting & Geo-Fencing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session Management & Expiration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Advanced Encryption (AES-256)</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ======================================= */}
        {/* TABS CONTENT: AUDIT LOGS */}
        {/* ======================================= */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  Activity & Audit Logs
                </div>
                <Button size="sm" variant="outline" className="text-sm">Export Logs (.csv)</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Log Retention: **7 years**</span>
                  <span className="text-xs">Last log updated: {auditLogsData[0].timestamp}</span>
                </div>
                
                {/* Improved Audit Log Table using Shadcn Table components */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[150px]">Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogsData.map((log) => (
                        <TableRow key={log.id} className="text-sm">
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell className="text-muted-foreground">{log.user}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell className="text-right">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================= */}
        {/* TABS CONTENT: COMPLIANCE */}
        {/* ======================================= */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Compliance Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                    <span className="font-semibold">SOC 2 Type II</span>
                    <Badge className="bg-green-600 text-white hover:bg-green-700">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                    <span className="font-semibold">GDPR Compliant</span>
                    <Badge className="bg-green-600 text-white hover:bg-green-700">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border">
                    <span className="font-semibold">HIPAA Ready</span>
                    <Badge variant="outline" className="text-yellow-800 border-yellow-800">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border">
                    <span className="font-semibold">ISO 27001</span>
                    <Badge className="bg-green-600 text-white hover:bg-green-700">Certified</Badge>
                  </div>
                </div>
                <Button variant="link" className="px-0 pt-4">View Compliance Documents</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Data Protection Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Data Encryption at Rest (AES-256)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Data Encryption in Transit (TLS 1.2+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Data Residency Controls (EU/US)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Right to be Forgotten (GDPR)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Data Portability (JSON/CSV)</span>
                  </div>
                </div>
                <Button variant="link" className="px-0 pt-4">Configure Data Residency</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ======================================= */}
        {/* TABS CONTENT: WHITE LABEL / BRANDING */}
        {/* ======================================= */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-pink-600" />
                White Label Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" placeholder="Your Company Name" />
                    </div>
                    <div>
                      <Label htmlFor="custom-domain">Custom Domain</Label>
                      <Input id="custom-domain" placeholder="ai.yourcompany.com" />
                    </div>
                    <div>
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input id="support-email" type="email" placeholder="support@yourcompany.com" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Logo Upload</Label>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <span className="text-gray-500 text-sm">Drop logo here or click to upload</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      {/* Note: Added more consistent width class */}
                      <Input id="primary-color" type="color" className="w-full h-10 cursor-pointer" defaultValue="#3b82f6" aria-label="Primary color picker" />
                    </div>
                  </div>
                </div>
                <Button>Save Branding Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================= */}
        {/* TABS CONTENT: SLA MONITORING */}
        {/* ======================================= */}
        <TabsContent value="sla" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Current SLA Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border">
                    <span className="font-medium">Uptime (30 days)</span>
                    <span className="font-bold text-green-600">99.97%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border">
                    <span className="font-medium">Avg. Response Time</span>
                    <span className="font-bold text-blue-600">< 200ms</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border">
                    <span className="font-medium">Support Response (Critical)</span>
                    <span className="font-bold text-purple-600">< 1 hour</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border">
                    <span className="font-medium">Avg. Resolution Time</span>
                    <span className="font-bold text-purple-600">< 4 hours</span>
                  </div>
                </div>
                <Button variant="link" className="px-0 pt-4">View Full Status Page</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Dedicated Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Dedicated Account Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Priority Support Queue (24/7)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Direct Phone & Video Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Custom Onboarding & Training</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Contact Your Account Manager</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}