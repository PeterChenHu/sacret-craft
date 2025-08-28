#!/bin/bash

# Sacred Craft Marketplace - Deployment Script
# This script runs on the server during CI/CD deployment

set -e

echo "🚀 Starting deployment..."

# Configuration
APP_DIR="/opt/sacred-craft-marketplace"
FRONTEND_DIR="/var/www/sacred-craft-marketplace"
BACKEND_DIR="$APP_DIR/backend"
VENV_DIR="$APP_DIR/venv"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as correct user
if [ "$USER" != "sacred-craft" ]; then
    error "This script must run as sacred-craft user"
fi

# Navigate to app directory
cd "$APP_DIR" || error "Cannot access application directory"

# Backup current version
log "Creating backup of current version..."
BACKUP_DIR="$APP_DIR/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
if [ -d "$FRONTEND_DIR" ] && [ "$(ls -A $FRONTEND_DIR)" ]; then
    cp -r "$FRONTEND_DIR"/* "$BACKUP_DIR/" || warn "Failed to backup frontend"
fi

# Pull latest code
log "Pulling latest code from repository..."
git fetch origin
git reset --hard origin/dev || error "Failed to pull latest code"

# Update backend
log "Updating backend..."
cd "$BACKEND_DIR"

# Activate virtual environment
source "$VENV_DIR/bin/activate" || error "Failed to activate virtual environment"

# Install/update Python dependencies
log "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt || error "Failed to install Python dependencies"

# Install Gunicorn if not present
pip install gunicorn || warn "Failed to install gunicorn"

# Run database migrations
log "Running database migrations..."
python manage.py migrate --noinput || error "Failed to run migrations"

# Collect static files
log "Collecting static files..."
python manage.py collectstatic --noinput || error "Failed to collect static files"

# Clear Python cache
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Update frontend
log "Updating frontend..."
if [ -d "dist" ]; then
    sudo rm -rf "$FRONTEND_DIR"/*
    sudo cp -r dist/* "$FRONTEND_DIR/"
    sudo chown -R sacred-craft:sacred-craft "$FRONTEND_DIR"
else
    warn "No dist directory found, skipping frontend update"
fi

# Restart services
log "Restarting services..."
sudo systemctl restart sacred-craft-backend || error "Failed to restart backend service"
sudo systemctl restart sacred-craft-frontend || warn "Failed to restart frontend service"

# Reload nginx
log "Reloading nginx..."
sudo systemctl reload nginx || error "Failed to reload nginx"

# Health check
log "Performing health check..."
sleep 5

# Check if services are running
if systemctl is-active --quiet sacred-craft-backend; then
    log "Backend service is running"
else
    error "Backend service failed to start"
fi

if systemctl is-active --quiet sacred-craft-frontend; then
    log "Frontend service is running"
else
    warn "Frontend service is not running"
fi

# Check nginx status
if systemctl is-active --quiet nginx; then
    log "Nginx is running"
else
    error "Nginx is not running"
fi

# Cleanup old backups (keep last 5)
log "Cleaning up old backups..."
cd "$APP_DIR/backups"
ls -t | tail -n +6 | xargs -r rm -rf

# Deployment completed
log "✅ Deployment completed successfully!"
log "🌐 Application should be accessible at your domain"
log "📊 Check service status with: sudo systemctl status sacred-craft-*"

# Optional: Send notification
if command -v curl >/dev/null 2>&1; then
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ Sacred Craft Marketplace deployed successfully!\"}" \
            "$SLACK_WEBHOOK_URL" || true
    fi
fi
