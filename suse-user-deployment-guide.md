# AZAM TV Portal - SUSE Linux Enterprise Server 15 SP6 User Deployment Guide

This guide provides instructions for deploying the AZAM TV Portal application on SUSE Linux Enterprise Server 15 SP6 **without requiring sudo privileges**. All installations and configurations are done in user space.

## Table of Contents
- [Prerequisites](#prerequisites)
- [User Space Setup](#user-space-setup)
- [Software Installation](#software-installation)
- [Application Deployment](#application-deployment)
- [Process Management](#process-management)
- [Database Setup (Optional)](#database-setup-optional)
- [Web Server Configuration](#web-server-configuration)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup Procedures](#backup-procedures)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Access Requirements
- Regular user account on SUSE Linux Enterprise Server 15 SP6
- Home directory write permissions
- Network access for downloading packages
- Ability to bind to high ports (1024+)

### Initial Setup
```bash
# Verify your user account
whoami
id

# Check home directory permissions
ls -la ~

# Verify network connectivity
ping -c 3 google.com
```

## User Space Setup

### 1. Create Application Directory Structure
```bash
# Create main application directories
mkdir -p ~/azamtv-portal
mkdir -p ~/azamtv-portal/logs
mkdir -p ~/azamtv-portal/backups
mkdir -p ~/azamtv-portal/temp
mkdir -p ~/local/bin
mkdir -p ~/local/lib
mkdir -p ~/local/share

# Add local bin to PATH
echo 'export PATH="$HOME/local/bin:$PATH"' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH="$HOME/local/lib:$LD_LIBRARY_PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 2. Set Up Environment Variables
```bash
# Create environment configuration
cat > ~/.azamtv_env << 'EOF'
# AZAM TV Portal Environment Configuration
export AZAMTV_HOME="$HOME/azamtv-portal"
export AZAMTV_LOGS="$HOME/azamtv-portal/logs"
export AZAMTV_BACKUPS="$HOME/azamtv-portal/backups"
export AZAMTV_PORT=8080
export AZAMTV_HOST=0.0.0.0
export NODE_ENV=production
EOF

# Load environment variables
echo 'source ~/.azamtv_env' >> ~/.bashrc
source ~/.azamtv_env
```

## Software Installation

### 1. Install Node.js Using Node Version Manager (NVM)
```bash
# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version
```

### 2. Install PM2 Process Manager
```bash
# Install PM2 globally in user space
npm install -g pm2

# Verify PM2 installation
pm2 --version

# Setup PM2 startup (user level)
pm2 startup
# Follow the instructions provided by PM2 startup command
```

### 3. Install Git (if not available)
```bash
# Check if git is available
which git

# If git is not available, download portable version
if ! command -v git &> /dev/null; then
    cd ~/local
    wget https://github.com/git/git/releases/download/v2.41.0/git-2.41.0.tar.gz
    tar -xzf git-2.41.0.tar.gz
    cd git-2.41.0
    ./configure --prefix=$HOME/local
    make -j$(nproc)
    make install
fi
```

## Application Deployment

### 1. Clone the Repository
```bash
# Navigate to application directory
cd ~/azamtv-portal

# Clone the repository
git clone https://github.com/your-repo/azam-tv-portal.git app
cd app

# Or if you have a tarball/zip file
# wget https://your-domain.com/azam-tv-portal.tar.gz
# tar -xzf azam-tv-portal.tar.gz
# mv azam-tv-portal app
# cd app
```

### 2. Install Application Dependencies
```bash
# Install Node.js dependencies
npm install

# Install additional build tools if needed
npm install -g typescript tsx

# Verify dependencies
npm list --depth=0
```

### 3. Configure Environment Variables
```bash
# Create production environment file
cp .env.example .env

# Edit environment configuration
cat > .env << 'EOF'
# API Configuration
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3

# Server Configuration
PORT=8080
HOST=0.0.0.0
NODE_ENV=production

# Session Configuration
SESSION_SECRET=your_very_secure_session_secret_here_change_this

# CORS Configuration
CORS_ORIGINS=http://localhost:8080,http://your-server-ip:8080

# Database Configuration (Optional - using file-based storage by default)
# DATABASE_URL=postgresql://username:password@localhost:5432/azamtv_portal

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=$HOME/azamtv-portal/logs/application.log
EOF
```

### 4. Build the Application
```bash
# Build the frontend and backend
npm run build

# Verify build output
ls -la dist/
ls -la dist/public/
```

## Process Management

### 1. Create PM2 Ecosystem Configuration
```bash
# Create PM2 configuration file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'azamtv-portal',
    script: 'dist/index.js',
    cwd: process.env.HOME + '/azamtv-portal/app',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8080,
      HOST: '0.0.0.0'
    },
    error_file: process.env.HOME + '/azamtv-portal/logs/error.log',
    out_file: process.env.HOME + '/azamtv-portal/logs/access.log',
    log_file: process.env.HOME + '/azamtv-portal/logs/combined.log',
    time: true,
    max_memory_restart: '512M',
    node_args: '--max-old-space-size=512',
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF
```

### 2. Create Service Management Scripts
```bash
# Create start script
cat > ~/local/bin/azamtv-start << 'EOF'
#!/bin/bash
source ~/.azamtv_env
cd $AZAMTV_HOME/app
pm2 start ecosystem.config.js
pm2 save
EOF

# Create stop script
cat > ~/local/bin/azamtv-stop << 'EOF'
#!/bin/bash
pm2 stop azamtv-portal
EOF

# Create restart script
cat > ~/local/bin/azamtv-restart << 'EOF'
#!/bin/bash
source ~/.azamtv_env
cd $AZAMTV_HOME/app
pm2 restart azamtv-portal
EOF

# Create status script
cat > ~/local/bin/azamtv-status << 'EOF'
#!/bin/bash
pm2 status
pm2 logs azamtv-portal --lines 10
EOF

# Make scripts executable
chmod +x ~/local/bin/azamtv-*
```

## Database Setup (Optional)

### 1. Install PostgreSQL in User Space (Optional)
```bash
# If you need PostgreSQL and don't have system access
# Download and compile PostgreSQL
cd ~/local
wget https://ftp.postgresql.org/pub/source/v15.3/postgresql-15.3.tar.gz
tar -xzf postgresql-15.3.tar.gz
cd postgresql-15.3

# Configure and build
./configure --prefix=$HOME/local --with-openssl
make -j$(nproc)
make install

# Initialize database
mkdir -p ~/local/pgsql/data
~/local/bin/initdb -D ~/local/pgsql/data

# Create start/stop scripts for PostgreSQL
cat > ~/local/bin/pg-start << 'EOF'
#!/bin/bash
$HOME/local/bin/pg_ctl -D $HOME/local/pgsql/data -l $HOME/azamtv-portal/logs/postgresql.log start
EOF

cat > ~/local/bin/pg-stop << 'EOF'
#!/bin/bash
$HOME/local/bin/pg_ctl -D $HOME/local/pgsql/data stop
EOF

chmod +x ~/local/bin/pg-*

# Start PostgreSQL
pg-start

# Create database
~/local/bin/createdb azamtv_portal
```

### 2. Configure File-Based Storage (Default)
```bash
# Create data directory for file-based storage
mkdir -p ~/azamtv-portal/data

# Update environment to use file storage
echo 'export AZAMTV_DATA_PATH="$HOME/azamtv-portal/data"' >> ~/.azamtv_env
source ~/.azamtv_env
```

## Web Server Configuration

### 1. Using Built-in Express Server (Recommended)
```bash
# The application includes a built-in Express server
# No additional web server configuration needed
# Application will serve static files and API endpoints on port 8080
```

### 2. Install Nginx in User Space (Optional)
```bash
# If you want to use Nginx as a reverse proxy
cd ~/local
wget http://nginx.org/download/nginx-1.24.0.tar.gz
tar -xzf nginx-1.24.0.tar.gz
cd nginx-1.24.0

# Configure Nginx for user installation
./configure \
    --prefix=$HOME/local/nginx \
    --user=$(whoami) \
    --with-http_ssl_module \
    --with-http_realip_module \
    --with-http_gzip_static_module

make -j$(nproc)
make install

# Create Nginx configuration
mkdir -p ~/local/nginx/conf/conf.d

cat > ~/local/nginx/conf/nginx.conf << 'EOF'
worker_processes 1;
error_log logs/error.log;
pid logs/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
    server {
        listen 8081;
        server_name localhost;
        
        location / {
            proxy_pass http://127.0.0.1:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
EOF

# Create Nginx control scripts
cat > ~/local/bin/nginx-start << 'EOF'
#!/bin/bash
$HOME/local/nginx/sbin/nginx
EOF

cat > ~/local/bin/nginx-stop << 'EOF'
#!/bin/bash
$HOME/local/nginx/sbin/nginx -s quit
EOF

chmod +x ~/local/bin/nginx-*
```

## Environment Configuration

### 1. Create Configuration Management Script
```bash
# Create configuration script
cat > ~/local/bin/azamtv-config << 'EOF'
#!/bin/bash

AZAMTV_ENV_FILE="$HOME/azamtv-portal/app/.env"

case "$1" in
    "set-port")
        if [ -z "$2" ]; then
            echo "Usage: azamtv-config set-port <port_number>"
            exit 1
        fi
        sed -i "s/PORT=.*/PORT=$2/" $AZAMTV_ENV_FILE
        echo "Port set to $2"
        ;;
    "set-host")
        if [ -z "$2" ]; then
            echo "Usage: azamtv-config set-host <host_address>"
            exit 1
        fi
        sed -i "s/HOST=.*/HOST=$2/" $AZAMTV_ENV_FILE
        echo "Host set to $2"
        ;;
    "show")
        echo "Current AZAM TV Portal Configuration:"
        echo "===================================="
        cat $AZAMTV_ENV_FILE | grep -v "^#" | grep -v "^$"
        ;;
    *)
        echo "Usage: azamtv-config {set-port|set-host|show} [value]"
        exit 1
        ;;
esac
EOF

chmod +x ~/local/bin/azamtv-config
```

### 2. Create Health Check Script
```bash
# Create health check script
cat > ~/local/bin/azamtv-health << 'EOF'
#!/bin/bash

PORT=${AZAMTV_PORT:-8080}
URL="http://localhost:$PORT/api/health"

echo "Checking AZAM TV Portal health..."
echo "URL: $URL"

if curl -s --max-time 10 "$URL" > /dev/null 2>&1; then
    echo "✓ AZAM TV Portal is healthy and responding"
    echo "✓ Application is accessible at: http://localhost:$PORT"
    exit 0
else
    echo "✗ AZAM TV Portal health check failed"
    echo "  - Check if the application is running: pm2 status"
    echo "  - Check application logs: pm2 logs azamtv-portal"
    echo "  - Check if port $PORT is available: netstat -tlnp | grep $PORT"
    exit 1
fi
EOF

chmod +x ~/local/bin/azamtv-health
```

## Running the Application

### 1. Start the Application
```bash
# Start the AZAM TV Portal
azamtv-start

# Check status
azamtv-status

# Verify health
azamtv-health

# View logs
pm2 logs azamtv-portal
```

### 2. Access the Application
```bash
# The application will be available at:
echo "AZAM TV Portal is running at:"
echo "http://localhost:8080"
echo "http://$(hostname -I | awk '{print $1}'):8080"

# If using Nginx (optional):
# nginx-start
# echo "Nginx proxy available at: http://localhost:8081"
```

### 3. Create Startup Script for System Boot
```bash
# Create startup script that runs on login
cat > ~/.azamtv_startup.sh << 'EOF'
#!/bin/bash
# AZAM TV Portal Auto-start Script

# Wait for system to be ready
sleep 10

# Source environment
source ~/.azamtv_env

# Start PostgreSQL if installed locally
if [ -x "$HOME/local/bin/pg-start" ]; then
    $HOME/local/bin/pg-start
    sleep 5
fi

# Start AZAM TV Portal
$HOME/local/bin/azamtv-start

# Start Nginx if configured
if [ -x "$HOME/local/bin/nginx-start" ]; then
    $HOME/local/bin/nginx-start
fi

echo "AZAM TV Portal startup completed at $(date)" >> $HOME/azamtv-portal/logs/startup.log
EOF

chmod +x ~/.azamtv_startup.sh

# Add to user's login script
echo '# Auto-start AZAM TV Portal' >> ~/.profile
echo 'if [ -f ~/.azamtv_startup.sh ]; then' >> ~/.profile
echo '    nohup ~/.azamtv_startup.sh > /dev/null 2>&1 &' >> ~/.profile
echo 'fi' >> ~/.profile
```

## Monitoring and Logging

### 1. Create Log Management Scripts
```bash
# Create log viewer script
cat > ~/local/bin/azamtv-logs << 'EOF'
#!/bin/bash

case "$1" in
    "app"|"application")
        tail -f $HOME/azamtv-portal/logs/combined.log
        ;;
    "error")
        tail -f $HOME/azamtv-portal/logs/error.log
        ;;
    "access")
        tail -f $HOME/azamtv-portal/logs/access.log
        ;;
    "all")
        tail -f $HOME/azamtv-portal/logs/*.log
        ;;
    *)
        echo "Usage: azamtv-logs {app|error|access|all}"
        echo "Available logs:"
        ls -la $HOME/azamtv-portal/logs/
        ;;
esac
EOF

chmod +x ~/local/bin/azamtv-logs

# Create log rotation script
cat > ~/local/bin/azamtv-rotate-logs << 'EOF'
#!/bin/bash

LOG_DIR="$HOME/azamtv-portal/logs"
DATE=$(date +"%Y%m%d_%H%M%S")

# Rotate PM2 logs
pm2 flush

# Archive old logs
for log in $LOG_DIR/*.log; do
    if [ -f "$log" ] && [ -s "$log" ]; then
        mv "$log" "$log.$DATE"
        gzip "$log.$DATE"
    fi
done

# Remove logs older than 30 days
find $LOG_DIR -name "*.gz" -mtime +30 -delete

echo "Log rotation completed at $(date)"
EOF

chmod +x ~/local/bin/azamtv-rotate-logs

# Schedule log rotation (add to crontab)
(crontab -l 2>/dev/null; echo "0 2 * * 0 $HOME/local/bin/azamtv-rotate-logs >> $HOME/azamtv-portal/logs/rotation.log 2>&1") | crontab -
```

### 2. Create Monitoring Script
```bash
# Create system monitoring script
cat > ~/local/bin/azamtv-monitor << 'EOF'
#!/bin/bash

echo "AZAM TV Portal System Monitor"
echo "============================="
echo "Timestamp: $(date)"
echo

# PM2 Status
echo "PM2 Process Status:"
pm2 jlist | jq -r '.[] | "Name: \(.name), Status: \(.pm2_env.status), CPU: \(.monit.cpu)%, Memory: \(.monit.memory/1024/1024 | floor)MB"'
echo

# Port Status
PORT=${AZAMTV_PORT:-8080}
echo "Port $PORT Status:"
if netstat -tlnp 2>/dev/null | grep ":$PORT " > /dev/null; then
    echo "✓ Port $PORT is listening"
else
    echo "✗ Port $PORT is not listening"
fi
echo

# Disk Usage
echo "Disk Usage:"
df -h $HOME | tail -1
echo

# Memory Usage
echo "Memory Usage:"
free -h
echo

# Network Test
echo "Network Connectivity:"
if ping -c 1 google.com > /dev/null 2>&1; then
    echo "✓ Internet connectivity available"
else
    echo "✗ No internet connectivity"
fi
echo

# Application Health
echo "Application Health Check:"
azamtv-health
EOF

chmod +x ~/local/bin/azamtv-monitor

# Schedule monitoring (every 15 minutes)
(crontab -l 2>/dev/null; echo "*/15 * * * * $HOME/local/bin/azamtv-monitor >> $HOME/azamtv-portal/logs/monitor.log 2>&1") | crontab -
```

## Backup Procedures

### 1. Create Backup Script
```bash
# Create backup script
cat > ~/local/bin/azamtv-backup << 'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/azamtv-portal/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="azamtv_backup_$DATE"

