#!/bin/bash

echo "🚀 UsTime Setup Script"
echo "====================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
else
    echo -e "${GREEN}✅ Node.js installed:${NC} $(node -v)"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
else
    echo -e "${GREEN}✅ Docker installed:${NC} $(docker -v)"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo ""
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start database${NC}"
    exit 1
fi

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🗄️  Setting up database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database setup failed${NC}"
    echo "Try running: docker-compose down -v && docker-compose up -d"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Open a new terminal and run: ${YELLOW}npm run dev:server${NC}"
echo "2. Open another terminal and run: ${YELLOW}npm run dev${NC}"
echo "3. Visit http://localhost:3000"
echo ""
echo "💡 To stop the database: ${YELLOW}docker-compose down${NC}"
