#!/bin/bash

# Sound - Audio Visualizer & Transcription System
# Automated Setup Script for Unix/Linux/macOS

set -e  # Exit on error

echo "========================================"
echo "Sound - Audio Visualizer Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    echo "  Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: v$NPM_VERSION"
else
    print_error "npm is not installed"
    echo "  npm should come with Node.js"
    exit 1
fi

# Check Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java is installed: $JAVA_VERSION"
else
    print_error "Java is not installed"
    echo "  Please install Java JDK 17+ from https://adoptium.net/"
    exit 1
fi

# Check Maven
if command_exists mvn; then
    MVN_VERSION=$(mvn --version | head -n 1)
    print_success "Maven is installed: $MVN_VERSION"
else
    print_error "Maven is not installed"
    echo "  Please install Maven 3.6+ from https://maven.apache.org/download.cgi"
    exit 1
fi

echo ""
echo "========================================"
echo "Installing Dependencies"
echo "========================================"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend
print_info "Running: mvn clean install"
if mvn clean install -DskipTests; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Backend setup failed"
    exit 1
fi
cd ..

echo ""

# Setup frontend
echo "Setting up frontend..."
cd frontend
print_info "Running: npm install"
if npm install; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Frontend setup failed"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "Setup Complete! 🎉"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend (Terminal 1):"
echo "   cd backend"
echo "   mvn spring-boot:run"
echo ""
echo "2. Start the frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "Optional: Set Gemini API key for real transcription:"
echo "   export GEMINI_API_KEY=\"your_api_key_here\""
echo ""
echo "For more details, see RUN_INSTRUCTIONS.md"
echo ""
