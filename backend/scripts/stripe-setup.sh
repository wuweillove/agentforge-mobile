#!/bin/bash

# Stripe Setup Script
# Creates products and prices in Stripe

set -e

echo "=================================="
echo "Stripe Setup for AgentForge"
echo "=================================="

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "✗ Stripe CLI not found"
    echo "Install from: https://stripe.com/docs/stripe-cli"
    exit 1
fi

echo "✓ Stripe CLI found"

# Login to Stripe
echo "\nLogging in to Stripe..."
stripe login

# Create Premium Plan
echo "\nCreating Premium subscription plan..."
PREMIUM_PRODUCT=$(stripe products create \
  --name="AgentForge Premium" \
  --description="Unlimited workflows, 50 nodes, 10K API calls/month" \
  --format=json | jq -r '.id')

PREMIUM_PRICE=$(stripe prices create \
  --product=$PREMIUM_PRODUCT \
  --unit-amount=999 \
  --currency=usd \
  --recurring-interval=month \
  --format=json | jq -r '.id')

echo "✓ Premium plan created"
echo "  Product ID: $PREMIUM_PRODUCT"
echo "  Price ID: $PREMIUM_PRICE"

# Create Enterprise Plan
echo "\nCreating Enterprise subscription plan..."
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="AgentForge Enterprise" \
  --description="Unlimited everything + team collaboration" \
  --format=json | jq -r '.id')

ENTERPRISE_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_PRODUCT \
  --unit-amount=4999 \
  --currency=usd \
  --recurring-interval=month \
  --format=json | jq -r '.id')

echo "✓ Enterprise plan created"
echo "  Product ID: $ENTERPRISE_PRODUCT"
echo "  Price ID: $ENTERPRISE_PRICE"

# Setup webhook
echo "\nSetting up webhook endpoint..."
read -p "Enter your webhook URL (e.g., https://api.agentforge.io/webhooks/stripe): " WEBHOOK_URL

if [ -n "$WEBHOOK_URL" ]; then
    WEBHOOK=$(stripe webhook_endpoints create \
      --url=$WEBHOOK_URL \
      --enabled-events=customer.subscription.created \
      --enabled-events=customer.subscription.updated \
      --enabled-events=customer.subscription.deleted \
      --enabled-events=payment_intent.succeeded \
      --enabled-events=payment_intent.payment_failed \
      --enabled-events=invoice.payment_succeeded \
      --enabled-events=invoice.payment_failed \
      --format=json)
    
    WEBHOOK_SECRET=$(echo $WEBHOOK | jq -r '.secret')
    
    echo "✓ Webhook created"
    echo "  Webhook Secret: $WEBHOOK_SECRET"
else
    echo "Skipped webhook setup"
fi

# Output environment variables
echo "\n=================================="
echo "Add these to your .env file:"
echo "=================================="
echo "STRIPE_PRICE_PREMIUM=$PREMIUM_PRICE"
echo "STRIPE_PRICE_ENTERPRISE=$ENTERPRISE_PRICE"
if [ -n "$WEBHOOK_SECRET" ]; then
    echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET"
fi
echo "\n=================================="
echo "Setup Complete!"
echo "=================================="
