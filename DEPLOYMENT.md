# Deployment Guide — Agent Services Marketplace

Complete walkthrough to deploy the marketplace on Base + Farcaster.

## Phase 1: Deploy Smart Contract (10 minutes)

### Option A: Using Remix IDE (Easiest)

1. Go to https://remix.ethereum.org
2. Create new file: `AgentMarketplace.sol`
3. Copy code from `src/contracts/AgentMarketplace.sol`
4. Compile (Solidity 0.8.19)
5. Deploy to Base network:
   - Select "Injected Provider"
   - Switch MetaMask to Base network
   - Click Deploy
6. **Save contract address** (you'll need it in next step)

### Option B: Using Hardhat

```bash
npm install --save-dev hardhat
npx hardhat init

# Copy contract to contracts/AgentMarketplace.sol
npx hardhat compile
npx hardhat run scripts/deploy.js --network base
```

### Verify Contract

After deployment, verify on Basescan:
1. Go to https://basescan.org
2. Find your contract address
3. Click "Verify and Publish"
4. Upload source code

---

## Phase 2: Deploy Frontend (5 minutes)

### Prerequisites
- GitHub account (for code)
- Vercel account (for hosting)

### Step 1: Push to GitHub

```bash
cd /home/openclaw/.openclaw/workspace/agent-marketplace

git init
git add .
git commit -m "Initial commit: Agent marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agent-marketplace.git
git push -u origin main
```

### Step 2: Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or use Vercel dashboard:
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Set environment variables:
   - `NEXT_PUBLIC_MARKETPLACE_ADDRESS` = Your contract address
   - `NEXT_PUBLIC_USDC_ADDRESS` = 0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3
   - `NEXT_PUBLIC_MONITOR_ADDRESS` = 0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3
4. Deploy

**Your app URL:** https://agent-marketplace-YOUR_NAME.vercel.app

---

## Phase 3: Register Your Agents (5 minutes)

Once contract is deployed:

```javascript
// Using ethers.js or Web3.js

const marketplaceABI = require('./abi/AgentMarketplace.json');
const contract = new ethers.Contract(
  MARKETPLACE_ADDRESS,
  marketplaceABI,
  signer
);

// Register Polymarket Trader
await contract.registerAgent(
  "Polymarket Trader",
  "Autonomous prediction market trading with 15%+ edge detection",
  "0x...", // Your service contract address (or placeholder)
  ethers.parseUnits("1.0", 6), // 1 USDC
  ethers.parseUnits("1.0", 18) // 1 MONITOR
);

// Register Price Monitor
await contract.registerAgent(
  "Price Monitor",
  "Real-time price monitoring across 4 chains",
  "0x...",
  ethers.parseUnits("0.5", 6),
  ethers.parseUnits("0.5", 18)
);

// Register Bounty Hunter
await contract.registerAgent(
  "Bounty Hunter",
  "Automated Clawlancer bounty claiming",
  "0x...",
  ethers.parseUnits("0.25", 6),
  ethers.parseUnits("0.25", 18)
);
```

Or use a frontend form in the admin panel (will add).

---

## Phase 4: Setup Farcaster Frame (5 minutes)

### Add Frame Metadata

1. In your deployed Vercel app, add OpenGraph tags
2. Farcaster will auto-parse frames
3. Your frame URL: `https://your-app.vercel.app/api/frame`

### Test in Warpcast

1. Go to Warpcast
2. Share a link to your app
3. Add the frame URL in the metadata
4. Click the frame to test

Or use Farcaster Frame Inspector:
https://warpcast.com/~/developers/frames

---

## Phase 5: Go Live (5 minutes)

### Share Farcaster Frame

Post in Warpcast:
```
🚀 Agent Services Marketplace

Access AI agents for trading, monitoring & bounties.
Pay with USDC or burn $MONITOR tokens.

💰 Earn from every transaction
📊 Real-time performance tracking
🔗 Discoverable on Farcaster

[Frame: https://your-app.vercel.app]
```

### Share Base App

Post on Twitter/X:
```
🎉 Live on Base!

Agent Services Marketplace
- Polymarket Trader (15%+ edge)
- Price Monitor (4 chains)
- Bounty Hunter (automated)

Pay with USDC or $MONITOR
https://your-app.vercel.app
```

### Update Links

- Update GitHub README with deployed URL
- Update MONITOR token docs with marketplace link
- Update agent listings with marketplace link

---

## Monitoring & Maintenance

### Daily
- Check app is live
- Monitor transaction errors
- Watch for attacks/exploits

### Weekly
- Check revenue dashboard
- Verify agent performance data
- Update agent descriptions if needed

### Monthly
- Add new agents
- Adjust pricing based on usage
- Share revenue stats
- Plan new features

---

## Troubleshooting

**"Contract not found"**
- Verify contract address is correct
- Make sure you're on Base network (chainId: 8453)

**"Insufficient balance"**
- User needs USDC/MONITOR tokens
- Direct them to: https://bankr.bot/buy?token=MONITOR

**"Transaction failed"**
- Check gas prices
- Verify contract approvals
- Check if user has sufficient tokens

**"Frame not showing in Warpcast"**
- Verify OpenGraph tags are correct
- Wait 24 hours for cache
- Use Frame Inspector to debug

---

## File Checklist

- [x] Smart contract (AgentMarketplace.sol)
- [x] Frontend app (Next.js)
- [x] Farcaster frame integration
- [x] Dashboard components
- [x] Agent cards
- [x] Payment modal
- [ ] Admin panel (to register agents)
- [ ] Real-time performance sync
- [ ] Transaction history page

---

## Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3
NEXT_PUBLIC_MONITOR_ADDRESS=0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
```

---

## Revenue Tracking

Once live, revenue comes from:

**USDC Transactions:**
- You earn 20% of each payment
- Example: User pays 1 USDC → You get 0.20 USDC

**MONITOR Burns:**
- You earn 20% of burn amount
- Example: User burns 1 MONITOR → You get 0.20 MONITOR destroyed (deflationary, raises token price)

**Dashboard:** View all revenue in real-time on app

---

## Next Iterations

After launch:

1. **Admin Panel**
   - Register new agents
   - Update pricing
   - View real-time stats

2. **Agent Performance Integration**
   - Auto-sync Polymarket P&L
   - Auto-sync price monitor results
   - Auto-sync bounty completions

3. **User Dashboard**
   - User transaction history
   - Agent usage analytics
   - Earnings tracking

4. **Payment Gating**
   - Require token holding for discounts
   - Subscription model (monthly)
   - Loyalty rewards

5. **Multi-Chain**
   - Deploy on Polygon, Arbitrum
   - Cross-chain agent services

---

## Support

Questions? Check:
- GitHub Issues: https://github.com/toteonsol/agent-marketplace/issues
- Discord: https://discord.gg/bankr
- Docs: README.md

You're live! 🚀
