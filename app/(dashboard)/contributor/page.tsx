'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  DollarSign, 
  Award, 
  TrendingUp, 
  CheckCircle,
  Star,
  Trophy,
  Users,
  Calendar,
  Target
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface ContributorStats {
  totalUploads: number;
  approvedImages: number;
  rejectedImages: number;
  pendingImages: number;
  totalEarnings: number;
  availableBalance: number;
  reputationScore: number;
  verificationRate: number;
  badges: string[];
  rank: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  uploads: number;
  earnings: number;
  reputation: number;
}

export default function ContributorPage() {
  const [stats, setStats] = useState<ContributorStats>({
    totalUploads: 156,
    approvedImages: 142,
    rejectedImages: 8,
    pendingImages: 6,
    totalEarnings: 284.50,
    availableBalance: 127.25,
    reputationScore: 4.8,
    verificationRate: 91.0,
    badges: ['Top Contributor', 'Quality Expert', 'Street Master'],
    rank: 3
  });

  const [payoutAmount, setPayoutAmount] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah Johnson', uploads: 324, earnings: 648.75, reputation: 4.9 },
    { rank: 2, name: 'Mike Chen', uploads: 298, earnings: 592.40, reputation: 4.8 },
    { rank: 3, name: 'Henry Ugochukwu', uploads: 156, earnings: 284.50, reputation: 4.8 },
    { rank: 4, name: 'Emma Wilson', uploads: 134, earnings: 267.80, reputation: 4.7 },
    { rank: 5, name: 'David Brown', uploads: 89, earnings: 178.90, reputation: 4.6 }
  ]);

  useEffect(() => {
    trackDevelopment(
      'Contributor Dashboard',
      'Comprehensive contributor dashboard with stats, earnings, badges, and leaderboard',
      [
        'apps/hub/hub/app/(dashboard)/contributor/page.tsx'
      ],
      'feature'
    );
  }, []);

  const handlePayoutRequest = () => {
    const amount = parseFloat(payoutAmount);
    if (amount > stats.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    if (amount < 10) {
      alert('Minimum payout is $10');
      return;
    }
    
    setStats(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount
    }));
    setPayoutAmount('');
    alert(`Payout request of $${amount} submitted successfully!`);
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'Top Contributor': 'bg-gold-100 text-gold-800',
      'Quality Expert': 'bg-blue-100 text-blue-800',
      'Street Master': 'bg-green-100 text-green-800'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contributor Dashboard</h1>
          <p className="text-gray-600">Track your contributions and earnings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Rank #{stats.rank}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
            <div className="text-sm text-gray-600">Total Uploads</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.verificationRate}%</div>
            <div className="text-sm text-gray-600">Approval Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.reputationScore}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Approved Images</span>
                  <span className="font-medium">{stats.approvedImages}</span>
                </div>
                <Progress value={(stats.approvedImages / stats.totalUploads) * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Review</span>
                  <span className="font-medium">{stats.pendingImages}</span>
                </div>
                <Progress value={(stats.pendingImages / stats.totalUploads) * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rejected</span>
                  <span className="font-medium">{stats.rejectedImages}</span>
                </div>
                <Progress value={(stats.rejectedImages / stats.totalUploads) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Quality Score</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(stats.reputationScore)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">{stats.reputationScore}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Verification Rate</span>
                  </div>
                  <span className="font-medium">{stats.verificationRate}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Global Rank</span>
                  </div>
                  <span className="font-medium">#{stats.rank}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Total Earnings</span>
                  <span className="text-xl font-bold text-green-600">${stats.totalEarnings}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Available Balance</span>
                  <span className="text-xl font-bold text-blue-600">${stats.availableBalance}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>• $2.00 per approved image</p>
                  <p>• Bonus for high-quality submissions</p>
                  <p>• Monthly performance bonuses</p>
                </div>
              </CardContent>
            </Card>

            {/* Payout Request */}
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    max={stats.availableBalance}
                    min="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum payout: $10.00
                  </p>
                </div>
                
                <Button 
                  onClick={handlePayoutRequest}
                  disabled={!payoutAmount || parseFloat(payoutAmount) < 10}
                  className="w-full"
                >
                  Request Payout
                </Button>
                
                <div className="text-xs text-gray-600">
                  <p>• Payouts processed within 3-5 business days</p>
                  <p>• PayPal and bank transfer available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.badges.map((badge) => (
                  <div key={badge} className="text-center p-4 border rounded-lg">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <Badge className={getBadgeColor(badge)} variant="secondary">
                      {badge}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-2">
                      Earned for exceptional contributions
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Available Badges</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Rookie (10 uploads)</div>
                  <div>• Veteran (100 uploads)</div>
                  <div>• Quality Expert (95% approval)</div>
                  <div>• Speed Demon (50 uploads/month)</div>
                  <div>• Street Master (500 uploads)</div>
                  <div>• Top Contributor (Top 10 rank)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'Henry Ugochukwu' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-gray-600">
                          {entry.uploads} uploads • {entry.reputation}★
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${entry.earnings}</div>
                      <div className="text-sm text-gray-600">earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}