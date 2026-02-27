#!/bin/bash

# Agent Marketplace — Quick Deploy Script
# This script handles the GitHub push and provides Vercel deployment instructions

set -e

echo "🚀 Agent Marketplace Quick Deploy"
echo "=================================="
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
  echo "❌ GitHub username required"
  exit 1
fi

REPO_URL="https://github.com/$GITHUB_USER/agent-marketplace.git"

# Configure git
echo "📝 Configuring git..."
git config --global user.email "agent@marketplace.local" 2>/dev/null || true
git config --global user.name "Agent Marketplace" 2>/dev/null || true

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
  echo "🔗 Updating existing remote..."
  git remote set-url origin "$REPO_URL"
else
  echo "🔗 Adding remote..."
  git remote add origin "$REPO_URL"
fi

# Create .env.local from example
if [ ! -f .env.local ]; then
  echo "📋 Creating .env.local..."
  cp .env.example .env.local
  echo ""
  echo "⚠️  IMPORTANT: Edit .env.local and add your Bankr API key:"
  echo "   BANKR_API_KEY=clw_1fccc2975ca4cdcaad9319f0f74d5dd4"
  echo ""
fi

# Initialize and commit
echo "📦 Preparing code..."
git add .
git commit -m "Initial commit: Bankr-powered agent marketplace" 2>/dev/null || true

# Set main branch
git branch -M main 2>/dev/null || true

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Visit Vercel: https://vercel.com/dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Select your GitHub repo (agent-marketplace)"
echo "4. Add Environment Variable:"
echo "   • Name: BANKR_API_KEY"
echo "   • Value: clw_1fccc2975ca4cdcaad9319f0f74d5dd4"
echo "5. Click 'Deploy'"
echo ""
echo "📖 Full guide: BANKR_DEPLOY_GUIDE.md"
echo ""
