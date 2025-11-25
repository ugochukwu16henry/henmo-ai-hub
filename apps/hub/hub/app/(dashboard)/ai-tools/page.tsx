'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Bug, 
  Shield, 
  Zap, 
  BookOpen, 
  Database,
  Brain,
  FileText,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AIToolsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState('');
  const [data, setData] = useState('');

  const languages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby'];

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/advanced-ai/analyze-code', {
        code, language, task: 'comprehensive analysis'
      });
      setResult(response.data.data.analysis);
      toast.success('Code analysis completed!');
    } catch (error: any) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!requirements.trim()) {
      toast.error('Please enter requirements');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/advanced-ai/generate-code', {
        requirements, language
      });
      setResult(response.data.data.code);
      toast.success('Code generated!');
    } catch (error: any) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Developer Tools</h1>
        <p className="text-gray-600">Advanced AI capabilities like Amazon Q Developer</p>
      </div>

      <Tabs defaultValue="analyze">
        <TabsList>
          <TabsTrigger value="analyze">Analyze Code</TabsTrigger>
          <TabsTrigger value="generate">Generate Code</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Code Analysis & Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Code</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="min-h-[200px] font-mono"
                />
              </div>
              
              <Button onClick={handleAnalyzeCode} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                Analyze Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Requirements</Label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe what you want the code to do..."
                  className="min-h-[150px]"
                />
              </div>
              
              <Button onClick={handleGenerateCode} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Generate Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug">
          <Card>
            <CardHeader>
              <CardTitle>Debug Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Debug functionality - Coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Security analysis - Coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>AI Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}