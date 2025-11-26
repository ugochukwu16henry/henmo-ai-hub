#!/bin/bash

echo "🚀 Deploying to Vercel..."

cd apps/hub/hub

# Install Vercel CLI if not exists
if ! command -v vercel &> /dev/null; then
    npm install -g vercel@latest
fi

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_APP_URL production

# Deploy to production
vercel --prod --yes

echo "✅ Vercel deployment complete!"