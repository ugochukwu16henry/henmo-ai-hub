'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Camera, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploaded: boolean;
  progress: number;
}

export default function StreetsUploadPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [location, setLocation] = useState({ lat: '', lng: '', address: '' });
  const [streetName, setStreetName] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useState(() => {
    trackDevelopment(
      'Street Image Upload Platform',
      'Image upload system with GPS, drag-and-drop, street autocomplete, and multi-image support',
      [
        'apps/hub/hub/app/(dashboard)/streets/upload/page.tsx'
      ],
      'feature'
    );
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newImages: UploadedImage[] = imageFiles.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
            address: `${position.coords.latitude}, ${position.coords.longitude}`
          });
        },
        (error) => {
          alert('Unable to detect location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const simulateUpload = async (imageId: string) => {
    const updateProgress = (progress: number) => {
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, progress } : img
      ));
    };

    for (let i = 0; i <= 100; i += 10) {
      updateProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, uploaded: true, progress: 100 } : img
    ));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setUploading(true);

    // Simulate upload for each image
    const uploadPromises = images.map(image => simulateUpload(image.id));
    await Promise.all(uploadPromises);

    setUploading(false);
    alert('All images uploaded successfully!');
  };

  const streetSuggestions = [
    'Main Street', 'Oak Avenue', 'Park Road', 'First Street', 'Second Avenue',
    'Broadway', 'Church Street', 'School Road', 'Market Street', 'High Street'
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Street Images</h1>
        <p className="text-gray-600">Share street photos with location and details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop images here</p>
              <p className="text-gray-500 mb-4">or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <Button asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  Select Images
                </label>
              </Button>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Selected Images ({images.length})</h3>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      
                      {/* Upload Progress */}
                      {image.progress > 0 && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <Progress value={image.progress} className="h-1" />
                        </div>
                      )}
                      
                      {/* Upload Status */}
                      {image.uploaded && (
                        <div className="absolute top-1 left-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Address or coordinates"
                  value={location.address}
                  onChange={(e) => setLocation({...location, address: e.target.value})}
                  className="flex-1"
                />
                <Button onClick={detectLocation} variant="outline">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude"
                  value={location.lat}
                  onChange={(e) => setLocation({...location, lat: e.target.value})}
                />
                <Input
                  placeholder="Longitude"
                  value={location.lng}
                  onChange={(e) => setLocation({...location, lng: e.target.value})}
                />
              </div>
            </div>

            {/* Street Name */}
            <div className="space-y-2">
              <Label>Street Name</Label>
              <Input
                placeholder="Enter street name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                list="street-suggestions"
              />
              <datalist id="street-suggestions">
                {streetSuggestions.map((street) => (
                  <option key={street} value={street} />
                ))}
              </datalist>
            </div>

            {/* Date/Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any additional notes about the street or images..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={uploading || images.length === 0}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images ({images.length})
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload Summary */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {images.length} images selected
                </Badge>
                <Badge variant="outline">
                  {images.filter(img => img.uploaded).length} uploaded
                </Badge>
                {location.address && (
                  <Badge variant="outline">
                    Location: {location.address}
                  </Badge>
                )}
              </div>
              
              {uploading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}