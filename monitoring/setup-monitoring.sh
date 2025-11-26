#!/bin/bash

echo "🔍 Setting up monitoring and logging..."

# Create Sentry projects
echo "1. Create Sentry projects at https://sentry.io"
echo "   - Frontend project (React/Next.js)"
echo "   - Backend project (Node.js/Express)"

# Setup LogRocket
echo "2. Create LogRocket account at https://logrocket.com"
echo "   - Get application ID"

# Setup PostHog
echo "3. Create PostHog account at https://posthog.com"
echo "   - Get project API key"

# Setup Google Analytics
echo "4. Create Google Analytics property"
echo "   - Get GA4 measurement ID"

# Setup UptimeRobot
echo "5. Create UptimeRobot monitors at https://uptimerobot.com"
echo "   - Frontend: https://henmo-ai.com"
echo "   - API: https://api.henmo-ai.com/health"
echo "   - Database: https://api.henmo-ai.com/health/db"
echo "   - AI Service: https://api.henmo-ai.com/health/ai"

# Environment variables to set
echo ""
echo "Environment variables to configure:"
echo "NEXT_PUBLIC_SENTRY_DSN=your-frontend-sentry-dsn"
echo "SENTRY_DSN=your-backend-sentry-dsn"
echo "NEXT_PUBLIC_LOGROCKET_ID=your-logrocket-id"
echo "NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key"
echo "NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com"
echo "NEXT_PUBLIC_GA_ID=your-ga-measurement-id"

echo ""
echo "✅ Monitoring setup guide complete!"
echo "Configure the environment variables and deploy to enable monitoring."