# VPS Deployment Guide - Namecheap Ubuntu

This guide will help you deploy your Laravel + React + Inertia application on your Ubuntu VPS.

## Prerequisites

You'll need to SSH into your VPS and run commands as root or with sudo privileges.

## Step 1: Update System & Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and required extensions
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-curl php8.2-gd php8.2-zip php8.2-xml php8.2-mbstring

# Install Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js & npm (v18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx (web server)
sudo apt install -y nginx

# Install MySQL (or use PostgreSQL)
sudo apt install -y mysql-server

# Install Git
sudo apt install -y git

# Verify installations
php -v
composer -V
node -v
npm -v
```

## Step 2: Set Up Web Root & Clone Repository

```bash
# Create web root directory
sudo mkdir -p /var/www/forkthebloodclart
cd /var/www/forkthebloodclart

# Clone your repository (replace with your actual repo URL)
sudo git clone <YOUR_GIT_REPO_URL> .

# Set proper permissions
sudo chown -R www-data:www-data /var/www/forkthebloodclart
sudo chmod -R 755 /var/www/forkthebloodclart
sudo chmod -R 777 /var/www/forkthebloodclart/storage
sudo chmod -R 777 /var/www/forkthebloodclart/bootstrap/cache
```

## Step 3: Set Up Environment & Build

```bash
cd /var/www/forkthebloodclart

# Copy .env file (create one if it doesn't exist)
sudo cp .env.example .env

# Edit .env with your production settings
sudo nano .env
```

**Key .env settings to change:**
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

```bash
# Generate application key
sudo php artisan key:generate

# Install PHP dependencies
sudo composer install --no-dev --optimize-autoloader

# Install Node dependencies
sudo npm install

# Build frontend assets
sudo npm run build

# Run migrations
sudo php artisan migrate --force

# Clear caches
sudo php artisan config:clear
sudo php artisan cache:clear
sudo php artisan view:clear
```

## Step 4: Configure Nginx

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/forkthebloodclart
```

Paste this configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates (configure after pointing domain)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    root /var/www/forkthebloodclart/public;
    index index.php;

    charset utf-8;
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Deny access to sensitive files
    location ~ /\.env {
        deny all;
    }

    location ~ /\.git {
        deny all;
    }

    # Pass PHP files to FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Vue/React assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main Laravel routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/forkthebloodclart /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 5: Set Up PHP-FPM

```bash
# Check PHP-FPM is running
sudo systemctl status php8.2-fpm

# If not running
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm

# Set correct socket ownership
sudo chown www-data:www-data /var/run/php/php8.2-fpm.sock
```

## Step 6: Set Up Database

```bash
# Log into MySQL
sudo mysql

# Create database and user
CREATE DATABASE forkthebloodclart;
CREATE USER 'bloodclart_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON forkthebloodclart.* TO 'bloodclart_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Update these credentials in your `.env` file.

## Step 7: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate (replace with your domain)
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Update Nginx config with certificate paths
sudo nano /etc/nginx/sites-available/forkthebloodclart
```

Update these lines:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Step 8: Set Up Queue Worker (for email/notifications)

Create a systemd service for Laravel queue:

```bash
sudo nano /etc/systemd/system/laravel-queue.service
```

```ini
[Unit]
Description=Laravel Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/forkthebloodclart
ExecStart=/usr/bin/php /var/www/forkthebloodclart/artisan queue:work --sleep=3 --tries=3
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable laravel-queue.service
sudo systemctl start laravel-queue.service
sudo systemctl status laravel-queue.service
```

## Step 9: Verify Deployment

```bash
# Check if site is accessible
curl -I http://localhost

# Check application logs
tail -f /var/www/forkthebloodclart/storage/logs/laravel.log

# Check Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## Troubleshooting

**If you get permission errors:**
```bash
sudo chown -R www-data:www-data /var/www/forkthebloodclart
sudo chmod -R 755 /var/www/forkthebloodclart
sudo chmod -R 777 /var/www/forkthebloodclart/storage/logs
sudo chmod -R 777 /var/www/forkthebloodclart/bootstrap/cache
```

**If Nginx can't find PHP:**
```bash
sudo php-fpm8.2 -t  # Check PHP-FPM config
ps aux | grep php  # Check if PHP-FPM is running
```

**If database connection fails:**
```bash
sudo mysql -u bloodclart_user -p  # Test connection
# Use the password you set during database creation
```

## Updating Your Site

After you push changes to Git, SSH into the server and run:

```bash
cd /var/www/forkthebloodclart
sudo git pull origin main  # or your branch name
sudo composer install --no-dev --optimize-autoloader
sudo npm install
sudo npm run build
sudo php artisan migrate --force
sudo php artisan cache:clear
sudo php artisan config:clear
```

---

**Need help?** Check the Laravel deployment docs: https://laravel.com/docs/12/deployment
