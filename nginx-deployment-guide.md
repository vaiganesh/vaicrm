# AZAM TV Agent Management Portal - Nginx Deployment Guide

This guide will help you deploy your AZAM TV agent management portal to a production server using Nginx as a reverse proxy.

## Prerequisites

- Ubuntu/Debian server (or similar Linux distribution)
- Root or sudo access
- Domain name pointed to your server (optional but recommended)
- Node.js 20.x installed on the server

## Step 1: Prepare Your Server

### 1.1 Update System Packages
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Node.js 20.x
```bash
# Install Node.js 20.x using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Deploy Your Application

### 2.1 Upload Your Project
```bash
# Create application directory
sudo mkdir -p /var/www/azam-tv-portal
sudo chown -R $USER:$USER /var/www/azam-tv-portal

# Upload your project files to /var/www/azam-tv-portal
# You can use scp, rsync, or git clone
```

### 2.2 Install Dependencies and Build
```bash
cd /var/www/azam-tv-portal

# Install dependencies
npm install

# Build the application
npm run build
```

### 2.3 Configure Environment Variables
```bash
# Create production environment file
sudo nano /var/www/azam-tv-portal/.env.production

# Add your environment variables:
NODE_ENV=production
PORT=5000
# Add any other environment variables your app needs
# DATABASE_URL=your_database_connection_string
# API_KEYS=your_api_keys
```

### 2.4 Test the Application
```bash
# Test the build
npm run start

# If successful, stop the test run (Ctrl+C)
```

## Step 3: Configure PM2

### 3.1 Create PM2 Ecosystem File
```bash
# Create PM2 configuration
nano /var/www/azam-tv-portal/ecosystem.config.js
```

Add the following content:
```javascript
module.exports = {
  apps: [{
    name: 'azam-tv-portal',
    script: 'dist/index.js',
    cwd: '/var/www/azam-tv-portal',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/pm2/azam-tv-portal-error.log',
    out_file: '/var/log/pm2/azam-tv-portal-out.log',
    log_file: '/var/log/pm2/azam-tv-portal.log',
    merge_logs: true,
    time: true
  }]
};
```

### 3.2 Create Log Directory
```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### 3.3 Start Application with PM2
```bash
cd /var/www/azam-tv-portal

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown by the command above
```

## Step 4: Configure Nginx

### 4.1 Create Nginx Server Block
```bash
sudo nano /etc/nginx/sites-available/azam-tv-portal
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @proxy;
    }

    # Main proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Fallback for static files
    location @proxy {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 4.2 Enable the Site
```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/azam-tv-portal /etc/nginx/sites-enabled/

# Remove default Nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 5: Setup SSL with Let's Encrypt (Recommended)

### 5.1 Install Certbot
```bash
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 5.2 Obtain SSL Certificate
```bash
# Replace your-domain.com with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5.3 Test SSL Renewal
```bash
sudo certbot renew --dry-run
```

## Step 6: Setup Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (be careful not to lock yourself out)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

## Step 7: Monitoring and Maintenance

### 7.1 Useful PM2 Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs azam-tv-portal

# Restart application
pm2 restart azam-tv-portal

# Stop application
pm2 stop azam-tv-portal

# Monitor real-time
pm2 monit
```

### 7.2 Useful Nginx Commands
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### 7.3 Application Updates
```bash
cd /var/www/azam-tv-portal

# Pull latest changes (if using git)
git pull origin main

# Install new dependencies
npm install

# Build the application
npm run build

# Restart with PM2
pm2 restart azam-tv-portal
```

## Step 8: Database Setup (if using PostgreSQL)

If your application uses PostgreSQL:

### 8.1 Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 8.2 Create Database and User
```bash
sudo -u postgres psql

-- In PostgreSQL shell:
CREATE DATABASE azam_tv_portal;
CREATE USER azam_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE azam_tv_portal TO azam_user;
\q
```

### 8.3 Update Environment Variables
```bash
# Add to .env.production
DATABASE_URL=postgresql://azam_user:secure_password@localhost:5432/azam_tv_portal
```

## Security Best Practices

1. **Regular Updates**: Keep your system, Node.js, and dependencies updated
2. **Firewall**: Only open necessary ports
3. **SSL/TLS**: Always use HTTPS in production
4. **Environment Variables**: Never commit sensitive data to version control
5. **Database Security**: Use strong passwords and limit database access
6. **Backup Strategy**: Implement regular backups for your database and application files
7. **Monitoring**: Set up monitoring for your application and server resources

## Troubleshooting

### Common Issues:

1. **Port 5000 already in use**:
   ```bash
   sudo netstat -tlnp | grep :5000
   sudo kill -9 <PID>
   ```

2. **Nginx permission denied**:
   ```bash
   sudo chown -R www-data:www-data /var/www/azam-tv-portal
   sudo chmod -R 755 /var/www/azam-tv-portal
   ```

3. **PM2 application not starting**:
   ```bash
   pm2 logs azam-tv-portal
   # Check logs for specific error messages
   ```

4. **SSL certificate issues**:
   ```bash
   sudo certbot certificates
   sudo certbot renew --force-renewal
   ```

## Performance Optimization

1. **Enable Gzip compression** (already included in Nginx config)
2. **Set up caching headers** for static assets
3. **Use CDN** for static assets if needed
4. **Monitor application performance** with PM2 monitoring
5. **Database connection pooling** (if using database)

## Backup Strategy

Create a backup script:
```bash
#!/bin/bash
# /home/ubuntu/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/azam-tv-portal_$DATE.tar.gz /var/www/azam-tv-portal

# Backup database (if using PostgreSQL)
pg_dump -U azam_user -h localhost azam_tv_portal > $BACKUP_DIR/database_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

Make it executable and add to crontab:
```bash
chmod +x /home/ubuntu/backup.sh
crontab -e

# Add this line for daily backups at 2 AM:
0 2 * * * /home/ubuntu/backup.sh
```

---

This deployment guide provides a production-ready setup for your AZAM TV agent management portal with Nginx, PM2, SSL, and proper security configurations. Make sure to replace placeholder values like domain names and passwords with your actual values.