#!/bin/bash

echo "🚀 Setting up AWS infrastructure..."

# Install AWS CLI if not exists
if ! command -v aws &> /dev/null; then
    echo "Please install AWS CLI first"
    exit 1
fi

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file aws/cloudformation.yml \
  --stack-name henmo-ai-infrastructure \
  --parameter-overrides Environment=production \
  --capabilities CAPABILITY_IAM

# Get outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name henmo-ai-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text)

CDN_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name henmo-ai-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`CDNDomain`].OutputValue' \
  --output text)

echo "✅ AWS setup complete!"
echo "S3 Bucket: $BUCKET_NAME"
echo "CloudFront Domain: $CDN_DOMAIN"