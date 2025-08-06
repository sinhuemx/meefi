#!/bin/bash

# Setup script for XENON Industrial Articles Frontend
# This script sets up the development environment

set -e  # Exit on any error

echo "🔧 Setting up XENON Industrial Articles Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16.0 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo "🔧 Please update the .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your backend API URL"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3001 in your browser"
echo ""
echo "🚀 Happy coding!"