echo "Starting backup process..."

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Backup application files
echo "Backing up application files..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME/application.tar.gz" -C "$HOME/azamtv-portal" app

# Backup data directory
if [ -d "$HOME/azamtv-portal/data" ]; then
    echo "Backing up data files..."
    tar -czf "$BACKUP_DIR/$BACKUP_NAME/data.tar.gz" -C "$HOME/azamtv-portal" data
fi

# Backup configuration files
echo "Backing up configuration..."
cp ~/.azamtv_env "$BACKUP_DIR/$BACKUP_NAME/"
cp "$HOME/azamtv-portal/app/.env" "$BACKUP_DIR/$BACKUP_NAME/"

# Backup logs (last 7 days)
echo "Backing up recent logs..."
find "$HOME/azamtv-portal/logs" -name "*.log*" -mtime -7 -exec cp {} "$BACKUP_DIR/$BACKUP_NAME/" \;

# Create backup manifest
echo "Backup created on: $(date)" > "$BACKUP_DIR/$BACKUP_NAME/manifest.txt"
echo "Backup contains:" >> "$BACKUP_DIR/$BACKUP_NAME/manifest.txt"
ls -la "$BACKUP_DIR/$BACKUP_NAME/" >> "$BACKUP_DIR/$BACKUP_NAME/manifest.txt"

