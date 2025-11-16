#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Pilgrim Fitness Tracker - Quick Start    ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env and set your configurations${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env manually${NC}"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
fi

# Check if MongoDB is running
echo -e "${BLUE}🔍 Checking MongoDB connection...${NC}"
if command -v mongosh &> /dev/null; then
    mongosh --eval "db.version()" --quiet > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
        echo -e "${YELLOW}   Please start MongoDB first:${NC}"
        echo -e "${YELLOW}   - macOS: brew services start mongodb-community${NC}"
        echo -e "${YELLOW}   - Linux: sudo systemctl start mongodb${NC}"
        echo -e "${YELLOW}   - Windows: Start MongoDB as a service${NC}"
        echo ""
        read -p "Start backend anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  mongosh not found. Cannot verify MongoDB status${NC}"
fi

# Start the backend
echo ""
echo -e "${BLUE}🚀 Starting backend server...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if in development or production
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    echo -e "${YELLOW}💡 Tip: Use 'npm run dev' for auto-reload during development${NC}"
    npm start
fi
