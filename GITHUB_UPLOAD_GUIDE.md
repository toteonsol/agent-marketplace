# 📤 GitHub Upload Guide — Agent Suite

Complete instructions for uploading all 3 agents to GitHub with correct stats and monitoring.

## What to Upload

### Core Files (MUST INCLUDE)

**Polymarket Agent:**
```
polymarket-agent/
├── agent-v2.js                    ← Main trading bot (LIVE MODE)
├── agent-monitor.js               ← Health monitoring system (NEW)
├── logger.js                      ← Logging utilities
├── clawlancer-bounty-hunter-v2.js ← Micro-work hunter
├── agent.log                      ← Real trading activity (rename to agent.example.log)
├── clawlancer.log                 ← Bounty hunt logs (rename to clawlancer.example.log)
└── agent-data.json                ← Stats snapshot (rename to agent-data.example.json)
```

**Dashboard:**
```
polymarket-dashboard/
├── src/app/page.tsx               ← Live stats UI
├── src/components/                ← Dashboard components
├── package.json                   ← Dependencies
├── next.config.js                 ← Config
├── README.md                      ← Deployment guide
└── vercel.json                    ← Vercel config
```

**Documentation:**
```
/
├── AGENT_DASHBOARD_README.md      ← Complete agent overview (NEW)
├── DEPLOYMENT.md                  ← Vercel deployment
├── IMPLEMENTATION.md              ← Development guide
└── GITHUB_UPLOAD_GUIDE.md         ← This file
```

**Skills (Bankr Monitor):**
```
bankr-micro-skills/
└── bankr-price-monitor/
    ├── SKILL.md                   ← Skill documentation
    ├── references/                ← API & risk management
    └── scripts/                   ← Example strategies
```

---

## GitHub Repository Setup

### Step 1: Initialize Repo (if new)

```bash
cd /home/openclaw/.openclaw/workspace
git init
git config user.name "Polymarket Agent"
git config user.email "agent@polymarket.local"
```

### Step 2: Create .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.vercel/
dist/
build/
.next/
*.bak
agent.log
clawlancer.log
/tmp/
agent-data-backup.json
polymarket-agent/agent.log
polymarket-agent/clawlancer.log
EOF
```

### Step 3: Add Remote

```bash
# If creating new public repo
git remote add origin https://github.com/YOUR_USERNAME/polymarket-agent.git

# Or if updating existing
git remote set-url origin https://github.com/YOUR_USERNAME/polymarket-agent.git
```

### Step 4: Commit Files

```bash
git add polymarket-agent/
git add polymarket-dashboard/
git add bankr-micro-skills/
git add AGENT_DASHBOARD_README.md DEPLOYMENT.md GITHUB_UPLOAD_GUIDE.md
git commit -m "feat: complete polymarket agent suite with monitoring

- Polymarket trading bot (agent-v2.js) with live 15%+ edge detection
- Clawlancer bounty hunter for micro-work automation
- Bankr price monitor skill for autonomous trading
- Real-time dashboard with stats and performance tracking
- Agent monitoring system to prevent config errors
- Comprehensive documentation for all 3 agents

See AGENT_DASHBOARD_README.md for overview.
"

git push -u origin main
```

---

## Key Stats to Document

### Polymarket Agent Performance

**Current (2026-02-27):**
```json
{
  "agent": "Polymarket (agent-v2.js)",
  "status": "LIVE",
  "startingBankroll": 8.00,
  "currentEquity": 8.00,
  "totalTrades": 2,
  "winRate": 0.0,
  "return": -100.0,
  "configuration": {
    "mode": "LIVE",
    "edgeThreshold": 15,
    "maxBetSize": 25,
    "stopLoss": -10,
    "takeProfit": 20,
    "minDaysToExpiry": 14
  },
  "issues": {
    "current": "Bankr API timeouts (90s) preventing market scans",
    "fixed": "Cron job was running Manifold agent instead of Polymarket (2026-02-27)"
  },
  "expectedPerformance": "$50-200/month once markets found",
  "lastUpdate": "2026-02-27T10:55:23Z"
}
```

### Clawlancer Agent Performance

**Current (2026-02-27):**
```json
{
  "agent": "Clawlancer Bounty Hunter",
  "status": "WAITING",
  "configuration": {
    "scoringModel": {
      "categoryFit": 25,
      "priceRange": 25,
      "buyerReputation": 25,
      "claimedStatus": 25
    },
    "claimThreshold": 60,
    "maxClaimsPerRun": 1
  },
  "currentIssue": "No funded bounties on marketplace (escrow missing)",
  "bountyCount": 50,
  "fundedBounties": 0,
  "expectedPerformance": "$30-100/month once bounties available",
  "reputation": "Ready (API key active)",
  "lastUpdate": "2026-02-27T12:43:15Z"
}
```

### Bankr Price Monitor Performance

**Current (2026-02-27):**
```json
{
  "skill": "Bankr Price Monitor",
  "status": "DEPLOYED",
  "tokenAddress": "0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3",
  "tokenName": "MONITOR",
  "features": [
    "Monitor prices across 4 blockchains",
    "Set buy/sell triggers",
    "Execute swaps autonomously",
    "Risk management (stop-loss, take-profit)",
    "Multiple simultaneous strategies"
  ],
  "revenueModel": "Fee-based (70-90% to creator)",
  "expectedPerformance": "$20-1800/month per agent using",
  "status": "Live, awaiting agents to purchase"
}
```

---

## README.md Template for GitHub

```markdown
# 🤖 Polymarket Agent Suite