# Remove backups older than 14 days
find "$BACKUP_DIR" -maxdepth 1 -type d -name "azamtv_backup_*" -mtime +14 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_NAME"
echo "Backup location: $BACKUP_DIR/$BACKUP_NAME"
EOF

chmod +x ~/local/bin/azamtv-backup

# Schedule daily backups
(crontab -l 2>/dev/null; echo "0 1 * * * $HOME/local/bin/azamtv-backup >> $HOME/azamtv-portal/logs/backup.log 2>&1") | crontab -
```

### 2. Create Restore Script
```bash
# Create restore script
cat > ~/local/bin/azamtv-restore << 'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/azamtv-portal/backups"

if [ -z "$1" ]; then
    echo "Usage: azamtv-restore <backup_name>"
    echo "Available backups:"
    ls -la "$BACKUP_DIR" | grep "azamtv_backup_"
    exit 1
fi

BACKUP_NAME="$1"
RESTORE_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -d "$RESTORE_PATH" ]; then
    echo "Backup not found: $RESTORE_PATH"
    exit 1
fi

echo "Starting restore process from: $BACKUP_NAME"
echo "Warning: This will overwrite current application data!"
read -p "Continue? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Stop application
echo "Stopping application..."
azamtv-stop

# Backup current state
echo "Creating safety backup of current state..."
azamtv-backup

