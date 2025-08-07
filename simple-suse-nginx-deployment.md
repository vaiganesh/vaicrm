# Simple AZAM TV Portal Deployment on SUSE Linux Enterprise Server 15 SP6 with Nginx

This guide provides a streamlined deployment process for SUSE Linux Enterprise Server 15 SP6 using Nginx as a reverse proxy.

## Prerequisites

- SUSE Linux Enterprise Server 15 SP6
- Root or sudo access
- Internet connection

## Quick Deployment Steps

### 1. System Preparation

```bash
# Update system
sudo zypper refresh && sudo zypper update -y

# Install required packages
sudo zypper install -y curl wget git nginx

# Enable and start services
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Configure firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. Install Node.js

```bash
# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo zypper install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 startup
sudo pm2 startup systemd
```

### 4. Deploy Application

```bash
# Create application user
sudo useradd -m -s /bin/bash azamtv

# Switch to application user
sudo su - azamtv

# Clone repository
git clone https://github.com/your-repo/azam-tv-portal.git
cd azam-tv-portal

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### 5. Configure Environment Variables

```bash
# Edit .env file
cat > .env << 'EOF'
# API Configuration
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3

# Server Configuration
PORT=5000
NODE_ENV=production

# Session Secret
SESSION_SECRET=change_this_to_a_secure_random_string

# CORS Origins
CORS_ORIGINS=https://your-domain.com
EOF
```

### 6. Build and Start Application

```bash
# Build the application
npm run build

# Create PM2 configuration
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'azamtv-portal',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Exit back to root user
exit
```

### 7. Configure Nginx

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/azamtv-portal << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /home/azamtv/azam-tv-portal/dist/public;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location / {
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Error and access logs
    error_log /var/log/nginx/azamtv_error.log;
    access_log /var/log/nginx/azamtv_access.log;
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/azamtv-portal /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. SSL Certificate (Optional)

```bash
# Install Certbot
sudo zypper install -y python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 9. Create Management Scripts

```bash
# Create start script
sudo tee /usr/local/bin/azamtv-start << 'EOF'
#!/bin/bash
sudo -u azamtv pm2 start /home/azamtv/azam-tv-portal/ecosystem.config.js
sudo systemctl start nginx
EOF

# Create stop script
sudo tee /usr/local/bin/azamtv-stop << 'EOF'
#!/bin/bash
sudo -u azamtv pm2 stop azamtv-portal
sudo systemctl stop nginx
EOF

# Create restart script
sudo tee /usr/local/bin/azamtv-restart << 'EOF'
#!/bin/bash
sudo -u azamtv pm2 restart azamtv-portal
sudo systemctl reload nginx
EOF

# Create status script
sudo tee /usr/local/bin/azamtv-status << 'EOF'
#!/bin/bash
echo "=== AZAM TV Portal Status ==="
sudo -u azamtv pm2 status
echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager -l
echo ""
echo "=== Application Health ==="
curl -s http://localhost:5000/api/health || echo "API not responding"
EOF

# Make scripts executable
sudo chmod +x /usr/local/bin/azamtv-*
```

## Usage

### Start the Application
```bash
azamtv-start
```

### Check Status
```bash
azamtv-status
```

### View Logs
```bash
# Application logs
sudo -u azamtv pm2 logs azamtv-portal

# Nginx logs
sudo tail -f /var/log/nginx/azamtv_access.log
sudo tail -f /var/log/nginx/azamtv_error.log
```

### Restart Application
```bash
azamtv-restart
```

### Stop Application
```bash
azamtv-stop
```

## Application Access

- **Local**: http://localhost
- **Network**: http://your-server-ip
- **Domain**: http://your-domain.com (after DNS configuration)
- **HTTPS**: https://your-domain.com (after SSL setup)

## Default Login Credentials

- **Admin**: admin@azamtv.com / admin123
- **Agent**: agent@azamtv.com / agent123
- **Manager**: manager@azamtv.com / manager123

## Troubleshooting

### Check if services are running
```bash
sudo systemctl status nginx
sudo -u azamtv pm2 status
```

### Check ports
```bash
sudo netstat -tlnp | grep -E ':(80|443|5000)'
```

### Check firewall
```bash
sudo firewall-cmd --list-all
```

### Test API directly
```bash
curl http://localhost:5000/api/health
```

### Restart everything
```bash
azamtv-restart
```

## Quick Update Process

```bash
# Stop application
azamtv-stop

# Update code (as azamtv user)
sudo su - azamtv
cd azam-tv-portal
git pull origin main
npm install
npm run build
exit

# Start application
azamtv-start
```

## File Locations

- **Application**: `/home/azamtv/azam-tv-portal/`
- **Nginx Config**: `/etc/nginx/sites-available/azamtv-portal`
- **Application Logs**: `sudo -u azamtv pm2 logs`
- **Nginx Logs**: `/var/log/nginx/azamtv_*.log`
- **SSL Certificates**: `/etc/letsencrypt/live/your-domain.com/`

## Security Notes

- Change the SESSION_SECRET in .env file
- Update default login credentials after first login
- Configure proper domain name and SSL certificate
- Regular system updates: `sudo zypper update`
- Monitor logs for security issues

This simple deployment guide gets the AZAM TV Portal running quickly with Nginx on SUSE Linux Enterprise Server 15 SP6.