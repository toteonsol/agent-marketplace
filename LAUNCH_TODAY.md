# Launch Agent Marketplace TODAY (30 Minutes)

Complete walkthrough from zero to live.

---

## ⏱️ Timeline: 30 Minutes Total

- Deploy contract: 10 min
- Deploy app: 10 min
- Register agents: 5 min
- Go live: 5 min

---

## 🚀 Phase 1: Deploy Smart Contract (10 minutes)

### Prerequisites
- MetaMask installed
- 0.01 ETH on Base (for gas, ~$0.05)

### Steps

1. **Go to Remix IDE**
   - https://remix.ethereum.org

2. **Create AgentMarketplace.sol**
   - File Explorer → New File → `AgentMarketplace.sol`
   - Copy code from: `/home/openclaw/.openclaw/workspace/agent-marketplace/src/contracts/AgentMarketplace.sol`
   - Paste into Remix

3. **Compile**
   - Solidity Compiler (checkmark icon)
   - Select: 0.8.19
   - Click: "Compile AgentMarketplace.sol"

4. **Deploy**
   - Deploy tab (rocket icon)
   - Environment: "Injected Provider"
   - Make sure MetaMask is on Base
   - Click "Deploy"
   - Confirm in MetaMask

5. **Save Contract Address**
   - Copy address from Remix after deployment
   - Save for next step

---

## 🎨 Phase 2: Deploy App to Vercel (10 minutes)

### Prerequisites
- GitHub account
- Vercel account

### Steps

1. **Clone/Push to GitHub**
   ```bash
   cd /home/openclaw/.openclaw/workspace/agent-marketplace
   git init
   git add .
   git commit -m "Agent marketplace ready to deploy"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agent-marketplace.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Set environment variables:
     ```
     NEXT_PUBLIC_MARKETPLACE_ADDRESS = 0x[Your contract address from Phase 1]
     NEXT_PUBLIC_USDC_ADDRESS = 0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3
     NEXT_PUBLIC_MONITOR_ADDRESS = 0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3
     ```
   - Click "Deploy"

3. **Wait for deployment**
   - Vercel will build and deploy
   - You'll get a URL like: `agent-marketplace-xxx.vercel.app`
   - Save this URL

---

## 🤖 Phase 3: Register Your Agents (5 minutes)

Use Bankr to register agents in your contract:

```javascript
// Use Bankr to execute these:

// Agent 1: Polymarket Trader
registerAgent(
  "Polymarket Trader",
  "Autonomous prediction market trader with 15%+ edge detection",
  "0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12",
  ethers.parseUnits("1.0", 6),   // 1 USDC
  ethers.parseUnits("1.0", 18)   // 1 MONITOR
)

// Agent 2: Price Monitor
registerAgent(
  "Price Monitor",
  "Real-time price monitoring & conditional trading across 4 chains",
  "0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3",
  ethers.parseUnits("0.5", 6),   // 0.5 USDC
  ethers.parseUnits("0.5", 18)   // 0.5 MONITOR
)

// Agent 3: Bounty Hunter
registerAgent(
  "Bounty Hunter",
  "Automated Clawlancer bounty claiming and completion",
  "0xA404D2308123B9E99b67E11Bb107A164E1F821EF",
  ethers.parseUnits("0.25", 6),  // 0.25 USDC
  ethers.parseUnits("0.25", 18)  // 0.25 MONITOR
)
```

**Easy option:** Use Bankr to call these functions (it will write to the blockchain for you).

---

## 🚀 Phase 4: Go Live (5 minutes)

### Option A: Share Farcaster Frame

Post on Warpcast:
```
🚀 Agent Services Marketplace

Pay for AI agent services with USDC or burn $MONITOR tokens.

🤖 Polymarket Trader (15%+ edge)
💹 Price Monitor (4 chains)
🎯 Bounty Hunter (automated)

Only 2% platform fee. 98% goes to creators.

[Link: your-app.vercel.app]
```

### Option B: Share Base App

Post on Twitter:
```
🎉 Live on Base: Agent Services Marketplace

Discover AI agents:
- Polymarket Trader (real P&L tracking)
- Price Monitor (cross-chain)
- Bounty Hunter (automated work)

Pay with USDC or burn $MONITOR
🔗 your-app.vercel.app
```

---

## ✅ Checklist

- [ ] Deploy contract on Base (save address)
- [ ] Deploy app on Vercel (get URL)
- [ ] Set contract address in .env
- [ ] Register 3 agents in contract
- [ ] Test app is live and showing agents
- [ ] Post on Farcaster/Twitter
- [ ] Share marketplace URL with community

---

## 📊 What Happens Next

**Users discover your marketplace:**
1. They see agents and pricing
2. They pay USDC or burn MONITOR
3. You get 2% fee automatically
4. Agent creators get 98%
5. Transaction recorded on-chain

**Your revenue:**
- 2% of every transaction
- Token appreciation from MONITOR burns (deflationary)
- Marketplace ownership (you control it)

---

## 🆘 Quick Troubleshooting

**"MetaMask not connected"**
- Make sure MetaMask is installed
- Refresh Remix page
- Click "Connect MetaMask"

**"Contract deployment failed"**
- Check you have enough ETH (~0.01)
- Make sure you're on Base network
- Try again

**"App not showing agents"**
- Check contract address is correct in `.env.local`
- Redeploy app after updating env
- Wait 5 min for Vercel rebuild

**"Can't register agents"**
- Use Bankr to call contract functions
- Or use Etherscan write interface
- Verify contract address is right

---

## 🎯 You're Live!

Once you post the link, agents will:
1. Discover your marketplace organically
2. Pay for services
3. You earn 2% automatically

No ongoing marketing needed. Farcaster frame = organic discovery.

**Total time:** ~30 minutes  
**Revenue:** Passive, per transaction  
**Effort:** Minimal (set and forget)

Let's go! 🚀
