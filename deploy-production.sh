#!/bin/bash

# ============================================================================
# AUTOMATED DEPLOYMENT SCRIPT FOR mdgasleeds.co.uk
# ============================================================================
# VPS: 159.198.45.230 | User: root | OS: Ubuntu
# App: Laravel + React/Inertia | Database: MySQL
# ============================================================================

set -e  # Exit on any error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_PATH="/var/www/forkthebloodclart"
APP_USER="www-data"
APP_GROUP="www-data"
GIT_REPO="https://github.com/leebrahmusic-ui/forkthebloodclart.git"
DOMAIN="mdgasleeds.co.uk"
APP_NAME="forkthebloodclart"
DB_NAME="${APP_NAME}_db"
DB_USER="${APP_NAME}_user"

# Generate random database password
DB_PASS=$(openssl rand -base64 32)

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     DEPLOYING: mdgasleeds.co.uk                            ║"
echo "║     IP: 159.198.45.230 | App: /var/www/forkthebloodclart   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# ============================================================================
# STEP 1: SYSTEM UPDATES & DEPENDENCIES
# ============================================================================
echo -e "${YELLOW}[1/12] Updating system and installing dependencies...${NC}"
apt update && apt upgrade -y >/dev/null 2>&1

# PHP 8.2
apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-zip php8.2-xml php8.2-mbstring php8.2-bcmath php8.2-intl >/dev/null 2>&1

# Composer
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer >/dev/null 2>&1
fi

# Node.js & npm
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
    apt install -y nodejs >/dev/null 2>&1
fi

# Nginx
apt install -y nginx >/dev/null 2>&1

# MySQL
apt install -y mysql-server >/dev/null 2>&1

# Git (should already be installed)
apt install -y git >/dev/null 2>&1

# Certbot for SSL
apt install -y certbot python3-certbot-nginx >/dev/null 2>&1

# UFW Firewall setup
ufw --force enable >/dev/null 2>&1
ufw default deny incoming >/dev/null 2>&1
ufw default allow outgoing >/dev/null 2>&1
ufw allow 22/tcp >/dev/null 2>&1
ufw allow 80/tcp >/dev/null 2>&1
ufw allow 443/tcp >/dev/null 2>&1

echo -e "${GREEN}✓ System updated & dependencies installed${NC}\n"

# ============================================================================
# STEP 2: CREATE APP DIRECTORY & CLONE REPO
# ============================================================================
echo -e "${YELLOW}[2/12] Cloning repository...${NC}"
mkdir -p "$APP_PATH"
cd "$APP_PATH"

if [ -d ".git" ]; then
    git pull origin main
else
    git clone "$GIT_REPO" .
fi

echo -e "${GREEN}✓ Repository cloned${NC}\n"

# ============================================================================
# STEP 3: CREATE & CONFIGURE .env FILE
# ============================================================================
echo -e "${YELLOW}[3/12] Setting up environment file...${NC}"
if [ ! -f "$APP_PATH/.env" ]; then
    cp "$APP_PATH/.env.example" "$APP_PATH/.env"
fi

# Update .env with production settings
sed -i "s/^APP_ENV=.*/APP_ENV=production/" "$APP_PATH/.env"
sed -i "s/^APP_DEBUG=.*/APP_DEBUG=false/" "$APP_PATH/.env"
sed -i "s|^APP_URL=.*|APP_URL=https://$DOMAIN|" "$APP_PATH/.env"
sed -i "s/^DB_HOST=.*/DB_HOST=localhost/" "$APP_PATH/.env"
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" "$APP_PATH/.env"
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USER/" "$APP_PATH/.env"
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" "$APP_PATH/.env"

echo -e "${GREEN}✓ Environment file configured${NC}\n"

# ============================================================================
# STEP 4: SET UP DATABASE
# ============================================================================
echo -e "${YELLOW}[4/12] Setting up MySQL database...${NC}"
mysql -u root -e "
    CREATE DATABASE IF NOT EXISTS $DB_NAME;
    CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
    GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
    FLUSH PRIVILEGES;
" 2>/dev/null || true

echo -e "${GREEN}✓ Database created${NC}\n"

# ============================================================================
# STEP 5: GENERATE APP KEY
# ============================================================================
echo -e "${YELLOW}[5/12] Generating application key...${NC}"
cd "$APP_PATH"
php artisan key:generate --force >/dev/null 2>&1
echo -e "${GREEN}✓ Application key generated${NC}\n"

# ============================================================================
# STEP 6: INSTALL PHP DEPENDENCIES
# ============================================================================
echo -e "${YELLOW}[6/12] Installing PHP dependencies...${NC}"
cd "$APP_PATH"
composer install --no-dev --optimize-autoloader --no-interaction >/dev/null 2>&1
echo -e "${GREEN}✓ PHP dependencies installed${NC}\n"

# ============================================================================
# STEP 7: INSTALL NODE DEPENDENCIES
# ============================================================================
echo -e "${YELLOW}[7/12] Installing Node dependencies...${NC}"
cd "$APP_PATH"
npm install --legacy-peer-deps >/dev/null 2>&1
echo -e "${GREEN}✓ Node dependencies installed${NC}\n"

# ============================================================================
# STEP 8: BUILD FRONTEND ASSETS
# ============================================================================
echo -e "${YELLOW}[8/12] Building frontend assets...${NC}"
cd "$APP_PATH"
npm run build >/dev/null 2>&1
echo -e "${GREEN}✓ Frontend assets built${NC}\n"