# Restore application files
if [ -f "$RESTORE_PATH/application.tar.gz" ]; then
    echo "Restoring application files..."
    cd "$HOME/azamtv-portal"
    rm -rf app
    tar -xzf "$RESTORE_PATH/application.tar.gz"
fi

# Restore data files
if [ -f "$RESTORE_PATH/data.tar.gz" ]; then
    echo "Restoring data files..."
    cd "$HOME/azamtv-portal"
    rm -rf data
    tar -xzf "$RESTORE_PATH/data.tar.gz"
fi

# Restore configuration
if [ -f "$RESTORE_PATH/.azamtv_env" ]; then
    echo "Restoring environment configuration..."
    cp "$RESTORE_PATH/.azamtv_env" ~/.azamtv_env
fi

if [ -f "$RESTORE_PATH/.env" ]; then
    echo "Restoring application configuration..."
    cp "$RESTORE_PATH/.env" "$HOME/azamtv-portal/app/.env"
fi

# Start application
echo "Starting application..."
source ~/.azamtv_env
azamtv-start

echo "Restore completed successfully"
echo "Please check application health: azamtv-health"
EOF

chmod +x ~/local/bin/azamtv-restore
```

## Troubleshooting

### 1. Common Issues and Solutions

#### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check for port conflicts
netstat -tlnp | grep 8080

# Check application logs
azamtv-logs error

# Restart with fresh configuration
pm2 delete azamtv-portal
azamtv-start
```

