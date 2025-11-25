'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Search, 
  MapPin, 
  Calendar, 
  Camera,
  Grid,
  List,
  Filter,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function StreetsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data
  const streetImages = [
    {
      id: '1',
      street: 'Main Street',
      location: 'Downtown',
      images: 12,
      lastUpdated: '2024-01-15',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      street: 'Oak Avenue',
      location: 'Residential Area',
      images: 8,
      lastUpdated: '2024-01-14',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '3',
      street: 'Park Road',
      location: 'City Center',
      images: 15,
      lastUpdated: '2024-01-13',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Street Images</h1>
          <p className="text-gray-600">Manage and browse street photography collection</p>
        </div>
        <div className="flex gap-2">
          <Link href="/streets/verify">
            <Button variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify Images
            </Button>
          </Link>
          <Link href="/streets/search">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search Images
            </Button>
          </Link>
          <Link href="/streets/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-600">Total Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-gray-600">Streets Covered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-gray-600">Cities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search streets, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Street Images Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streetImages.map((street) => (
            <Card key={street.id} className="hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{street.street}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {street.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4" />
                    {street.images} images
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(street.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Images
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {streetImages.map((street) => (
                <div key={street.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{street.street}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {street.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {street.images} images
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(street.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">View Images</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}