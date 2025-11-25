'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Camera, 
  MapPin, 
  Calendar,
  User,
  Award,
  History,
  AlertTriangle,
  Eye,
  Bot
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface UnverifiedImage {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  date: string;
  photographer: string;
  aiAnalysis: {
    confidence: number;
    detectedObjects: string[];
    qualityScore: number;
    issues: string[];
  };
  thumbnail: string;
  submittedAt: string;
}

interface VerificationHistory {
  id: string;
  imageId: string;
  street: string;
  action: 'approved' | 'rejected';
  score: number;
  comment: string;
  verifiedAt: string;
}

export default function StreetsVerifyPage() {
  const [queue, setQueue] = useState<UnverifiedImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qualityScore, setQualityScore] = useState(0);
  const [comment, setComment] = useState('');
  const [reputationPoints, setReputationPoints] = useState(1250);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQueue();
    loadHistory();
    trackDevelopment(
      'Street Verification System',
      'Image verification queue with AI analysis, quality scoring, and reputation system',
      [
        'apps/hub/hub/app/(dashboard)/streets/verify/page.tsx'
      ],
      'feature'
    );
  }, []);

  const loadQueue = () => {
    const demoQueue: UnverifiedImage[] = [
      {
        id: '1',
        street: 'Broadway',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        date: '2024-01-15',
        photographer: 'John Doe',
        aiAnalysis: {
          confidence: 0.92,
          detectedObjects: ['street', 'buildings', 'cars', 'pedestrians'],
          qualityScore: 4.2,
          issues: []
        },
        thumbnail: '/api/placeholder/400/300',
        submittedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        street: 'Main Street',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        date: '2024-01-14',
        photographer: 'Jane Smith',
        aiAnalysis: {
          confidence: 0.75,
          detectedObjects: ['street', 'buildings'],
          qualityScore: 3.1,
          issues: ['Low lighting', 'Blurry']
        },
        thumbnail: '/api/placeholder/400/300',
        submittedAt: '2024-01-14T15:20:00Z'
      }
    ];
    setQueue(demoQueue);
  };

  const loadHistory = () => {
    const demoHistory: VerificationHistory[] = [
      {
        id: '1',
        imageId: 'img1',
        street: 'Oak Avenue',
        action: 'approved',
        score: 5,
        comment: 'Excellent quality street photo',
        verifiedAt: '2024-01-14T09:15:00Z'
      },
      {
        id: '2',
        imageId: 'img2',
        street: 'Park Road',
        action: 'rejected',
        score: 2,
        comment: 'Image too dark, poor visibility',
        verifiedAt: '2024-01-13T14:30:00Z'
      }
    ];
    setVerificationHistory(demoHistory);
  };

  const handleApprove = () => {
    if (qualityScore === 0) {
      alert('Please provide a quality score');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const currentImage = queue[currentIndex];
      const newHistory: VerificationHistory = {
        id: Date.now().toString(),
        imageId: currentImage.id,
        street: currentImage.street,
        action: 'approved',
        score: qualityScore,
        comment: comment || 'Approved without comment',
        verifiedAt: new Date().toISOString()
      };

      setVerificationHistory([newHistory, ...verificationHistory]);
      setReputationPoints(prev => prev + (qualityScore * 2));
      
      // Move to next image
      if (currentIndex < queue.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setQueue(queue.slice(1));
        setCurrentIndex(0);
      }
      
      setQualityScore(0);
      setComment('');
      setLoading(false);
    }, 500);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const currentImage = queue[currentIndex];
      const newHistory: VerificationHistory = {
        id: Date.now().toString(),
        imageId: currentImage.id,
        street: currentImage.street,
        action: 'rejected',
        score: qualityScore || 1,
        comment: comment,
        verifiedAt: new Date().toISOString()
      };

      setVerificationHistory([newHistory, ...verificationHistory]);
      setReputationPoints(prev => prev + 1);
      
      // Move to next image
      if (currentIndex < queue.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setQueue(queue.slice(1));
        setCurrentIndex(0);
      }
      
      setQualityScore(0);
      setComment('');
      setLoading(false);
    }, 500);
  };

  const currentImage = queue[currentIndex];

  if (!currentImage) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
          <p className="text-gray-600">No images pending verification at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Image Verification</h1>
          <p className="text-gray-600">Review and verify submitted street images</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            {reputationPoints} Points
          </Badge>
          <Badge variant="secondary">
            {currentIndex + 1} of {queue.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Verification Progress</span>
            <span>{Math.round(((currentIndex + 1) / queue.length) * 100)}%</span>
          </div>
          <Progress value={((currentIndex + 1) / queue.length) * 100} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {currentImage.street}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-24 h-24 text-blue-400" />
              </div>

              {/* Image Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{currentImage.city}, {currentImage.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(currentImage.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{currentImage.photographer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>Submitted {new Date(currentImage.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Panel */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(currentImage.aiAnalysis.confidence * 100)}%</span>
                </div>
                <Progress value={currentImage.aiAnalysis.confidence * 100} />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Detected Objects</div>
                <div className="flex flex-wrap gap-1">
                  {currentImage.aiAnalysis.detectedObjects.map((obj) => (
                    <Badge key={obj} variant="outline" className="text-xs">
                      {obj}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">AI Quality Score</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= currentImage.aiAnalysis.qualityScore
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-2">
                    {currentImage.aiAnalysis.qualityScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {currentImage.aiAnalysis.issues.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Issues Detected
                  </div>
                  <div className="space-y-1">
                    {currentImage.aiAnalysis.issues.map((issue, index) => (
                      <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Your Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quality Score */}
              <div>
                <div className="text-sm font-medium mb-2">Quality Score</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer transition-colors ${
                        star <= qualityScore
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                      onClick={() => setQualityScore(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <div className="text-sm font-medium mb-2">Comment (optional for approval, required for rejection)</div>
                <Textarea
                  placeholder="Add your verification notes..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={loading || qualityScore === 0}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verificationHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.action === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{item.street}</div>
                    <div className="text-sm text-gray-600">{item.comment}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= item.score
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.verifiedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}