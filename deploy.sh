#!/bin/bash

# Build and deploy script for Docker

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker-compose build

echo -e "${YELLOW}🔄 Stopping existing containers...${NC}"
docker-compose down

echo -e "${YELLOW}🚀 Starting new containers...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Waiting for application to be ready...${NC}"
sleep 10

# Health check
if curl -f http://localhost:3030/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is running successfully!${NC}"
    echo -e "${GREEN}🌐 Access your application at: http://localhost:3030${NC}"
else
    echo -e "${RED}❌ Application failed to start properly${NC}"
    echo -e "${YELLOW}📋 Checking logs...${NC}"
    docker-compose logs --tail=50
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
