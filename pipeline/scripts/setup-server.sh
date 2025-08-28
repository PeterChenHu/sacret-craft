#!/bin/bash

# Sacred Craft Marketplace - Ubuntu Server Setup Script
# Run this script on your Ubuntu server to set up the deployment environment

set -e

echo "🚀 Setting up Sacred Craft Marketplace server..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    libpq-dev \
    postgresql \
    postgresql-contrib \
    redis-server \
    git \
    curl \
    unzip \
    supervisor \
    certbot \
    python3-certbot-nginx

# Create application user
echo "👤 Creating application user..."
sudo useradd -m -s /bin/bash sacred-craft || echo "User already exists"
sudo usermod -aG sudo sacred-craft

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/sacred-craft-marketplace
sudo mkdir -p /var/www/sacred-craft-marketplace
sudo mkdir -p /var/log/sacred-craft
sudo chown -R sacred-craft:sacred-craft /opt/sacred-craft-marketplace
sudo chown -R sacred-craft:sacred-craft /var/www/sacred-craft-marketplace
sudo chown -R sacred-craft:sacred-craft /var/log/sacred-craft

# Setup PostgreSQL
echo "🐘 Setting up PostgreSQL..."
sudo -u postgres createuser --createdb --createrole sacred-craft || echo "User already exists"
sudo -u postgres createdb sacred_craft_marketplace || echo "Database already exists"

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd /opt/sacred-craft-marketplace
sudo -u sacred-craft python3 -m venv venv
sudo -u sacred-craft venv/bin/pip install --upgrade pip

# Setup Nginx configuration
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/sites-available/sacred-craft-marketplace > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your actual domain
    
    # Frontend
    location / {
        root /var/www/sacred-craft-marketplace;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Media files
    location /media/ {
        alias /opt/sacred-craft-marketplace/backend/media/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Static files
    location /static/ {
        alias /opt/sacred-craft-marketplace/backend/static/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/sacred-craft-marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx

# Setup systemd services
echo "⚙️ Setting up systemd services..."

# Backend service
sudo tee /etc/systemd/system/sacred-craft-backend.service > /dev/null <<EOF
[Unit]
Description=Sacred Craft Marketplace Backend
After=network.target postgresql.service

[Service]
Type=simple
User=sacred-craft
Group=sacred-craft
WorkingDirectory=/opt/sacred-craft-marketplace/backend
Environment=PATH=/opt/sacred-craft-marketplace/venv/bin
ExecStart=/opt/sacred-craft-marketplace/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 sacred_crafts.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Frontend service (if needed for SSR)
sudo tee /etc/systemd/system/sacred-craft-frontend.service > /dev/null <<EOF
[Unit]
Description=Sacred Craft Marketplace Frontend
After=network.target

[Service]
Type=simple
User=sacred-craft
Group=sacred-craft
WorkingDirectory=/var/www/sacred-craft-marketplace
ExecStart=/usr/bin/python3 -m http.server 3000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable services
sudo systemctl daemon-reload
sudo systemctl enable sacred-craft-backend
sudo systemctl enable sacred-craft-frontend

# Setup Redis
echo "🔴 Setting up Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Setup firewall
echo "🔥 Setting up firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Setup SSL with Let's Encrypt (optional)
echo "🔒 SSL setup instructions:"
echo "1. Update the domain in nginx config"
echo "2. Run: sudo certbot --nginx -d your-domain.com"
echo "3. Certbot will automatically update nginx config"

echo "✅ Server setup completed!"
echo "📋 Next steps:"
echo "1. Clone your repository to /opt/sacred-craft-marketplace"
echo "2. Update nginx domain configuration"
echo "3. Set up environment variables"
echo "4. Run initial migrations"
echo "5. Configure GitHub Actions secrets"