#### Port Already in Use
```bash
# Find process using the port
netstat -tlnp | grep 8080

# Change application port
azamtv-config set-port 8081
azamtv-restart
```

#### Memory Issues
```bash
# Check memory usage
free -h
pm2 monit

# Restart application to free memory
azamtv-restart

# Reduce memory usage in PM2 config
# Edit ecosystem.config.js and reduce max_memory_restart
```

#### Log Files Growing Too Large
```bash
# Rotate logs immediately
azamtv-rotate-logs

# Check log sizes
du -sh $HOME/azamtv-portal/logs/*

# Clear PM2 logs
pm2 flush
```

### 2. Diagnostic Commands
```bash
# Complete system check
azamtv-monitor

# Application health check
azamtv-health

# View current configuration
azamtv-config show

# Check all running processes
ps aux | grep node

# Check network connections
netstat -tlnp | grep node

# View system resources
top -p $(pgrep -f azamtv-portal)
```

### 3. Performance Optimization
```bash
# Enable Node.js performance flags
echo 'export NODE_OPTIONS="--max-old-space-size=512 --optimize-for-size"' >> ~/.azamtv_env

# Optimize PM2 for single-core systems
# Edit ecosystem.config.js:
# instances: 1,  // Instead of 'max'
# exec_mode: 'fork'  // Instead of 'cluster'

# Enable gzip compression (if using Nginx)
# Add to nginx.conf:
# gzip on;
# gzip_types text/css application/javascript;
```

## Quick Start Summary

```bash
# 1. Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18 && nvm use 18

# 2. Create directories and environment
mkdir -p ~/azamtv-portal/{logs,backups,data}
mkdir -p ~/local/bin

# 3. Clone and setup application
cd ~/azamtv-portal
git clone <repository-url> app
cd app
npm install
cp .env.example .env

# 4. Configure environment
# Edit .env file with your settings (PORT=8080, etc.)

# 5. Build and start
npm run build
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save

# 6. Verify
curl http://localhost:8080/api/health
```

## Support and Maintenance

### Daily Tasks
- Check application health: `azamtv-health`
- Monitor system resources: `azamtv-monitor`
- Review error logs: `azamtv-logs error`

### Weekly Tasks
- Review backup logs: `ls -la ~/azamtv-portal/backups/`
- Check disk usage: `df -h ~`
- Update dependencies: `cd ~/azamtv-portal/app && npm update`

### Monthly Tasks
- Test backup and restore procedures
- Review and clean old logs
- Update Node.js version if needed

This guide provides a complete deployment solution for SUSE Linux Enterprise Server 15 SP6 without requiring administrative privileges. All software is installed in user space, and the application runs on high ports accessible to regular users.