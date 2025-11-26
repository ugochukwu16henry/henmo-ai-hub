#!/bin/bash

echo "🚀 Deploying to Railway..."

# Install Railway CLI if not exists
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli
fi

# Login to Railway
railway login

# Link to project
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=$DATABASE_URL
railway variables set JWT_SECRET=$JWT_SECRET
railway variables set ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
railway variables set OPENAI_API_KEY=$OPENAI_API_KEY

# Deploy
railway up --detach

echo "✅ Railway deployment complete!"