#!/bin/bash

# Deploy script for MERN Audio Transcription
# Usage: ./deploy.sh

echo "🚀 MERN Audio Transcription - Deployment Script"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm run install:all

# Step 2: Build backend
echo -e "${YELLOW}🔨 Building backend...${NC}"
cd server
npm run build
cd ..

# Step 3: Build frontend
echo -e "${YELLOW}🎨 Building frontend...${NC}"
cd client
npm run build
cd ..

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📂 Output files:"
echo "  - Backend: server/dist/"
echo "  - Frontend: client/dist/"
echo ""
echo "🚀 Deployment instructions:"
echo ""
echo "Frontend (Vercel):"
echo "  1. cd client"
echo "  2. vercel --prod"
echo "  3. Set VITE_SERVER_URL to your backend URL"
echo ""
echo "Backend (Render):"
echo "  1. Push to GitHub"
echo "  2. Create Web Service on Render"
echo "  3. Set build command: npm run build:server"
echo "  4. Set start command: npm run start:server"
echo "  5. Add environment variables: GEMINI_API_KEY, PORT, CLIENT_URL"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
