'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ImageDetailModal } from '@/components/streets/ImageDetailModal';
import { MapView } from '@/components/streets/MapView';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Camera,
  Download,
  Eye,
  Grid,
  Map,
  X
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface StreetImage {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  date: string;
  photographer: string;
  notes: string;
  thumbnail: string;
  fullImage: string;
}

export default function StreetsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'map'>('gallery');
  const [selectedImage, setSelectedImage] = useState<StreetImage | null>(null);
  const [results, setResults] = useState<StreetImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDemoData();
    trackDevelopment(
      'Street Search Page',
      'Advanced search with filters, map view, gallery, and image detail modal',
      [
        'apps/hub/hub/app/(dashboard)/streets/search/page.tsx',
        'apps/hub/hub/components/streets/ImageDetailModal.tsx',
        'apps/hub/hub/components/streets/MapView.tsx'
      ],
      'feature'
    );
  }, []);

  const loadDemoData = () => {
    const demoImages: StreetImage[] = [
      {
        id: '1',
        street: 'Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.0060,
        date: '2024-01-15',
        photographer: 'Henry Ugochukwu',
        notes: 'Busy downtown street during rush hour',
        thumbnail: '/api/placeholder/300/200',
        fullImage: '/api/placeholder/800/600'
      },
      {
        id: '2',
        street: 'Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        latitude: 34.0522,
        longitude: -118.2437,
        date: '2024-01-14',
        photographer: 'Henry Ugochukwu',
        notes: 'Residential street with beautiful trees',
        thumbnail: '/api/placeholder/300/200',
        fullImage: '/api/placeholder/800/600'
      },
      {
        id: '3',
        street: 'Park Road',
        city: 'London',
        state: 'England',
        country: 'UK',
        latitude: 51.5074,
        longitude: -0.1278,
        date: '2024-01-13',
        photographer: 'Henry Ugochukwu',
        notes: 'Historic street near Hyde Park',
        thumbnail: '/api/placeholder/300/200',
        fullImage: '/api/placeholder/800/600'
      }
    ];
    setResults(demoImages);
  };

  const handleSearch = () => {
    setLoading(true);
    // Simulate search delay
    setTimeout(() => {
      let filtered = results;
      
      if (searchTerm) {
        filtered = filtered.filter(img => 
          img.street.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (cityFilter !== 'all') {
        filtered = filtered.filter(img => img.city === cityFilter);
      }
      
      if (stateFilter !== 'all') {
        filtered = filtered.filter(img => img.state === stateFilter);
      }
      
      if (countryFilter !== 'all') {
        filtered = filtered.filter(img => img.country === countryFilter);
      }
      
      if (dateFrom) {
        filtered = filtered.filter(img => img.date >= dateFrom);
      }
      
      if (dateTo) {
        filtered = filtered.filter(img => img.date <= dateTo);
      }
      
      setResults(filtered);
      setLoading(false);
    }, 500);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
    setStateFilter('all');
    setCountryFilter('all');
    setDateFrom('');
    setDateTo('');
    loadDemoData();
  };

  const downloadImage = (image: StreetImage) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = image.fullImage;
    link.download = `${image.street}-${image.city}-${image.date}.jpg`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Search Street Images</h1>
          <p className="text-gray-600">Find street photos by location, date, and more</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'gallery' ? 'default' : 'outline'}
            onClick={() => setViewMode('gallery')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Gallery
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Search by street name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">City</label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">State/Region</label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="England">England</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Country</label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button onClick={clearFilters} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Results ({results.length})</CardTitle>
            <Badge variant="outline">
              {results.length} images found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'gallery' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-blue-400" />
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="mt-2">
                    <h3 className="font-medium text-sm">{image.street}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {image.city}, {image.state}, {image.country}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(image.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MapView images={results} onImageSelect={setSelectedImage} />
          )}
        </CardContent>
      </Card>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={() => downloadImage(selectedImage)}
        />
      )}
    </div>
  );
}