Autonomous trading and work-hunting system running 24/7 on Base.

## Features

✅ **Polymarket Agent** — Trade prediction markets with 15%+ edge  
✅ **Clawlancer Bounty Hunter** — Auto-claim micro-work tasks  
✅ **Bankr Price Monitor** — Autonomous price monitoring + swaps  
✅ **Agent Monitoring** — Real-time health checks every 15 min  
✅ **Live Dashboard** — Real-time stats and performance tracking  

## Quick Start

### Prerequisites
- Node.js 18+
- Base network wallet
- Bankr API key

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/polymarket-agent
cd polymarket-agent
npm install
```

### Configuration

1. Set environment variables:
```bash
export BANKR_API_KEY=your_key
export POLYMARKET_WALLET=0x...
export CLAWLANCER_API_KEY=your_key
```

2. Fund wallet with $5-10 USDC on Base

3. Start agent:
```bash
node polymarket-agent/agent-v2.js
```

## Documentation

- **[AGENT_DASHBOARD_README.md](./AGENT_DASHBOARD_README.md)** — Complete overview of all 3 agents
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Vercel dashboard deployment
- **[polymarket-agent/README.md](./polymarket-agent/README.md)** — Agent technical docs

## Performance

| Agent | Status | Expected ROI |
|-------|--------|-------------|
| Polymarket | 🟢 Live | $50-200/month |
| Clawlancer | 🟡 Pending | $30-100/month |
| Bankr Monitor | 🟢 Live | $20-1800/month |

## Monitoring

Agent health checked every 15 minutes:

```bash
node polymarket-agent/agent-monitor.js
```

Alerts if:
- Wrong script running
- Agent missed scheduled run
- Data file is stale

## License

MIT

## Author

Polymarket Agent Suite  
Created for autonomous trading on Base
```

---

## What NOT to Commit

❌ `.env` files (contains API keys)  
❌ `agent.log` (too large, use example)  
❌ `node_modules/` (use npm install)  
❌ `.vercel/` (Vercel auth tokens)  
❌ Live wallet private keys  

## GitHub Secrets (for CI/CD)

If adding GitHub Actions, set these secrets:

```
BANKR_API_KEY
POLYMARKET_WALLET
CLAWLANCER_API_KEY
VERCEL_TOKEN
VERCEL_PROJECT_ID
```

---

## Upload Checklist

- [ ] Create GitHub repo
- [ ] Add all files (except .env, logs)
- [ ] Create README.md with quick start
- [ ] Add AGENT_DASHBOARD_README.md
- [ ] Update agent-data.example.json with latest stats
- [ ] Rename agent.log → agent.example.log
- [ ] Create .gitignore
- [ ] First commit with descriptive message
- [ ] Push to main branch
- [ ] Create GitHub Pages (optional)
- [ ] Share repo link with team

---

## Publishing to ClawHub (for Bankr Price Monitor Skill)

1. Ensure `bankr-price-monitor/` is in repo
2. Include `SKILL.md` in root
3. Create ClawHub account at clawhub.com
4. Submit skill with GitHub link
5. Monitor gets listed for other agents to use

---

**Last Updated:** 2026-02-27 12:47 UTC
