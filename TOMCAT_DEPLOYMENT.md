# AZAM TV Portal - Tomcat Deployment Guide

## Overview

This document provides step-by-step instructions for deploying the AZAM TV Portal application on Apache Tomcat server. The application is a full-stack Node.js/React application that requires specific configuration for Tomcat deployment.

## Prerequisites

Before deploying, ensure you have the following installed:

- **Apache Tomcat 9.0+** (recommended version 9.0.75 or later)
- **Java 8+** (Java 11 or 17 recommended)
- **Node.js 18+** and npm
- **Git** for source code management

## System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **CPU**: 2 cores (4 cores recommended)
- **Storage**: 10GB free space
- **OS**: Linux (Ubuntu 20.04+), Windows Server 2019+, or macOS

### Network Requirements
- **Port 8080**: Default Tomcat HTTP port
- **Port 8443**: Tomcat HTTPS port (if SSL configured)
- **Port 5000**: Application backend port (internal)

## Step 1: Prepare the Application

### 1.1 Clone and Build the Application

```bash
# Clone the repository
git clone <repository-url>
cd azam-tv-portal

# Install dependencies
npm install

# Build the application for production
npm run build
```

### 1.2 Verify Build Output

After building, you should have:
- `dist/public/` - Frontend build files
- `dist/index.js` - Backend server file
- `node_modules/` - Dependencies

## Step 2: Configure Tomcat

### 2.1 Install Apache Tomcat

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install tomcat9 tomcat9-admin
sudo systemctl enable tomcat9
sudo systemctl start tomcat9
```

#### CentOS/RHEL:
```bash
sudo yum update
sudo yum install tomcat tomcat-admin-webapps
sudo systemctl enable tomcat
sudo systemctl start tomcat
```

#### Manual Installation:
```bash
# Download Tomcat
wget https://downloads.apache.org/tomcat/tomcat-9/v9.0.75/bin/apache-tomcat-9.0.75.tar.gz
tar -xzf apache-tomcat-9.0.75.tar.gz
sudo mv apache-tomcat-9.0.75 /opt/tomcat
```

### 2.2 Configure Tomcat Users

Edit `/opt/tomcat/conf/tomcat-users.xml`:

```xml
<?xml version='1.0' encoding='utf-8'?>
<tomcat-users>
  <role rolename="manager-gui"/>
  <role rolename="manager-script"/>
  <role rolename="admin-gui"/>
  <user username="admin" password="your-secure-password" roles="manager-gui,admin-gui"/>
  <user username="deployer" password="your-deploy-password" roles="manager-script"/>
</tomcat-users>
```

### 2.3 Configure Memory Settings

Edit `/opt/tomcat/bin/setenv.sh` (create if not exists):

```bash
#!/bin/bash
export CATALINA_OPTS="$CATALINA_OPTS -Xms512m"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx2048m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:MaxPermSize=256m"
export CATALINA_OPTS="$CATALINA_OPTS -Djava.awt.headless=true"
```

## Step 3: Deployment Methods

### Method 1: WAR File Deployment (Recommended)

#### 3.1 Create WAR Structure

```bash
# Create deployment directory
mkdir -p azam-tv-war/WEB-INF/classes
mkdir -p azam-tv-war/WEB-INF/lib

