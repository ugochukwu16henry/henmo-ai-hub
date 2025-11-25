'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Download, 
  MapPin, 
  Calendar, 
  User, 
  FileText,
  Camera,
  Share,
  Copy
} from 'lucide-react';

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

interface ImageDetailModalProps {
  image: StreetImage;
  onClose: () => void;
  onDownload: () => void;
}

export function ImageDetailModal({ image, onClose, onDownload }: ImageDetailModalProps) {
  const copyCoordinates = () => {
    const coords = `${image.latitude}, ${image.longitude}`;
    navigator.clipboard.writeText(coords);
    alert('Coordinates copied to clipboard!');
  };

  const shareImage = () => {
    const shareData = {
      title: `Street Image: ${image.street}`,
      text: `Check out this street photo from ${image.street}, ${image.city}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {image.street}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Image */}
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <Camera className="w-24 h-24 text-blue-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={shareImage} variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={copyCoordinates} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy Coordinates
            </Button>
          </div>

          <Separator />

          {/* Image Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Location Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{image.street}</div>
                    <div className="text-sm text-gray-600">
                      {image.city}, {image.state}, {image.country}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Coordinates</div>
                  <div className="text-sm text-gray-600">
                    Lat: {image.latitude}°, Lng: {image.longitude}°
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Image Metadata</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Date Taken</div>
                    <div className="text-sm text-gray-600">
                      {new Date(image.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Photographer</div>
                    <div className="text-sm text-gray-600">{image.photographer}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">Notes</div>
                    <div className="text-sm text-gray-600">
                      {image.notes || 'No notes available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags/Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Street Photography</Badge>
              <Badge variant="secondary">{image.city}</Badge>
              <Badge variant="secondary">{image.country}</Badge>
              <Badge variant="secondary">Urban</Badge>
            </div>
          </div>

          {/* Map Preview */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Location on Map</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Map view would be integrated here</p>
                <p className="text-sm text-gray-500">
                  {image.latitude}°, {image.longitude}°
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}