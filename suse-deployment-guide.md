# AZAM TV Portal - SUSE Linux Enterprise Server 15 SP6 Deployment Guide

This guide provides comprehensive instructions for deploying the AZAM TV Portal application on SUSE Linux Enterprise Server 15 SP6.

## Table of Contents
- [System Requirements](#system-requirements)
- [Pre-Installation Setup](#pre-installation-setup)
- [Software Installation](#software-installation)
- [Application Deployment](#application-deployment)
- [Web Server Configuration](#web-server-configuration)
- [Database Setup](#database-setup)
- [Process Management](#process-management)
- [Security Configuration](#security-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware Requirements
- **CPU**: 4+ cores (8+ recommended for production)
- **RAM**: 8GB minimum (16GB+ recommended for production)
- **Storage**: 50GB+ available disk space
- **Network**: Stable internet connection

### Software Requirements
- SUSE Linux Enterprise Server 15 SP6
- Root or sudo access
- Open firewall ports: 80, 443, 5000 (configurable)

## Pre-Installation Setup

### 1. Update System
```bash
# Update package repositories
sudo zypper refresh

# Update all packages
sudo zypper update -y

# Reboot if kernel was updated
sudo reboot
```

### 2. Install Essential Tools
```bash
# Install basic development tools
sudo zypper install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    unzip \
    build-essential \
    gcc \
    make

# Install SSL/TLS tools
sudo zypper install -y openssl ca-certificates
```

### 3. Configure Firewall
```bash
# Enable firewall
sudo systemctl enable --now firewalld

# Open required ports
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp

# Reload firewall configuration
sudo firewall-cmd --reload

# Check firewall status
sudo firewall-cmd --list-all
```

## Software Installation

### 1. Install Node.js 18+
```bash
# Add Node.js repository
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Install Node.js
sudo zypper install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PostgreSQL (Optional)
```bash
# Install PostgreSQL
sudo zypper install -y postgresql postgresql-server postgresql-contrib

# Initialize database
sudo systemctl enable postgresql
sudo postgresql-setup initdb

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE azamtv_portal;
CREATE USER azamtv WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE azamtv_portal TO azamtv;
\q
EOF
```

### 3. Install Apache HTTP Server
```bash
# Install Apache
sudo zypper install -y apache2 apache2-mod_ssl

# Enable and start Apache
sudo systemctl enable apache2
sudo systemctl start apache2

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
```

### 4. Install PM2 Process Manager
```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
sudo pm2 startup systemd
```

## Application Deployment

### 1. Create Application User
```bash
# Create dedicated user for the application
sudo useradd -m -s /bin/bash azamtv
sudo usermod -aG wheel azamtv

# Switch to application user
sudo su - azamtv
```

### 2. Clone and Setup Application
```bash
# Clone the repository (as azamtv user)
cd /home/azamtv
git clone https://github.com/your-repo/azam-tv-portal.git
cd azam-tv-portal

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Edit environment variables
vim .env
```

### 3. Configure Environment Variables
```bash
# Edit .env file with production settings
cat > .env << EOF
# API Configuration
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3

# Database Configuration (if using PostgreSQL)
DATABASE_URL=postgresql://azamtv:your_secure_password@localhost:5432/azamtv_portal

# Session Configuration
SESSION_SECRET=your_very_secure_session_secret_here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
EOF
```

### 4. Build Application
```bash
# Build the application
npm run build

# Verify build output
ls -la dist/
```

## Web Server Configuration

### 1. Configure Apache Virtual Host
```bash
# Create virtual host configuration
sudo tee /etc/apache2/sites-available/azamtv-portal.conf << 'EOF'
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    DocumentRoot /home/azamtv/azam-tv-portal/dist/public
    
    # Proxy API requests to Node.js backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/api/
    ProxyPassReverse /api/ http://localhost:5000/api/
    
    # Serve static files directly
    <Directory "/home/azamtv/azam-tv-portal/dist/public">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle client-side routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Logging
    ErrorLog /var/log/apache2/azamtv_error.log
    CustomLog /var/log/apache2/azamtv_access.log combined
</VirtualHost>
EOF

# Enable the site
sudo a2ensite azamtv-portal
sudo systemctl reload apache2
```

### 2. SSL/TLS Configuration with Let's Encrypt
```bash
# Install Certbot
sudo zypper install -y python3-certbot-apache

# Obtain SSL certificate
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Process Management

### 1. Create PM2 Ecosystem File
```bash
# Create PM2 configuration (as azamtv user)
cat > /home/azamtv/azam-tv-portal/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'azamtv-portal',
    script: 'dist/index.js',
    cwd: '/home/azamtv/azam-tv-portal',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/azamtv/error.log',
    out_file: '/var/log/azamtv/access.log',
    log_file: '/var/log/azamtv/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
```

### 2. Setup Logging Directory
```bash
# Create log directory
sudo mkdir -p /var/log/azamtv
sudo chown azamtv:azamtv /var/log/azamtv
sudo chmod 755 /var/log/azamtv
```

### 3. Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Enable PM2 to start on boot
sudo systemctl enable pm2-azamtv
```

## Security Configuration

### 1. Configure UFW Firewall (Alternative)
```bash
# If using UFW instead of firewalld
sudo zypper install -y ufw

# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Install and Configure Fail2Ban
```bash
# Install Fail2Ban
sudo zypper install -y fail2ban

# Create custom configuration
sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[apache-auth]
enabled = true

[apache-badbots]
enabled = true

[apache-noscript]
enabled = true

[apache-overflows]
enabled = true
EOF

# Start and enable Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. Secure PostgreSQL (if used)
```bash
# Edit PostgreSQL configuration
sudo vim /var/lib/pgsql/data/postgresql.conf

# Set listen_addresses = 'localhost'
# Set port = 5432

# Edit pg_hba.conf for authentication
sudo vim /var/lib/pgsql/data/pg_hba.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Monitoring and Logging

### 1. Setup Log Rotation
```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/azamtv << 'EOF'
/var/log/azamtv/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 azamtv azamtv
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### 2. Setup Health Check Script
```bash
# Create health check script
sudo tee /usr/local/bin/azamtv-health-check.sh << 'EOF'
#!/bin/bash

# Health check for AZAM TV Portal
URL="http://localhost:5000/api/health"
TIMEOUT=10

# Check if application responds
if curl -s --max-time $TIMEOUT "$URL" > /dev/null; then
    echo "$(date): AZAM TV Portal is healthy"
    exit 0
else
    echo "$(date): AZAM TV Portal health check failed"
    
    # Restart application if unhealthy
    su - azamtv -c "pm2 restart azamtv-portal"
    echo "$(date): Restarted AZAM TV Portal"
    exit 1
fi
EOF

# Make executable
sudo chmod +x /usr/local/bin/azamtv-health-check.sh

# Add to cron for monitoring
echo "*/5 * * * * /usr/local/bin/azamtv-health-check.sh >> /var/log/azamtv/health-check.log 2>&1" | sudo crontab -
```

### 3. Setup System Monitoring
```bash
# Install htop and iotop for monitoring
sudo zypper install -y htop iotop

# Create monitoring script
sudo tee /usr/local/bin/system-monitor.sh << 'EOF'
#!/bin/bash

echo "=== System Status Report - $(date) ===" >> /var/log/azamtv/system-monitor.log
echo "CPU Usage:" >> /var/log/azamtv/system-monitor.log
top -bn1 | grep "Cpu(s)" >> /var/log/azamtv/system-monitor.log

echo "Memory Usage:" >> /var/log/azamtv/system-monitor.log
free -h >> /var/log/azamtv/system-monitor.log

echo "Disk Usage:" >> /var/log/azamtv/system-monitor.log
df -h >> /var/log/azamtv/system-monitor.log

echo "PM2 Status:" >> /var/log/azamtv/system-monitor.log
su - azamtv -c "pm2 list" >> /var/log/azamtv/system-monitor.log
echo "================================" >> /var/log/azamtv/system-monitor.log
EOF

chmod +x /usr/local/bin/system-monitor.sh

# Run every hour
echo "0 * * * * /usr/local/bin/system-monitor.sh" | sudo crontab -
```

## Backup and Recovery

### 1. Create Backup Script
```bash
# Create backup directory
sudo mkdir -p /backup/azamtv
sudo chown azamtv:azamtv /backup/azamtv

# Create backup script
sudo tee /usr/local/bin/azamtv-backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/backup/azamtv"
APP_DIR="/home/azamtv/azam-tv-portal"
DATE=$(date +"%Y%m%d_%H%M%S")

# Create backup directory for this session
mkdir -p "$BACKUP_DIR/$DATE"

# Backup application files
tar -czf "$BACKUP_DIR/$DATE/application_$DATE.tar.gz" -C /home/azamtv azam-tv-portal

# Backup database (if using PostgreSQL)
if command -v pg_dump &> /dev/null; then
    sudo -u postgres pg_dump azamtv_portal > "$BACKUP_DIR/$DATE/database_$DATE.sql"
fi

# Backup configuration files
cp /etc/apache2/sites-available/azamtv-portal.conf "$BACKUP_DIR/$DATE/"
cp "$APP_DIR/.env" "$BACKUP_DIR/$DATE/"

# Remove backups older than 30 days
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} +

echo "$(date): Backup completed successfully - $DATE"
EOF

# Make executable
sudo chmod +x /usr/local/bin/azamtv-backup.sh

# Schedule daily backups at 2 AM
echo "0 2 * * * /usr/local/bin/azamtv-backup.sh >> /var/log/azamtv/backup.log 2>&1" | sudo crontab -
```

### 2. Create Restore Script
```bash
# Create restore script
sudo tee /usr/local/bin/azamtv-restore.sh << 'EOF'
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_date>"
    echo "Available backups:"
    ls -la /backup/azamtv/
    exit 1
fi

BACKUP_DATE=$1
BACKUP_DIR="/backup/azamtv/$BACKUP_DATE"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "Stopping application..."
su - azamtv -c "pm2 stop azamtv-portal"

echo "Restoring application files..."
cd /home/azamtv
rm -rf azam-tv-portal
tar -xzf "$BACKUP_DIR/application_$BACKUP_DATE.tar.gz"

echo "Restoring database..."
if [ -f "$BACKUP_DIR/database_$BACKUP_DATE.sql" ]; then
    sudo -u postgres dropdb azamtv_portal
    sudo -u postgres createdb azamtv_portal
    sudo -u postgres psql azamtv_portal < "$BACKUP_DIR/database_$BACKUP_DATE.sql"
fi

echo "Starting application..."
su - azamtv -c "cd azam-tv-portal && pm2 start ecosystem.config.js"

echo "Restore completed successfully"
EOF

# Make executable
sudo chmod +x /usr/local/bin/azamtv-restore.sh
```

## Maintenance

### 1. Create Update Script
```bash
# Create update script
sudo tee /usr/local/bin/azamtv-update.sh << 'EOF'
#!/bin/bash

APP_DIR="/home/azamtv/azam-tv-portal"

echo "Starting AZAM TV Portal update process..."

# Backup before update
/usr/local/bin/azamtv-backup.sh

# Pull latest changes
cd "$APP_DIR"
su - azamtv -c "cd azam-tv-portal && git pull origin main"

# Install dependencies
su - azamtv -c "cd azam-tv-portal && npm install"

# Build application
su - azamtv -c "cd azam-tv-portal && npm run build"

# Restart application
su - azamtv -c "pm2 restart azamtv-portal"

echo "Update completed successfully"
EOF

# Make executable
sudo chmod +x /usr/local/bin/azamtv-update.sh
```

### 2. System Maintenance Tasks
```bash
# Create maintenance script
sudo tee /usr/local/bin/system-maintenance.sh << 'EOF'
#!/bin/bash

echo "=== System Maintenance - $(date) ===" >> /var/log/azamtv/maintenance.log

# Update system packages
zypper refresh && zypper update -y >> /var/log/azamtv/maintenance.log 2>&1

# Clean package cache
zypper clean -a >> /var/log/azamtv/maintenance.log 2>&1

# Clear old logs
journalctl --vacuum-time=30d >> /var/log/azamtv/maintenance.log 2>&1

# Clean temporary files
find /tmp -type f -atime +7 -delete >> /var/log/azamtv/maintenance.log 2>&1

# Update SSL certificates
certbot renew --quiet >> /var/log/azamtv/maintenance.log 2>&1

echo "Maintenance completed - $(date)" >> /var/log/azamtv/maintenance.log
EOF

# Make executable
chmod +x /usr/local/bin/system-maintenance.sh

# Schedule weekly maintenance
echo "0 3 * * 0 /usr/local/bin/system-maintenance.sh" | sudo crontab -
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs azamtv-portal

# Check if port is in use
netstat -tulpn | grep :5000

# Restart application
pm2 restart azamtv-portal
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql azamtv_portal -c "SELECT 1;"

# Check PostgreSQL logs
sudo tail -f /var/lib/pgsql/data/log/postgresql-*.log
```

#### 3. Apache Configuration Issues
```bash
# Test Apache configuration
sudo apache2ctl configtest

# Check Apache status
sudo systemctl status apache2

# Check Apache logs
sudo tail -f /var/log/apache2/azamtv_error.log
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect your-domain.com:443

# Renew certificates manually
sudo certbot renew
```

### Performance Tuning

#### 1. Node.js Optimization
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=2048"

# Optimize PM2 cluster mode
pm2 start ecosystem.config.js --instances max
```

#### 2. Apache Optimization
```bash
# Edit Apache configuration
sudo vim /etc/apache2/apache2.conf

# Add optimization settings
echo "
# Performance optimizations
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# Compression
LoadModule deflate_module modules/mod_deflate.so
<Location />
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
</Location>
" | sudo tee -a /etc/apache2/apache2.conf
```

#### 3. Database Optimization
```bash
# Edit PostgreSQL configuration
sudo vim /var/lib/pgsql/data/postgresql.conf

# Optimize for production
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### Security Monitoring

#### 1. Monitor Failed Login Attempts
```bash
# Check fail2ban status
sudo fail2ban-client status

# View banned IPs
sudo fail2ban-client status sshd
```

#### 2. Monitor System Access
```bash
# Check recent logins
last -10

# Monitor active connections
ss -tuln

# Check system integrity
sudo aide --check
```

### Production Checklist

- [ ] System fully updated
- [ ] Firewall configured and active
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Application running with PM2 in cluster mode
- [ ] Database secured and optimized
- [ ] Backup system configured and tested
- [ ] Monitoring and alerting configured
- [ ] Log rotation configured
- [ ] Health checks configured
- [ ] Security hardening applied
- [ ] Performance optimization applied
- [ ] Documentation updated

## Support and Maintenance

### Regular Tasks
- **Daily**: Check application logs and system health
- **Weekly**: Review security logs and apply security updates
- **Monthly**: Test backup and restore procedures
- **Quarterly**: Review and update security configurations

### Emergency Contacts
- System Administrator: [Your Contact Info]
- Application Developer: [Developer Contact Info]
- Database Administrator: [DBA Contact Info]

### Useful Commands Reference
```bash
# Application management
pm2 status                          # Check PM2 status
pm2 logs azamtv-portal              # View application logs
pm2 restart azamtv-portal           # Restart application
pm2 reload azamtv-portal            # Zero-downtime reload

# System monitoring
htop                                # System resources
systemctl status apache2            # Apache status
systemctl status postgresql         # PostgreSQL status
tail -f /var/log/azamtv/error.log   # Application error logs

# Security
sudo fail2ban-client status         # Fail2Ban status
sudo firewall-cmd --list-all        # Firewall rules
sudo certbot certificates           # SSL certificates

# Backup and restore
/usr/local/bin/azamtv-backup.sh     # Manual backup
/usr/local/bin/azamtv-restore.sh    # Restore from backup
```

This deployment guide provides a comprehensive setup for running the AZAM TV Portal on SUSE Linux Enterprise Server 15 SP6 with production-ready configuration, security, monitoring, and maintenance procedures.