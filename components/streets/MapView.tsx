'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Eye } from 'lucide-react';

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

interface MapViewProps {
  images: StreetImage[];
  onImageSelect: (image: StreetImage) => void;
}

export function MapView({ images, onImageSelect }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Grid lines to simulate map */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Map Markers */}
        {images.map((image, index) => {
          const x = 50 + (index * 80) % 300;
          const y = 80 + (index * 60) % 140;
          
          return (
            <div
              key={image.id}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                selectedMarker === image.id ? 'z-20' : 'z-10'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => setSelectedMarker(selectedMarker === image.id ? null : image.id)}
            >
              {/* Marker Pin */}
              <div className={`relative ${selectedMarker === image.id ? 'scale-125' : ''} transition-transform`}>
                <MapPin 
                  className={`w-8 h-8 ${
                    selectedMarker === image.id 
                      ? 'text-red-500' 
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                  fill="currentColor"
                />
                
                {/* Popup */}
                {selectedMarker === image.id && (
                  <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 shadow-lg">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <h3 className="font-medium text-sm">{image.street}</h3>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        {image.city}, {image.state}, {image.country}
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        {new Date(image.date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            onImageSelect(image);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="secondary">+</Button>
          <Button size="sm" variant="secondary">-</Button>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4">
          <Card className="p-2">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-blue-500" fill="currentColor" />
              <span>Street Image Location</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Image List Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className={`p-3 cursor-pointer transition-colors ${
              selectedMarker === image.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMarker(selectedMarker === image.id ? null : image.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{image.street}</h3>
                <p className="text-xs text-gray-600 truncate">
                  {image.city}, {image.state}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(image.date).toLocaleDateString()}
                </p>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageSelect(image);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Map Integration Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Map Integration</h3>
            <p className="text-sm text-blue-700 mt-1">
              This is a simulated map view. In production, this would integrate with Google Maps, 
              Mapbox, or another mapping service to show actual street locations and satellite imagery.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}