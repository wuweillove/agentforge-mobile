#!/bin/bash

# AgentForge Backend Setup Script

set -e

echo "=================================="
echo "AgentForge Backend Setup"
echo "=================================="

# Check Node.js version
echo "\n[1/7] Checking Node.js version..."
node_version=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ $node_version -lt 18 ]; then
    echo "✗ Node.js 18 or higher is required"
    echo "Current version: $(node -v)"
    exit 1
fi
echo "✓ Node.js $(node -v)"

# Install dependencies
echo "\n[2/7] Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Check for .env file
echo "\n[3/7] Checking environment configuration..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠ Please update .env with your credentials"
else
    echo "✓ .env file exists"
fi

# Check database connection
echo "\n[4/7] Checking database connection..."
if [ -n "$DATABASE_URL" ]; then
    psql $DATABASE_URL -c "SELECT 1" > /dev/null 2>&1 && {
        echo "✓ Database connection successful"
    } || {
        echo "✗ Database connection failed"
        echo "Please check your DATABASE_URL"
    }
else
    echo "⚠ DATABASE_URL not set"
fi

# Check Redis connection
echo "\n[5/7] Checking Redis connection..."
if [ -n "$REDIS_URL" ]; then
    redis-cli -u $REDIS_URL ping > /dev/null 2>&1 && {
        echo "✓ Redis connection successful"
    } || {
        echo "✗ Redis connection failed"
        echo "Please check your REDIS_URL"
    }
else
    echo "⚠ REDIS_URL not set"
fi

# Run migrations
echo "\n[6/7] Running database migrations..."
read -p "Run migrations now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run migrate
    echo "✓ Migrations completed"
else
    echo "Skipped migrations"
fi

# Seed database
echo "\n[7/7] Seeding database..."
read -p "Seed database with demo data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
    echo "✓ Database seeded"
else
    echo "Skipped seeding"
fi

echo "\n=================================="
echo "Setup Complete!"
echo "=================================="
echo "\nNext steps:"
echo "1. Update .env with your credentials"
echo "2. Configure Stripe webhooks"
echo "3. Start server: npm run dev"
echo "4. Test API: curl http://localhost:3000/health"
echo "\nDocumentation: See README.md"
