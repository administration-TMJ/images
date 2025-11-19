#!/bin/bash
#
# Train In Japan - Automated Deployment Script
# Run this on your DigitalOcean server to deploy from GitHub
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/administration-TMJ/images/main/traininjapan-source/deploy.sh | bash
#   OR
#   wget -O - https://raw.githubusercontent.com/administration-TMJ/images/main/traininjapan-source/deploy.sh | bash
#

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "=========================================="
echo "  Train In Japan - Auto Deployment"
echo "=========================================="
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use: sudo bash deploy.sh)${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}[1/10] Updating system...${NC}"
apt update && apt upgrade -y

# Step 2: Install Python
echo -e "${YELLOW}[2/10] Installing Python...${NC}"
apt install -y python3 python3-pip python3-venv

# Step 3: Install Node.js 20
echo -e "${YELLOW}[3/10] Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Step 4: Install global npm packages
echo -e "${YELLOW}[4/10] Installing Yarn and PM2...${NC}"
npm install -g yarn pm2

# Step 5: Install Nginx
echo -e "${YELLOW}[5/10] Installing Nginx...${NC}"
apt install -y nginx

# Step 6: Install Git
echo -e "${YELLOW}[6/10] Installing Git...${NC}"
apt install -y git

# Step 7: Clone repository
echo -e "${YELLOW}[7/10] Cloning repository from GitHub...${NC}"
cd /var/www
if [ -d "traininjapan" ]; then
    echo "Directory exists, pulling latest changes..."
    cd traininjapan
    git pull
else
    git clone https://github.com/administration-TMJ/images.git temp
    mv temp/traininjapan-source traininjapan
    rm -rf temp
    cd traininjapan
fi

# Step 8: Configure environment variables
echo -e "${YELLOW}[8/10] Configuring environment variables...${NC}"

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo -e "${GREEN}Creating backend/.env file...${NC}"
    cat > backend/.env << 'ENVEOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=traininjapan
JWT_SECRET_KEY=CHANGE_THIS_TO_RANDOM_STRING
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=30
STRIPE_API_KEY=sk_test_YOUR_KEY_HERE
CORS_ORIGINS=*
ENVEOF
    echo -e "${RED}⚠️  IMPORTANT: Edit backend/.env with your MongoDB and Stripe keys!${NC}"
    echo -e "${YELLOW}Run: nano /var/www/traininjapan/backend/.env${NC}"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    echo -e "${GREEN}Creating frontend/.env file...${NC}"
    cat > frontend/.env << 'ENVEOF'
REACT_APP_BACKEND_URL=
REACT_APP_AUTH_URL=https://auth.emergentagent.com
REACT_APP_GOOGLE_MAPS_API_KEY=
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
ENVEOF
fi

# Step 9: Install dependencies and build
echo -e "${YELLOW}[9/10] Installing dependencies...${NC}"

# Backend dependencies
echo "Installing backend dependencies..."
cd /var/www/traininjapan/backend
pip3 install -r requirements.txt

# Frontend dependencies
echo "Installing frontend dependencies (this may take a few minutes)..."
cd /var/www/traininjapan/frontend
yarn install

echo "Building frontend..."
yarn build

# Step 10: Start services with PM2
echo -e "${YELLOW}[10/10] Starting services...${NC}"

# Stop any existing processes
pm2 delete backend 2>/dev/null || true
pm2 delete frontend 2>/dev/null || true

# Start backend
cd /var/www/traininjapan/backend
pm2 start server.py --name backend --interpreter python3

# Start frontend
cd /var/www/traininjapan/frontend
pm2 start "npx serve -s build -l 3000" --name frontend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}"
echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo -e "${NC}"

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Environment Variables:"
echo "   nano /var/www/traininjapan/backend/.env"
echo "   - Add your MongoDB connection string"
echo "   - Add your Stripe API key"
echo "   - Generate random JWT secret"
echo ""
echo "2. Configure Nginx (if not done yet):"
echo "   See: /var/www/traininjapan/DIGITALOCEAN_DEPLOYMENT.md Part 9"
echo ""
echo "3. Setup SSL Certificate:"
echo "   certbot --nginx -d yourdomain.com"
echo ""
echo "4. Restart services after editing .env:"
echo "   pm2 restart all"
echo ""
echo "5. Check status:"
echo "   pm2 status"
echo "   pm2 logs"
echo ""
echo "🌐 Your app is running on:"
echo "   Backend:  http://localhost:8001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📝 View logs:"
echo "   pm2 logs backend"
echo "   pm2 logs frontend"
echo ""
