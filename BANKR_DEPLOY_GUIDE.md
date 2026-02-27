# Agent Marketplace — Bankr API Deployment Guide

**This is the simplified version using Bankr API (no smart contracts needed).**

## What You're Deploying

- **Frontend:** Next.js app on Vercel (UI for browsing agents & making purchases)
- **Payments:** Bankr API (processes USDC & MONITOR payments on Base)
- **Database:** Simple JSON file (Vercel serverless — tracks transactions)
- **Revenue:** 2% platform fee on every transaction

## Prerequisites

✅ Bankr API key (you already have this: `bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5`)
✅ GitHub account (for code storage)
✅ Vercel account (for hosting — free tier is fine)
✅ MONITOR token already deployed on Base

## Step 1: Set Up GitHub Repository

You've already created the repo. Now push the code:

```bash
cd /home/openclaw/.openclaw/workspace/agent-marketplace

# Configure git
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/agent-marketplace.git

# Create .env.local file (for local testing)
cp .env.example .env.local
# Edit .env.local and add your Bankr API key:
# BANKR_API_KEY=bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5

# Push to GitHub
git branch -M main
git add .
git commit -m "Initial commit: Bankr-powered agent marketplace"
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI (Fastest)

```bash
# Install Vercel CLI if you don't have it
npm install -g vercel

# Deploy
vercel --prod

# When prompted:
# - Link to existing project? → No
# - Project name: agent-marketplace
# - Framework: Next.js
# - Root directory: ./
```

### Option B: Via Vercel Dashboard (GUI)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repo (`agent-marketplace`)
4. Click "Import"
5. Add environment variables:
   - `BANKR_API_KEY` = `bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5`
6. Click "Deploy"

## Step 3: Set Environment Variables on Vercel

After deployment, add your Bankr API key:

1. Go to Vercel project settings
2. → Environment Variables
3. Add:
   ```
   BANKR_API_KEY = clw_1fccc2975ca4cdcaad9319f0f74d5dd4
   ```
4. Redeploy (Vercel will auto-redeploy, or trigger manually)

## Step 4: Test the App

1. Visit your Vercel URL (e.g., `https://agent-marketplace-abc123.vercel.app`)
2. Click "Connect Wallet"
3. Enter a test Ethereum address (e.g., `0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12`)
4. Browse agents
5. Click "Use Agent" on any agent
6. Select payment method (USDC or MONITOR)
7. Click "Purchase" (this will call Bankr API)

**What happens:**
- Bankr processes the payment on Base
- Transaction is logged to the JSON database
- You earn 2% fee, agent creator gets 98%
- Dashboard shows real-time transaction history

## Step 5: Add to Farcaster (Optional, Later)

Once deployed, you can create a Farcaster frame that links to your app:

```
Frame URL: https://your-vercel-url/api/farcaster
This will show your app as a miniapp in Farcaster feeds
```

(We'll handle this in a separate step)

## File Structure

```
agent-marketplace/
├── src/
│   ├── pages/
│   │   ├── index.tsx          (Main UI)
│   │   └── api/
│   │       └── pay.ts         (Payment API endpoint)
│   ├── components/
│   │   ├── AgentCard.tsx      (Agent display)
│   │   └── Dashboard.tsx      (Stats display)
│   └── frames/
│       └── farcaster-frame.tsx (Farcaster integration)
├── package.json
├── next.config.js
├── .env.example               (Copy to .env.local)
└── data/
    └── transactions.json      (Auto-created, tracks all payments)
```

## How Payments Work

**User Flow:**
```
1. User visits app
2. Clicks "Connect Wallet" → enters their address
3. Selects an agent → clicks "Use Agent"
4. Modal appears → selects payment method (USDC or MONITOR)
5. Clicks "Purchase"
   └→ Frontend calls /api/pay endpoint
   └→ /api/pay calls Bankr API
   └→ Bankr executes payment on Base
   └→ Transaction logged to data/transactions.json
   └→ Success message with tx hash
```

**Behind the scenes:**
- Payment token: `paymentToken` (USDC or MONITOR)
- Amount: Specified in USD value
- Recipient: Bankr handles splitting (2% to you, 98% to agent creator)
- Logging: Every payment is saved with timestamp, fee breakdown, tx hash

## Environment Variables Required

```bash
# Required for production
BANKR_API_KEY=clw_1fccc2975ca4cdcaad9319f0f74d5dd4

# Optional (for Farcaster, added later)
NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.farcaster.cast
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Troubleshooting

**Build fails?**
- Check Node version (should be 18+)
- Run `npm install` locally, commit node_modules (or check .gitignore)
- Clear Vercel cache: Project → Settings → Deployments → Clear Cache

**Payments not working?**
- Check Bankr API key is correct
- Verify API key has read-write permissions
- Check network is Base (Bankr may default to Ethereum)
- Review /api/pay logs in Vercel dashboard

**Transactions not saving?**
- Vercel serverless doesn't persist files by default
- Use Vercel KV (add-on) for production, or
- Use edge functions + Postgres, or
- Use external DB (Firebase, Supabase, etc.)
- For MVP, the JSON file approach works fine for testing

## Next Steps

1. ✅ Deploy to Vercel (you are here)
2. 🔄 Test payments with Bankr
3. 📊 Monitor dashboard for transactions
4. 🚀 Share Farcaster frame URL (later)
5. 💰 Track platform fees earned

## Support

- Bankr API docs: https://docs.bankr.bot
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs

Ready to deploy? Start with Step 1!