# Copy built application
cp -r dist/public/* azam-tv-war/
cp dist/index.js azam-tv-war/WEB-INF/classes/
cp -r node_modules azam-tv-war/WEB-INF/lib/
```

#### 3.2 Create web.xml

Create `azam-tv-war/WEB-INF/web.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

  <display-name>AZAM TV Portal</display-name>
  <description>AZAM TV Agent Management Portal</description>

  <!-- Default servlet configuration for static files -->
  <servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>

  <!-- Welcome file list -->
  <welcome-file-list>
    <welcome-file>index.html</welcome-file>
  </welcome-file-list>

  <!-- Error pages -->
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>

  <!-- Security constraints (optional) -->
  <security-constraint>
    <web-resource-collection>
      <web-resource-name>Admin Panel</web-resource-name>
      <url-pattern>/admin/*</url-pattern>
    </web-resource-collection>
    <auth-constraint>
      <role-name>admin</role-name>
    </auth-constraint>
  </security-constraint>

</web-app>
```

#### 3.3 Create WAR File

```bash
cd azam-tv-war
jar -cvf ../azam-tv-portal.war *
cd ..
```

#### 3.4 Deploy WAR File

```bash
# Copy WAR to Tomcat webapps directory
sudo cp azam-tv-portal.war /opt/tomcat/webapps/

# Or use Tomcat Manager (via web interface)
# Upload azam-tv-portal.war through http://localhost:8080/manager/html
```

### Method 2: Directory Deployment

#### 2.1 Direct Deployment

```bash
# Create application directory in webapps
sudo mkdir -p /opt/tomcat/webapps/azam-tv-portal

# Copy application files
sudo cp -r dist/public/* /opt/tomcat/webapps/azam-tv-portal/
sudo mkdir -p /opt/tomcat/webapps/azam-tv-portal/WEB-INF
sudo cp azam-tv-war/WEB-INF/web.xml /opt/tomcat/webapps/azam-tv-portal/WEB-INF/
```

## Step 4: Configure Node.js Backend

### 4.1 Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

### 4.2 Create PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'azam-tv-backend',
    script: 'dist/index.js',
    cwd: '/path/to/azam-tv-portal',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/azam-tv/error.log',
    out_file: '/var/log/azam-tv/out.log',
    log_file: '/var/log/azam-tv/combined.log',
    time: true
  }]
};
```

### 4.3 Start Backend Service

```bash
# Create log directory
sudo mkdir -p /var/log/azam-tv

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

## Step 5: Configure Reverse Proxy

### 5.1 Install and Configure Apache HTTP Server

```bash
# Install Apache
sudo apt install apache2
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite
```

### 5.2 Create Virtual Host

Create `/etc/apache2/sites-available/azam-tv-portal.conf`:

```apache
<VirtualHost *:80>
    ServerName azam-tv-portal.com
    DocumentRoot /opt/tomcat/webapps/azam-tv-portal

    # Proxy API requests to Node.js backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/api/
    ProxyPassReverse /api/ http://localhost:5000/api/

    # Serve static files from Tomcat
    <Directory "/opt/tomcat/webapps/azam-tv-portal">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Enable client-side routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/azam-tv-error.log
    CustomLog ${APACHE_LOG_DIR}/azam-tv-access.log combined
</VirtualHost>
```

### 5.3 Enable the Site

```bash
sudo a2ensite azam-tv-portal.conf
sudo systemctl reload apache2
```

## Step 6: SSL/HTTPS Configuration (Optional but Recommended)

### 6.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-apache
```

### 6.2 Obtain SSL Certificate

```bash
sudo certbot --apache -d azam-tv-portal.com
```

### 6.3 Configure HTTPS Virtual Host

```apache
<VirtualHost *:443>
    ServerName azam-tv-portal.com
    DocumentRoot /opt/tomcat/webapps/azam-tv-portal

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/azam-tv-portal.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/azam-tv-portal.com/privkey.pem

    # Same proxy and directory configuration as HTTP
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/api/
    ProxyPassReverse /api/ http://localhost:5000/api/

    <Directory "/opt/tomcat/webapps/azam-tv-portal">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## Step 7: Environment Configuration

### 7.1 Create Environment File

Create `.env.production`:

```bash
# Application Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration (if using external database)
DATABASE_URL=your-database-url
DB_HOST=localhost
DB_PORT=5432
DB_NAME=azam_tv_portal
DB_USER=azam_user
DB_PASSWORD=secure_password

# Security Configuration
SESSION_SECRET=your-very-secure-session-secret
JWT_SECRET=your-jwt-secret

# API Keys (if required)
# Add your external API keys here
```

### 7.2 Update Application Configuration

Update `server/index.ts` to read from environment:

```javascript
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
```

## Step 8: Database Setup (If Required)

### 8.1 PostgreSQL Installation (Optional)

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE azam_tv_portal;
CREATE USER azam_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE azam_tv_portal TO azam_user;
\q
```

### 8.2 Database Migration (If using database)

```bash
# Run migrations (if you have them)
npm run migrate
```

## Step 9: Monitoring and Logging

### 9.1 Configure Log Rotation

Create `/etc/logrotate.d/azam-tv`:

```bash
/var/log/azam-tv/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload azam-tv-backend
    endscript
}
```

### 9.2 Setup System Monitoring

```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor PM2 processes
pm2 monit

# Check application logs
pm2 logs azam-tv-backend
```

## Step 10: Security Hardening

### 10.1 Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8080/tcp  # Tomcat (optional, for direct access)
sudo ufw enable
```

### 10.2 Tomcat Security

Edit `/opt/tomcat/conf/server.xml`:

```xml
<!-- Disable unnecessary connectors -->
<!-- <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" /> -->

<!-- Hide server information -->
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"
           server="Unknown" />
```

## Step 11: Backup Strategy

### 11.1 Create Backup Script

Create `/opt/scripts/backup-azam-tv.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/backup/azam-tv"
APP_DIR="/path/to/azam-tv-portal"
DB_NAME="azam_tv_portal"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup application files
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C "$APP_DIR" .

# Backup database (if using PostgreSQL)
pg_dump "$DB_NAME" > "$BACKUP_DIR/db_$DATE.sql"

# Compress database backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Remove backups older than 30 days
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### 11.2 Schedule Backups

```bash
# Add to crontab
sudo crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /opt/scripts/backup-azam-tv.sh
```

## Step 12: Testing and Verification

### 12.1 Health Check Script

Create `/opt/scripts/health-check.sh`:

```bash
#!/bin/bash

# Check Tomcat status
if curl -f http://localhost:8080/azam-tv-portal/ > /dev/null 2>&1; then
    echo "✓ Tomcat frontend is running"
else
    echo "✗ Tomcat frontend is down"
fi

# Check Node.js backend status
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✓ Node.js backend is running"
else
    echo "✗ Node.js backend is down"
fi

# Check PM2 processes
pm2 jlist | grep -q "azam-tv-backend" && echo "✓ PM2 process is running" || echo "✗ PM2 process is down"
```

### 12.2 Performance Testing

```bash
# Install Apache Bench for load testing
sudo apt install apache2-utils

# Test application performance
ab -n 1000 -c 10 http://localhost/azam-tv-portal/
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   sudo netstat -tulpn | grep :8080
   sudo netstat -tulpn | grep :5000
   ```

2. **Permission Issues**
   ```bash
   # Fix Tomcat permissions
   sudo chown -R tomcat:tomcat /opt/tomcat
   sudo chmod +x /opt/tomcat/bin/*.sh
   ```

3. **Memory Issues**
   ```bash
   # Increase Tomcat memory
   export CATALINA_OPTS="-Xmx4096m"
   ```

4. **Log Analysis**
   ```bash
   # Check Tomcat logs
   tail -f /opt/tomcat/logs/catalina.out
   
   # Check application logs
   pm2 logs azam-tv-backend
   ```

## Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**
   ```bash
   npm audit
   npm update
   ```

2. **Restart Services**
   ```bash
   sudo systemctl restart tomcat9
   pm2 restart azam-tv-backend
   ```

3. **Monitor Disk Space**
   ```bash
   df -h
   du -sh /opt/tomcat/logs/*
   ```

4. **Database Maintenance** (if applicable)
   ```bash
   # PostgreSQL vacuum
   sudo -u postgres psql -d azam_tv_portal -c "VACUUM ANALYZE;"
   ```

## Support and Documentation

- **Application Logs**: `/var/log/azam-tv/`
- **Tomcat Logs**: `/opt/tomcat/logs/`
- **Configuration Files**: `/opt/tomcat/conf/`
- **Application Directory**: `/opt/tomcat/webapps/azam-tv-portal/`

For additional support, refer to:
- Apache Tomcat Documentation: https://tomcat.apache.org/tomcat-9.0-doc/
- Node.js Production Deployment: https://nodejs.org/en/docs/guides/getting-started-guide/
- PM2 Documentation: https://pm2.keymetrics.io/docs/

---

**Last Updated**: January 2025
**Version**: 1.0
**Contact**: AZAM TV IT Team