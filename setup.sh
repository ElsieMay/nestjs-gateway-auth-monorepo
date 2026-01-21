#!/bin/bash

# Setup script for NestJS Gateway Auth Monorepo
# This script helps you get started quickly

set -e

echo "🚀 Setting up NestJS Gateway Auth Monorepo..."
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Install from https://docker.com for easiest setup"
    DOCKER_AVAILABLE=false
else
    echo "✅ Docker $(docker --version | cut -d ' ' -f3)"
    DOCKER_AVAILABLE=true
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please edit .env and set JWT_SECRET to a secure random string"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Docker is available! Quick start options:"
    echo ""
    echo "Option 1: Start with Docker (Recommended)"
    echo "  docker-compose up -d"
    echo "  ./test-api.sh"
    echo ""
    echo "Option 2: Start services manually"
    echo "  Terminal 1: npm run start:auth"
    echo "  Terminal 2: npm run start:gateway"
else
    echo "📝 To start the application:"
    echo ""
    echo "1. Make sure PostgreSQL is running on port 5432"
    echo "   (or run: docker-compose up postgres -d)"
    echo ""
    echo "2. Start services in separate terminals:"
    echo "   Terminal 1: npm run start:auth"
    echo "   Terminal 2: npm run start:gateway"
fi

echo ""
echo "📚 Documentation:"
echo "  - GETTING_STARTED.md - Detailed guide"
echo "  - DOCKER.md - Docker documentation"
echo "  - README.md - Full project documentation"
echo ""
echo "🌐 Once running, visit:"
echo "  - API: http://localhost:3000"
echo "  - Swagger Docs: http://localhost:3000/api"
echo ""
