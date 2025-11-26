'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, Image, Download, Trash2, Play, Camera, 
  Palette, FileImage, Monitor, Smartphone, Globe,
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

export default function MediaStudioPage() {
  const [activeTab, setActiveTab] = useState('video');
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [templates, setTemplates] = useState(null);

  // Video generation state
  const [videoForm, setVideoForm] = useState({
    type: 'demo',
    title: 'HenMo AI Demo',
    duration: 30,
    resolution: '1920x1080',
    version: '',
    features: '',
    improvements: ''
  });

  // Image generation state
  const [imageForm, setImageForm] = useState({
    type: 'generate',
    prompt: '',
    width: 1920,
    height: 1080,
    style: 'professional',
    brandingType: 'logo',
    pageType: 'dashboard'
  });

  useEffect(() => {
    fetchMediaList();
    fetchTemplates();
  }, []);

  const fetchMediaList = async () => {
    try {
      const response = await fetch('/api/media/list');
      const data = await response.json();
      if (data.success) {
        setMediaList(data.data.files);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/media/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const generateVideo = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/media/video/demo';
      let payload = {
        title: videoForm.title,
        duration: videoForm.duration,
        resolution: videoForm.resolution
      };

      if (videoForm.type === 'showcase') {
        endpoint = '/api/media/video/showcase';
      } else if (videoForm.type === 'version') {
        endpoint = '/api/media/video/version';
        payload = {
          version: videoForm.version,
          features: videoForm.features.split('\n').filter(f => f.trim()),
          improvements: videoForm.improvements.split('\n').filter(i => i.trim())
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        await fetchMediaList();
        alert('Video generated successfully!');
      } else {
        alert('Failed to generate video: ' + data.error);
      }
    } catch (error) {
      alert('Error generating video: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/media/image/generate';
      let payload = {
        prompt: imageForm.prompt,
        width: imageForm.width,
        height: imageForm.height,
        style: imageForm.style
      };

      if (imageForm.type === 'branding') {
        endpoint = '/api/media/image/branding';
        payload = {
          type: imageForm.brandingType,
          text: 'HenMo AI',
          tagline: 'Advanced AI Development Hub',
          colorScheme: 'blue'
        };
      } else if (imageForm.type === 'screenshot') {
        endpoint = '/api/media/image/screenshot';
        payload = {
          pageType: imageForm.pageType
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        await fetchMediaList();
        alert('Image generated successfully!');
      } else {
        alert('Failed to generate image: ' + data.error);
      }
    } catch (error) {
      alert('Error generating image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadMedia = async (mediaId, type) => {
    try {
      const response = await fetch(`/api/media/download/${type}/${mediaId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mediaId}.${type === 'video' ? 'mp4' : 'png'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      alert('Download failed: ' + error.message);
    }
  };

  const deleteMedia = async (mediaId, type) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    
    try {
      const response = await fetch(`/api/media/${type}/${mediaId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchMediaList();
        alert('Media deleted successfully!');
      }
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Studio</h1>
          <p className="text-muted-foreground mt-2">
            Generate videos and images with HenMo AI watermark
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {mediaList.length} Generated Files
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Generation
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image Generation
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Media Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Type</label>
                  <Select value={videoForm.type} onValueChange={(value) => setVideoForm({...videoForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Product Demo</SelectItem>
                      <SelectItem value="showcase">App Showcase</SelectItem>
                      <SelectItem value="version">Version Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Resolution</label>
                  <Select value={videoForm.resolution} onValueChange={(value) => setVideoForm({...videoForm, resolution: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                      <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {videoForm.type === 'demo' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (seconds)</label>
                    <Input 
                      type="number"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({...videoForm, duration: parseInt(e.target.value)})}
                      min="10"
                      max="120"
                    />
                  </div>
                </div>
              )}

              {videoForm.type === 'version' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Version Number</label>
                    <Input 
                      value={videoForm.version}
                      onChange={(e) => setVideoForm({...videoForm, version: e.target.value})}
                      placeholder="e.g., 2.1.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Features (one per line)</label>
                    <Textarea 
                      value={videoForm.features}
                      onChange={(e) => setVideoForm({...videoForm, features: e.target.value})}
                      placeholder="Enhanced AI Capabilities&#10;New Code Analysis Features&#10;Improved Performance"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Improvements (one per line)</label>
                    <Textarea 
                      value={videoForm.improvements}
                      onChange={(e) => setVideoForm({...videoForm, improvements: e.target.value})}
                      placeholder="Faster processing speed&#10;Better error detection&#10;Enhanced security scanning"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <Button onClick={generateVideo} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Image Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Type</label>
                <Select value={imageForm.type} onValueChange={(value) => setImageForm({...imageForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generate">Custom Generation</SelectItem>
                    <SelectItem value="branding">Company Branding</SelectItem>
                    <SelectItem value="screenshot">Product Screenshot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {imageForm.type === 'generate' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea 
                      value={imageForm.prompt}
                      onChange={(e) => setImageForm({...imageForm, prompt: e.target.value})}
                      placeholder="Describe the image you want to generate..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Width</label>
                      <Input 
                        type="number"
                        value={imageForm.width}
                        onChange={(e) => setImageForm({...imageForm, width: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Height</label>
                      <Input 
                        type="number"
                        value={imageForm.height}
                        onChange={(e) => setImageForm({...imageForm, height: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Style</label>
                      <Select value={imageForm.style} onValueChange={(value) => setImageForm({...imageForm, style: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="vibrant">Vibrant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {imageForm.type === 'branding' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branding Type</label>
                  <Select value={imageForm.brandingType} onValueChange={(value) => setImageForm({...imageForm, brandingType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo">Company Logo</SelectItem>
                      <SelectItem value="banner">Marketing Banner</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {imageForm.type === 'screenshot' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Type</label>
                  <Select value={imageForm.pageType} onValueChange={(value) => setImageForm({...imageForm, pageType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="ai-chat">AI Chat</SelectItem>
                      <SelectItem value="code-analysis">Code Analysis</SelectItem>
                      <SelectItem value="features">Features Overview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={generateImage} disabled={loading || (imageForm.type === 'generate' && !imageForm.prompt)} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Media</h3>
            <Button onClick={fetchMediaList} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mediaList.map((media) => (
              <Card key={media.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {media.type === 'video' ? (
                        <Video className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Image className="h-4 w-4 text-green-600" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {media.type}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadMedia(media.id, media.type)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMedia(media.id, media.type)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-sm truncate">{media.filename}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Size: {(media.size / 1024 / 1024).toFixed(2)} MB</div>
                      <div>Created: {new Date(media.created).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mediaList.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No media files generated yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Video or Image tabs to create your first media
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}