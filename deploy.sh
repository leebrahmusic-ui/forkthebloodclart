#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Laravel Application Deployment Script ===${NC}\n"

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root or with sudo${NC}"
   exit 1
fi

# Get parameters
APP_PATH="${1:-.}"
APP_USER="${2:-www-data}"
APP_GROUP="${2:-www-data}"

if [ ! -d "$APP_PATH" ] || [ ! -f "$APP_PATH/artisan" ]; then
    echo -e "${RED}Error: Laravel application not found at $APP_PATH${NC}"
    exit 1
fi

cd "$APP_PATH"

echo -e "${YELLOW}Step 1: Setting Permissions${NC}"
chown -R $APP_USER:$APP_GROUP .
chmod -R 755 .
chmod -R 777 storage bootstrap/cache
echo -e "${GREEN}✓ Permissions updated${NC}\n"

echo -e "${YELLOW}Step 2: Installing PHP Dependencies${NC}"
composer install --no-dev --optimize-autoloader
echo -e "${GREEN}✓ PHP dependencies installed${NC}\n"

echo -e "${YELLOW}Step 3: Installing Node Dependencies${NC}"
npm install
echo -e "${GREEN}✓ Node dependencies installed${NC}\n"

echo -e "${YELLOW}Step 4: Building Frontend Assets${NC}"
npm run build
echo -e "${GREEN}✓ Frontend assets built${NC}\n"

echo -e "${YELLOW}Step 5: Running Database Migrations${NC}"
php artisan migrate --force
echo -e "${GREEN}✓ Database migrations complete${NC}\n"

echo -e "${YELLOW}Step 6: Clearing Caches${NC}"
php artisan config:clear
php artisan cache:clear
php artisan view:clear
echo -e "${GREEN}✓ Caches cleared${NC}\n"

echo -e "${YELLOW}Step 7: Setting Final Permissions${NC}"
chown -R $APP_USER:$APP_GROUP storage bootstrap/cache
chmod -R 777 storage/logs
echo -e "${GREEN}✓ Final permissions set${NC}\n"

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Update .env with your production settings"
echo "2. Configure Nginx with your domain"
echo "3. Set up SSL certificate with Let's Encrypt"
echo "4. Set up queue worker (if using queues)"
