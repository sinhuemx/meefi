#!/bin/bash

# Deploy script for XENON Industrial Articles Frontend
# This script builds and deploys the frontend application

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the Frontend directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Lint the code
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Optional: Deploy to specific platforms
read -p "Deploy to Vercel? (y/n): " deploy_vercel
if [ "$deploy_vercel" = "y" ]; then
    echo "🚀 Deploying to Vercel..."
    npx vercel --prod
fi

read -p "Deploy to Netlify? (y/n): " deploy_netlify
if [ "$deploy_netlify" = "y" ]; then
    echo "🚀 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
fi

echo "🎉 Deployment process completed!"
echo "📁 Build files are available in the 'dist' directory"