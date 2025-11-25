'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Upload, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  FileText,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

export default function LearningPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materialType, setMaterialType] = useState('documentation');
  const [source, setSource] = useState('');

  const materialTypes = [
    'documentation', 'code-example', 'best-practice', 'tutorial', 
    'api-reference', 'troubleshooting', 'pattern'
  ];

  const handleSubmitMaterial = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/self-learning/submit-material', {
        title, content, materialType, source
      });

      toast.success('Learning material submitted!');
      setTitle('');
      setContent('');
      setSource('');
    } catch (error: any) {
      toast.error('Failed to submit material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Self-Learning System</h1>
        <p className="text-gray-600">Train your AI with approved materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Learning Material
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Material title..."
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={materialType} onValueChange={setMaterialType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Source (Optional)</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source URL..."
            />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Learning material content..."
              className="min-h-[200px]"
            />
          </div>

          <Button onClick={handleSubmitMaterial} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Submit for Approval
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}