#!/bin/bash

# AgentForge API Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: development, staging, production

set -e

ENV=${1:-development}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups"

echo "=================================="
echo "AgentForge API Deployment"
echo "Environment: $ENV"
echo "Timestamp: $TIMESTAMP"
echo "=================================="

# Load environment variables
if [ -f ".env.$ENV" ]; then
    echo "Loading .env.$ENV"
    export $(cat ".env.$ENV" | grep -v '^#' | xargs)
else
    echo "Warning: .env.$ENV not found"
fi

# Function to backup database
backup_database() {
    echo "\n[1/6] Backing up database..."
    mkdir -p $BACKUP_DIR
    
    if [ -n "$DATABASE_URL" ]; then
        BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
        pg_dump $DATABASE_URL > $BACKUP_FILE
        echo "✓ Database backed up to $BACKUP_FILE"
    else
        echo "⚠ DATABASE_URL not set, skipping backup"
    fi
}

# Function to run database migrations
run_migrations() {
    echo "\n[2/6] Running database migrations..."
    npm run migrate
    echo "✓ Migrations completed"
}

# Function to build application
build_app() {
    echo "\n[3/6] Installing dependencies..."
    npm ci --only=production
    echo "✓ Dependencies installed"
}

# Function to run tests
run_tests() {
    echo "\n[4/6] Running tests..."
    npm test || {
        echo "✗ Tests failed!"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
    echo "✓ Tests passed"
}

# Function to deploy to Docker
deploy_docker() {
    echo "\n[5/6] Deploying with Docker..."
    docker-compose -f docker-compose.yml up -d --build
    echo "✓ Docker containers started"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "\n[5/6] Deploying to Vercel..."
    
    if [ "$ENV" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
    
    echo "✓ Deployed to Vercel"
}

# Function to deploy to Railway
deploy_railway() {
    echo "\n[5/6] Deploying to Railway..."
    railway up
    echo "✓ Deployed to Railway"
}

# Function to verify deployment
verify_deployment() {
    echo "\n[6/6] Verifying deployment..."
    sleep 5
    
    HEALTH_URL=${API_URL:-"http://localhost:3000"}
    HEALTH_CHECK="$HEALTH_URL/health"
    
    echo "Checking $HEALTH_CHECK"
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK || echo "000")
    
    if [ "$RESPONSE" = "200" ]; then
        echo "✓ Health check passed"
        echo "✓ Deployment successful!"
        return 0
    else
        echo "✗ Health check failed (HTTP $RESPONSE)"
        echo "✗ Deployment may have issues"
        return 1
    fi
}

# Main deployment flow
main() {
    echo "Starting deployment..."
    
    # Backup database
    if [ "$ENV" != "development" ]; then
        backup_database
    fi
    
    # Run migrations
    run_migrations
    
    # Build application
    build_app
    
    # Run tests (skip in production if you want)
    if [ "$ENV" = "development" ]; then
        run_tests
    fi
    
    # Deploy based on platform
    case ${DEPLOY_PLATFORM:-docker} in
        docker)
            deploy_docker
            ;;
        vercel)
            deploy_vercel
            ;;
        railway)
            deploy_railway
            ;;
        *)
            echo "Unknown deployment platform: $DEPLOY_PLATFORM"
            exit 1
            ;;
    esac
    
    # Verify deployment
    verify_deployment
    
    echo ""
    echo "=================================="
    echo "Deployment Complete!"
    echo "Environment: $ENV"
    echo "Platform: ${DEPLOY_PLATFORM:-docker}"
    echo "Timestamp: $TIMESTAMP"
    echo "=================================="
}

# Run main function
main
