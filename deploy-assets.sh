#!/bin/bash

# Safe assets-only deployment script (no migrations, no app logic changes)
# Usage: sudo ./deploy-assets.sh /var/www/forkthebloodclart www-data www-data

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root or with sudo${NC}"
   exit 1
fi

# Get parameters
APP_PATH="${1:-.}"
APP_USER="${2:-www-data}"
APP_GROUP="${3:-www-data}"

if [ ! -d "$APP_PATH" ] || [ ! -f "$APP_PATH/artisan" ]; then
    echo -e "${RED}Error: Laravel application not found at $APP_PATH${NC}"
    exit 1
fi

cd "$APP_PATH"

echo -e "${YELLOW}Step 1: Installing Node Dependencies${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install Node dependencies${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Building Frontend Assets${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build frontend assets${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 3: Clearing Laravel Caches${NC}"
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Ensure correct permissions for built assets and cache
chown -R $APP_USER:$APP_GROUP public/build storage bootstrap/cache

echo -e "${GREEN}✓ Assets deployed and caches cleared${NC}"