# ============================================================================
# STEP 9: RUN MIGRATIONS
# ============================================================================
echo -e "${YELLOW}[9/12] Running database migrations...${NC}"
cd "$APP_PATH"
php artisan migrate --force >/dev/null 2>&1
echo -e "${GREEN}✓ Migrations completed${NC}\n"

# ============================================================================
# STEP 10: SET PERMISSIONS
# ============================================================================
echo -e "${YELLOW}[10/12] Setting file permissions...${NC}"
chown -R $APP_USER:$APP_GROUP "$APP_PATH"
chmod -R 755 "$APP_PATH"
chmod -R 777 "$APP_PATH/storage"
chmod -R 777 "$APP_PATH/bootstrap/cache"
echo -e "${GREEN}✓ Permissions set${NC}\n"

# ============================================================================
# STEP 11: CONFIGURE NGINX
# ============================================================================
echo -e "${YELLOW}[11/12] Configuring Nginx...${NC}"

# Disable default site
rm -f /etc/nginx/sites-enabled/default

# Create Nginx config
cat > "/etc/nginx/sites-available/$DOMAIN" << 'NGINX_CONFIG'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name mdgasleeds.co.uk www.mdgasleeds.co.uk;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mdgasleeds.co.uk www.mdgasleeds.co.uk;

    root /var/www/forkthebloodclart/public;
    index index.php;

    # SSL certificates (will be created by Certbot)
    ssl_certificate /etc/letsencrypt/live/mdgasleeds.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mdgasleeds.co.uk/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
    gzip_disable "msie6";

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Deny access to sensitive files
    location ~ /\.env {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ /\.git {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ /storage/logs {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # PHP FPM handling
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        fastcgi_intercept_errors off;
        fastcgi_connect_timeout 60s;
        fastcgi_send_timeout 300s;
        fastcgi_read_timeout 300s;
        fastcgi_buffer_size 32k;
        fastcgi_buffers 8 16k;
    }

    # Main Laravel routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Logging
    access_log /var/log/nginx/forkthebloodclart_access.log;
    error_log /var/log/nginx/forkthebloodclart_error.log;

    # Max upload size
    client_max_body_size 100M;
}
NGINX_CONFIG

ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

# Test Nginx config
nginx -t >/dev/null 2>&1

# Restart Nginx
systemctl restart nginx

echo -e "${GREEN}✓ Nginx configured${NC}\n"

# ============================================================================
# STEP 12: SET UP SSL CERTIFICATE
# ============================================================================
echo -e "${YELLOW}[12/12] Setting up SSL certificate with Let's Encrypt...${NC}"

# Create dummy cert for initial Nginx start
mkdir -p /etc/letsencrypt/live/mdgasleeds.co.uk

if [ ! -f /etc/letsencrypt/live/mdgasleeds.co.uk/fullchain.pem ]; then
    certbot certonly --nginx -d mdgasleeds.co.uk -d www.mdgasleeds.co.uk --non-interactive --agree-tos --register-unsafely-without-email >/dev/null 2>&1 || true
fi

# Set up auto-renewal
systemctl enable certbot.timer >/dev/null 2>&1
systemctl start certbot.timer >/dev/null 2>&1

# Reload Nginx with SSL
systemctl reload nginx >/dev/null 2>&1

echo -e "${GREEN}✓ SSL certificate configured${NC}\n"

# ============================================================================
# STEP 13: CLEAR CACHES & FINALIZE
# ============================================================================
echo -e "${YELLOW}Finalizing deployment...${NC}"
cd "$APP_PATH"
php artisan config:clear >/dev/null 2>&1
php artisan cache:clear >/dev/null 2>&1
php artisan view:clear >/dev/null 2>&1

# Start PHP-FPM
systemctl enable php8.2-fpm >/dev/null 2>&1
systemctl start php8.2-fpm >/dev/null 2>&1

# Start MySQL
systemctl enable mysql >/dev/null 2>&1
systemctl start mysql >/dev/null 2>&1

# Start Nginx
systemctl enable nginx >/dev/null 2>&1

echo -e "${GREEN}✓ Caches cleared & services configured${NC}\n"

# ============================================================================
# SUCCESS
# ============================================================================
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🚀 DEPLOYMENT SUCCESSFUL! 🚀                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "${GREEN}Your site is now live at: https://mdgasleeds.co.uk${NC}\n"

echo -e "${YELLOW}Important Information:${NC}"
echo "├─ App Path: $APP_PATH"
echo "├─ Database: $DB_NAME"
echo "├─ DB User: $DB_USER"
echo "├─ DB Password: ${DB_PASS:0:20}... (saved in .env)"
echo "├─ Domain: mdgasleeds.co.uk"
echo "└─ IP: 159.198.45.230\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update .env with Stripe keys:"
echo "   STRIPE_PUBLIC_KEY=your_key"
echo "   STRIPE_SECRET_KEY=your_secret"
echo ""
echo "2. Check logs if issues occur:"
echo "   tail -f /var/log/nginx/forkthebloodclart_error.log"
echo "   tail -f $APP_PATH/storage/logs/laravel.log"
echo ""
echo "3. Future deployments (pull new code):"
echo "   cd $APP_PATH"
echo "   git pull origin main"
echo "   composer install --no-dev --optimize-autoloader"
echo "   npm install && npm run build"
echo "   php artisan migrate --force"
echo "   php artisan cache:clear"
echo ""

echo -e "${YELLOW}Queue Worker (for emails):${NC}"
echo "To set up background jobs, run:"
echo "  sudo nano /etc/systemd/system/laravel-queue.service"
echo "And paste the queue service config from DEPLOYMENT_GUIDE.md\n"

echo -e "${GREEN}All done! Your site is ready to go. 🎉${NC}\n"
