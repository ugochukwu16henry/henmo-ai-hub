'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, Plus, Trash2, Image, FileText } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'hero' | 'feature' | 'pricing' | 'testimonial' | 'blog';
  title: string;
  content: string;
  image?: string;
  order: number;
  active: boolean;
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  const saveContent = async (item: ContentItem) => {
    try {
      const response = await fetch(`/api/content/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      
      if (response.ok) {
        fetchContent();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const createContent = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      
      if (response.ok) {
        fetchContent();
        setNewItem({});
      }
    } catch (error) {
      console.error('Failed to create content:', error);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const ContentEditor = ({ item, isNew = false }: { item: Partial<ContentItem>, isNew?: boolean }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isNew ? 'New Content' : item.title}</span>
          <div className="flex gap-2">
            {!isNew && (
              <>
                <Button size="sm" onClick={() => setEditingId(editingId === item.id ? null : item.id!)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteContent(item.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(isNew || editingId === item.id) ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={item.type || ''}
                  onChange={(e) => isNew 
                    ? setNewItem({...newItem, type: e.target.value as ContentItem['type']})
                    : setContent(content.map(c => c.id === item.id ? {...c, type: e.target.value as ContentItem['type']} : c))
                  }
                >
                  <option value="">Select Type</option>
                  <option value="hero">Hero Section</option>
                  <option value="feature">Feature</option>
                  <option value="pricing">Pricing</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="blog">Blog Post</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Order</label>
                <Input
                  type="number"
                  value={item.order || 0}
                  onChange={(e) => isNew
                    ? setNewItem({...newItem, order: parseInt(e.target.value)})
                    : setContent(content.map(c => c.id === item.id ? {...c, order: parseInt(e.target.value)} : c))
                  }
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={item.title || ''}
                onChange={(e) => isNew
                  ? setNewItem({...newItem, title: e.target.value})
                  : setContent(content.map(c => c.id === item.id ? {...c, title: e.target.value} : c))
                }
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                rows={6}
                value={item.content || ''}
                onChange={(e) => isNew
                  ? setNewItem({...newItem, content: e.target.value})
                  : setContent(content.map(c => c.id === item.id ? {...c, content: e.target.value} : c))
                }
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={item.image || ''}
                onChange={(e) => isNew
                  ? setNewItem({...newItem, image: e.target.value})
                  : setContent(content.map(c => c.id === item.id ? {...c, image: e.target.value} : c))
                }
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.active || false}
                onChange={(e) => isNew
                  ? setNewItem({...newItem, active: e.target.checked})
                  : setContent(content.map(c => c.id === item.id ? {...c, active: e.target.checked} : c))
                }
              />
              <label className="text-sm font-medium">Active</label>
            </div>
            
            <Button onClick={() => isNew ? createContent() : saveContent(item as ContentItem)}>
              <Save className="h-4 w-4 mr-2" />
              {isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">Type: {item.type}</p>
            <p className="mb-2">{item.content}</p>
            {item.image && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Image className="h-4 w-4" />
                <span>Has image</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button onClick={() => setNewItem({type: 'hero', title: '', content: '', active: true, order: 0})}>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="hero">Hero Sections</TabsTrigger>
          <TabsTrigger value="feature">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {Object.keys(newItem).length > 0 && <ContentEditor item={newItem} isNew />}
          {content.map(item => <ContentEditor key={item.id} item={item} />)}
        </TabsContent>

        {['hero', 'feature', 'pricing', 'blog'].map(type => (
          <TabsContent key={type} value={type}>
            {content.filter(item => item.type === type).map(item => 
              <ContentEditor key={item.id} item={item} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}