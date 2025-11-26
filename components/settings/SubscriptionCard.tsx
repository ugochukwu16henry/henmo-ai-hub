'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Check } from 'lucide-react';

interface SubscriptionData {
  tier: 'free' | 'pro' | 'enterprise';
  usage: {
    requests: number;
    limit: number;
  };
  features: string[];
  nextBilling?: string;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onUpgrade: () => void;
}

export function SubscriptionCard({ subscription, onUpgrade }: SubscriptionCardProps) {
  const tierColors = {
    free: 'bg-gray-100 text-gray-800',
    pro: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  };

  const tierIcons = {
    free: <Zap className="w-4 h-4" />,
    pro: <Crown className="w-4 h-4" />,
    enterprise: <Crown className="w-4 h-4" />
  };

  const usagePercentage = (subscription.usage.requests / subscription.usage.limit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription
          </div>
          <Badge className={tierColors[subscription.tier]}>
            {tierIcons[subscription.tier]}
            {subscription.tier.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>API Usage</span>
            <span>{subscription.usage.requests} / {subscription.usage.limit}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div>
          <h4 className="font-medium mb-2">Features</h4>
          <ul className="space-y-1">
            {subscription.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-3 h-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {subscription.nextBilling && (
          <div className="text-sm text-gray-600">
            Next billing: {subscription.nextBilling}
          </div>
        )}

        {subscription.tier !== 'enterprise' && (
          <Button onClick={onUpgrade} className="w-full">
            Upgrade Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}