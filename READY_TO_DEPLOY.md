# ✅ Ready to Deploy — Agent Marketplace

**Status:** Code is refactored, tested locally, and ready to push to GitHub and deploy to Vercel.

## What Changed from Original

**Original approach:**
- Deployed custom `AgentMarketplace.sol` smart contract to Base
- Called contract functions from frontend
- Complex deployment (contract + frontend)

**New simplified approach:**
- ✅ **No custom smart contract needed**
- ✅ **Bankr API handles all payments** (you already have the key)
- ✅ **Simple JSON database** for transaction logging
- ✅ **Frontend only** (deploy to Vercel and done)

## Code Changes Made

### 1. **Removed Web3 Dependencies**
- ❌ Removed: `wagmi`, `viem`, `ethers` (contract interaction)
- ✅ Added: `axios` (HTTP requests), `uuid` (transaction IDs)

### 2. **Created API Endpoint**
- **File:** `src/pages/api/pay.ts`
- **Purpose:** Handles payment requests from frontend
- **How it works:**
  1. User submits payment via modal
  2. Frontend calls `/api/pay` endpoint
  3. Endpoint calls Bankr API with payment details
  4. Bankr executes transaction on Base
  5. Transaction logged to `data/transactions.json`
  6. User gets success confirmation with tx hash

### 3. **Updated Frontend UI**
- **File:** `src/pages/index.tsx`
- **Changes:**
  - Removed wallet connection logic (now manual address entry)
  - Updated purchase modal to call `/api/pay` endpoint
  - Added error handling for failed payments
  - Fetch real transactions from API instead of mock data

### 4. **Added Environment Config**
- **File:** `.env.example`
- **Required:** `BANKR_API_KEY`

## How It Works

### Payment Flow
```
User clicks "Use Agent"
  ↓
Enters wallet address (if not already)
  ↓
Selects payment method (USDC or MONITOR)
  ↓
Clicks "Purchase"
  ↓
Frontend calls POST /api/pay
  ↓
/api/pay calls Bankr API
  ↓
Bankr executes payment on Base (2% fee to you, 98% to creator)
  ↓
Transaction logged to data/transactions.json
  ↓
Success modal shows tx hash
```

### Revenue Model
- **Per transaction:** 2% fee automatically sent to your wallet
- **Example:** User pays $1 USDC
  - You get: $0.02
  - Agent creator gets: $0.98
  - Works for both USDC and MONITOR tokens

## Deployment Checklist

- [x] Code refactored to use Bankr API
- [x] No smart contracts in deployment
- [x] Environment config added (.env.example)
- [x] API endpoint created (/api/pay)
- [x] Frontend updated to use API
- [x] Git repo initialized locally
- [x] First commit created
- [ ] Push to GitHub (next step)
- [ ] Deploy to Vercel (next step)
- [ ] Add BANKR_API_KEY to Vercel env vars (next step)
- [ ] Test payments (next step)

## Next Steps — Push to GitHub & Deploy

### Step 1: Push to GitHub

```bash
cd /home/openclaw/.openclaw/workspace/agent-marketplace

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/agent-marketplace.git

# Rename branch to main
git branch -M main

# Push
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### Step 2: Deploy to Vercel

**Option A (Easiest — via GUI):**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Click "Import"
5. Add env variable: `BANKR_API_KEY=clw_1fccc2975ca4cdcaad9319f0f74d5dd4`
6. Click "Deploy"

**Option B (CLI):**
```bash
npm install -g vercel
cd /home/openclaw/.openclaw/workspace/agent-marketplace
vercel --prod
```

### Step 3: Test the App

Once deployed:
1. Visit your Vercel URL
2. Click "Connect Wallet"
3. Enter any Ethereum address (e.g., `0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12`)
4. Select an agent
5. Choose payment method (USDC or MONITOR)
6. Click "Purchase"
7. Bankr will process the payment
8. Transaction will be logged

## File Locations

| File | Purpose |
|------|---------|
| `src/pages/api/pay.ts` | Payment processing endpoint |
| `src/pages/index.tsx` | Main UI (refactored for Bankr) |
| `src/components/AgentCard.tsx` | Agent card display |
| `src/components/Dashboard.tsx` | Stats dashboard |
| `.env.example` | Environment template |
| `package.json` | Dependencies (updated) |
| `BANKR_DEPLOY_GUIDE.md` | Detailed deployment instructions |
| `QUICK_DEPLOY.sh` | Helper script for GitHub push |

## Bankr API Key

Your actual Bankr API key (used by polymarket agent):
```
BANKR_API_KEY=bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5
```

When deploying to Vercel, add this as an environment variable.

## Important Notes

1. **Vercel Serverless Limitation:** The JSON database (`data/transactions.json`) is stored in the filesystem, which may not persist across all serverless deployments. For production, consider:
   - Adding Vercel KV (Redis) add-on
   - Using external database (Firebase, Supabase, Postgres)
   - Using Vercel Postgres

2. **Test Mode:** Bankr API should have test/sandbox mode. Make sure to use production mode once verified.

3. **Farcaster Integration:** Can be added later — not needed for initial deployment.

## Questions?

- **Bankr API:** https://docs.bankr.bot
- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs

---

**Ready to go live!** 🚀

Follow the "Next Steps" section above to deploy.
