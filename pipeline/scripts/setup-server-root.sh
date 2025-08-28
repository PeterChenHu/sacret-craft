#!/bin/bash

# Sacred Craft Marketplace - Ubuntu Server Setup Script (Root User)
# Run this script on your Ubuntu server as root to set up the deployment environment

set -e

echo "🚀 Setting up Sacred Craft Marketplace server (Root User)..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
apt install -y \
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

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/sacred-craft-marketplace
mkdir -p /var/www/sacred-craft-marketplace
mkdir -p /var/log/sacred-craft

# Setup PostgreSQL
echo "🐘 Setting up PostgreSQL..."
sudo -u postgres createuser --createdb --createrole sacred-craft || echo "User already exists"
sudo -u postgres createdb sacred_craft_marketplace || echo "Database already exists"

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd /opt/sacred-craft-marketplace
python3 -m venv venv
venv/bin/pip install --upgrade pip

# Setup Nginx configuration
echo "🌐 Setting up Nginx..."
tee /etc/nginx/sites-available/sacred-craft-marketplace > /dev/null <<EOF
server {
    listen 80;
    server_name 121.40.23.186;  # Your server IP
    
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

# Enable the site
echo "🔗 Enabling Nginx site..."
ln -sf /etc/nginx/sites-available/sacred-craft-marketplace /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

# Start and enable services
echo "🚀 Starting and enabling services..."
systemctl start nginx
systemctl enable nginx
systemctl start postgresql
systemctl enable postgresql
systemctl start redis-server
systemctl enable redis-server

# Create systemd service for backend
echo "⚙️ Creating systemd service for backend..."
tee /etc/systemd/system/sacred-craft-backend.service > /dev/null <<EOF
[Unit]
Description=Sacred Craft Marketplace Backend
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/sacred-craft-marketplace/backend
Environment=PATH=/opt/sacred-craft-marketplace/venv/bin
ExecStart=/opt/sacred-craft-marketplace/venv/bin/python manage.py runserver 0.0.0.0:8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for frontend
echo "⚙️ Creating systemd service for frontend..."
tee /etc/systemd/system/sacred-craft-frontend.service > /dev/null <<EOF
[Unit]
Description=Sacred Craft Marketplace Frontend
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/var/www/sacred-craft-marketplace
ExecStart=/usr/bin/python3 -m http.server 3000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable services
echo "🔄 Reloading systemd and enabling services..."
systemctl daemon-reload
systemctl enable sacred-craft-backend
systemctl enable sacred-craft-frontend

# Setup firewall
echo "🔥 Setting up firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Server setup completed!"
echo "🌐 Your application will be accessible at: http://121.40.23.186"
echo "📁 Application directory: /opt/sacred-craft-marketplace"
echo "🔧 Next step: Clone your repository and deploy!"
