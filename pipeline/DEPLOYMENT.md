# 🚀 Sacred Craft Marketplace - Deployment Guide

This guide covers deploying your Sacred Craft Marketplace application to an Ubuntu server using automated CI/CD pipelines.

## 📋 Prerequisites

- Ubuntu 20.04+ server
- Domain name (optional but recommended)
- GitHub repository with your code
- SSH access to your server

## 🏗️ Server Setup

### 1. Initial Server Setup

```bash
# Connect to your server
ssh root@your-server-ip

# Run the setup script
curl -sSL https://raw.githubusercontent.com/your-username/sacred-craft-marketplace/dev/pipeline/scripts/setup-server.sh | bash
```

### 2. Manual Setup (Alternative)

If you prefer manual setup, follow these steps:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx python3 python3-pip python3-venv postgresql redis-server git

# Create application user
sudo useradd -m -s /bin/bash sacred-craft
sudo usermod -aG sudo sacred-craft

# Create directories
sudo mkdir -p /opt/sacred-craft-marketplace
sudo mkdir -p /var/www/sacred-craft-marketplace
sudo chown -R sacred-craft:sacred-craft /opt/sacred-craft-marketplace
sudo chown -R sacred-craft:sacred-craft /var/www/sacred-craft-marketplace
```

## 🔐 GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

- `SERVER_HOST`: Your server's IP address or domain
- `SERVER_USERNAME`: `sacred-craft`
- `SERVER_SSH_KEY`: Your private SSH key for server access
- `SERVER_PORT`: `22` (default SSH port)

### 2. SSH Key Setup

```bash
# On your local machine, generate SSH key
ssh-keygen -t ed25519 -C "github-actions"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub sacred-craft@your-server-ip

# Copy private key content to GitHub secret
cat ~/.ssh/id_ed25519
```

## 🚀 Deployment Methods

### Method 1: GitHub Actions (Recommended)

1. Push to `dev` branch
2. GitHub Actions automatically:
   - Runs tests
   - Builds frontend
   - Deploys to server

### Method 2: Manual Deployment

```bash
# On your server
cd /opt/sacred-craft-marketplace
git pull origin dev

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Update frontend
sudo rm -rf /var/www/sacred-craft-marketplace/*
sudo cp -r dist/* /var/www/sacred-craft-marketplace/

# Restart services
sudo systemctl restart sacred-craft-backend
sudo systemctl restart sacred-craft-frontend
sudo systemctl reload nginx
```

### Method 3: Docker Deployment

```bash
# Build and run with Docker Compose
cd pipeline
docker-compose up -d --build

# View logs
docker-compose logs -f
```

## ⚙️ Configuration

### 1. Environment Variables

```bash
# Copy environment template
cp pipeline/scripts/env.example .env

# Edit with your values
nano .env
```

### 2. Database Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE sacred_craft_marketplace;
CREATE USER sacred-craft WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE sacred_craft_marketplace TO sacred-craft;
\q
```

### 3. Nginx Configuration

```bash
# Update domain in nginx config
sudo nano /etc/nginx/sites-available/sacred-craft-marketplace

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## 🔒 SSL Certificate

### Let's Encrypt Setup

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Maintenance

### 1. Service Status

```bash
# Check service status
sudo systemctl status sacred-craft-backend
sudo systemctl status sacred-craft-frontend
sudo systemctl status nginx

# View logs
sudo journalctl -u sacred-craft-backend -f
sudo journalctl -u sacred-craft-frontend -f
```

### 2. Database Backup

```bash
# Create backup script
sudo nano /opt/sacred-craft-marketplace/pipeline/scripts/backup-db.sh

# Make executable
chmod +x /opt/sacred-craft-marketplace/pipeline/scripts/backup-db.sh

# Add to crontab for daily backups
sudo crontab -e
# Add: 0 2 * * * /opt/sacred-craft-marketplace/pipeline/scripts/backup-db.sh
```

### 3. Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/sacred-craft

# Add configuration
/var/log/sacred-craft/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 sacred-craft sacred-craft
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   sudo systemctl status sacred-craft-backend
   sudo journalctl -u sacred-craft-backend -n 50
   ```

2. **Database connection failed**
   ```bash
   sudo -u postgres psql -c "\l"
   sudo systemctl status postgresql
   ```

3. **Nginx configuration error**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **Permission denied**
   ```bash
   sudo chown -R sacred-craft:sacred-craft /opt/sacred-craft-marketplace
   sudo chown -R sacred-craft:sacred-craft /var/www/sacred-craft-marketplace
   ```

### Performance Tuning

1. **Database optimization**
   ```bash
   # Edit PostgreSQL config
   sudo nano /etc/postgresql/*/main/postgresql.conf
   
   # Key settings:
   shared_buffers = 256MB
   effective_cache_size = 1GB
   work_mem = 4MB
   ```

2. **Nginx optimization**
   ```bash
   # Edit nginx config
   sudo nano /etc/nginx/nginx.conf
   
   # Key settings:
   worker_processes auto;
   worker_connections 1024;
   ```

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   - Use HAProxy or Nginx as load balancer
   - Multiple backend servers
   - Session persistence

2. **Database Scaling**
   - Read replicas for read-heavy operations
   - Connection pooling with PgBouncer
   - Database sharding for large datasets

### Vertical Scaling

1. **Server Resources**
   - Increase CPU cores
   - Add more RAM
   - Use SSD storage

2. **Application Optimization**
   - Redis caching
   - CDN for static assets
   - Database query optimization

## 🔄 Rollback Strategy

### Quick Rollback

```bash
# Stop services
sudo systemctl stop sacred-craft-backend
sudo systemctl stop sacred-craft-frontend

# Restore from backup
sudo cp -r /opt/sacred-craft-marketplace/backups/latest/* /var/www/sacred-craft-marketplace/

# Restart services
sudo systemctl start sacred-craft-backend
sudo systemctl start sacred-craft-frontend
```

### Automated Rollback

The deployment script automatically creates backups. To rollback:

```bash
cd /opt/sacred-craft-marketplace
./pipeline/scripts/rollback.sh
```

## 📞 Support

- Check logs: `/var/log/sacred-craft/`
- Service status: `sudo systemctl status sacred-craft-*`
- GitHub Issues: [Repository Issues](https://github.com/your-username/sacred-craft-marketplace/issues)

---

**Happy Deploying! 🎉**
