#!/bin/bash

# Sacred Craft Marketplace - Quick Start Script
# This script provides a quick way to get your application running

set -e

echo "🚀 Sacred Craft Marketplace - Quick Start"
echo "=========================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    echo "   Run as a regular user with sudo privileges"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd ../backend
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cp ../pipeline/scripts/env.example .env
    echo "📝 Please edit .env file with your configuration"
    echo "   Then run this script again"
    exit 0
fi

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser
echo "👤 Creating superuser..."
echo "Please enter details for the admin user:"
python manage.py createsuperuser

# Start development server
echo "🚀 Starting development server..."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"

# Start both servers in background
cd ../frontend
npm run dev &
cd ../backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &

# Wait for user to stop
wait
