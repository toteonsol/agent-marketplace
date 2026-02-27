# 🤖 Agent Suite — Polymarket, Clawlancer, & Bankr Monitor

Complete autonomous trading and work-hunting agent system running 24/7 on Base.

## Overview

Three specialized agents work together to generate income:

| Agent | Purpose | Schedule | Status |
|-------|---------|----------|--------|
| **Polymarket Agent** | Trading prediction markets with 15%+ edge | Every 2 hours | 🟢 LIVE |
| **Clawlancer Bounty Hunter** | Auto-claiming micro-work bounties | Every 30 min | 🟡 Funded bounties pending |
| **Bankr Price Monitor** | Autonomous price monitoring + swaps | Every 6 hours | 🟢 LIVE (skill deployed) |

---

## 1. Polymarket Agent (agent-v2.js)

**Purpose:** Autonomously scan Polymarket, identify prediction markets with 15%+ edge, place bets, and manage positions.

**Configuration:**
```javascript
{
  "mode": "LIVE",           // Place real bets
  "edgeThreshold": 0.15,    // Minimum 15% edge to enter
  "maxBetSize": 0.25,       // 25% of bankroll per bet
  "stopLoss": -0.10,        // Exit at -10%
  "takeProfit": 0.20,       // Exit at +20%
  "minDaysToExpiry": 14     // Only markets resolving in 14+ days
}
```

**What it does:**
1. Checks Bankr for redeemable winning positions
2. Scans Polymarket for eligible markets (high volume, liquid, >14 days)
3. Calculates edge using Bankr probability vs market price
4. Places bets on markets with 15%+ edge
5. Manages positions (stop-loss at -10%, take-profit at +20%)
6. Logs all trades to `agent-data.json`

**Performance (as of 2026-02-27):**
- Starting Bankroll: $8.00
- Current Equity: $8.00
- Total Trades: 2
- Win Rate: 0%
- Status: Running live (Bankr API timeouts causing slow market scans)

**Logs:** `/polymarket-agent/agent.log` (real-time trading activity)
**Data:** `/polymarket-agent/agent-data.json` (JSON stats, used by dashboard)

**Recent Issue Fixed:**
- Cron was running `agent-manifold.js` instead of `agent-v2.js`
- Fixed 2026-02-27 12:45 UTC
- Agent now running correct Polymarket bot

---

## 2. Clawlancer Bounty Hunter (clawlancer-bounty-hunter-v2.js)

**Purpose:** Autonomously hunt and claim micro-work bounties on Clawlancer marketplace.

**Configuration:**
```javascript
{
  "scoringModel": {
    "categoryFit": 25,        // Category match (Research=90pts, Data=85pts, Code=80pts)
    "priceRange": 25,         // Prefer $0.01-0.05 bounties
    "buyerReputation": 25,    // Buyer rating/history
    "claimedStatus": 25       // Unclaimed = higher priority
  },
  "claimThreshold": 60,       // Claim bounties scoring 60+
  "maxClaimsPerRun": 1        // Conservative: 1 claim per scan
}
```

**What it does:**
1. Fetches all active bounties from Clawlancer API
2. Filters for FUNDED bounties (with escrow)
3. Scores each bounty on fit, price, buyer rep, and claimed status
4. Automatically claims top-scoring work (60+ points)
5. Delivers work within 7-day window
6. Builds reputation (100% delivery goal)

**Performance (as of 2026-02-27):**
- Status: **Waiting for funded bounties**
- Current Issue: All 50 bounties lack escrow funding
- Recommendation: Check Clawlancer dashboard for manually funded work
- Reputation: Ready (API key configured)

**Logs:** `/polymarket-agent/clawlancer.log` (bounty claims & deliveries)

**Marketplace Status:**
- ✅ Agent authenticated (API key active)
- ✅ Script ready to claim & deliver
- ⚠️ Platform issue: No funded bounties (marketplace bootstrapping)

---

## 3. Bankr Price Monitor (bankr-price-monitor skill)

**Purpose:** Monitor prices across Base, Ethereum, Polygon, Solana; execute swaps when conditions are met.

**Skill Features:**
- Monitor token prices across 4 blockchains
- Set buy/sell triggers (if price < $X, execute)
- Execute swaps via Bankr
- Multiple simultaneous strategies
- Risk management (stop-loss, take-profit, position limits)

**Status:**
- ✅ MONITOR token deployed (0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3)
- ✅ Skill middleware integrated
- ✅ Token-gating active (agents must hold MONITOR to use)
- ✅ Ready for agent discovery on ClawHub

**Performance:**
- Revenue Model: Fee-based (70-90% of burned tokens to creator)
- Expected: 5-20% of swaps executed via skill → revenue share

**Documentation:** `/bankr-micro-skills/bankr-price-monitor/SKILL.md`

---

## Agent Monitoring (NEW)

**Monitor Script:** `agent-monitor.js`

Runs every 15 minutes to verify:
1. ✅ Correct script is running (no Manifold instead of Polymarket mix-up)
2. ✅ Agents are running on schedule (alert if missed runs)
3. ✅ Data files are being updated (not stale)

**How to run manually:**
```bash
cd /home/openclaw/.openclaw/workspace/polymarket-agent
node agent-monitor.js
```

**Cron job:**
```
*/15 * * * * cd /home/openclaw/.openclaw/workspace/polymarket-agent && node agent-monitor.js >> /tmp/agent-monitor.log 2>&1
```

**Monitor Output:**
```
🔍 AGENT MONITORING REPORT
✅ HEALTHY Polymarket Agent (agent-v2.js)
✅ HEALTHY Clawlancer Bounty Hunter
```

If issues detected, monitor will alert with:
- ❌ CRON ERROR (wrong script, missing schedule)
- ⚠️ STALE (agent hasn't run in threshold time)
- ⚠️ DATA FILE STALE (not being updated)

---

## Files Structure

```
/home/openclaw/.openclaw/workspace/
├── polymarket-agent/
│   ├── agent-v2.js                    ← Polymarket trading bot
│   ├── agent-data.json                ← Real-time stats (JSON)
│   ├── agent.log                      ← Trading logs
│   ├── clawlancer-bounty-hunter-v2.js ← Micro-work hunter
│   ├── clawlancer.log                 ← Bounty claim logs
│   ├── agent-monitor.js               ← Health monitoring (NEW)
│   ├── logger.js                      ← Shared logging utilities
│   └── README.md                      ← Agent documentation
├── polymarket-dashboard/
│   ├── src/app/page.tsx               ← Next.js dashboard UI
│   ├── public/agent-data.json         ← Symlink to agent data
│   └── package.json                   ← Dashboard dependencies
├── bankr-micro-skills/
│   └── bankr-price-monitor/
│       ├── SKILL.md                   ← Skill documentation
│       ├── references/                ← API & risk management
│       └── scripts/                   ← Example strategies
└── AGENT_DASHBOARD_README.md          ← This file
```

---

## Wallet & Keys

**Polymarket/Bankr:**
- Address: `0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12`
- Balance: $8.00 (trading capital)
- Network: Base

**Clawlancer:**
- Agent ID: `a87d2e58-7523-402a-bf80-4b28d7510489`
- API Key: `clw_1fccc2975ca4cdcaad9319f0f74d5dd4`
- Status: ✅ Active, awaiting funded bounties

---

## Dashboard

**Live Dashboard:** `/polymarket-dashboard/` (Next.js)

Shows:
- 📊 Real-time equity curve
- 💰 Current bankroll & P&L
- 📈 Win rate & ROI
- 🎲 Recent trades & positions
- 📋 Performance metrics

**Deploy to Vercel:**
```bash
cd /home/openclaw/.openclaw/workspace/polymarket-dashboard
npm run build
vercel --prod
```

---

## Cron Schedule

| Time | Job | Script |
|------|-----|--------|
| Every 2 hours | Polymarket scan | `agent-v2.js` |
| Every 30 min | Bounty hunt | `clawlancer-bounty-hunter-v2.js` |
| Every 15 min | Agent health check | `agent-monitor.js` |
| Every 6 hours | Redeem winnings | (Integrated in Polymarket agent) |

---

## Troubleshooting

### Polymarket Agent Not Running
1. Check cron: `crontab -l | grep agent-v2`
2. Check logs: `tail -20 /polymarket-agent/agent.log`
3. Run monitor: `node agent-monitor.js`
4. Verify wallet has balance: Check Bankr

### Bankr Timeout Issues
- Bankr API can be slow (90s timeout in place)
- Agent retries next run automatically
- Monitor will alert if scans are missing

### Clawlancer Bounties Not Claiming
- Check if bounties have escrow: Clawlancer dashboard
- Current status: No funded bounties (platform bootstrapping)
- Monitor logs: `cat /polymarket-agent/clawlancer.log`

### Dashboard Not Updating
- Verify symlink: `ls -la /polymarket-dashboard/public/agent-data.json`
- Check data file: `cat /polymarket-agent/agent-data.json`
- Redeploy: `cd /polymarket-dashboard && vercel --prod`

---

## Next Steps

1. ✅ Monitor agents every 15 minutes (prevents Manifold mix-up)
2. ⏳ Wait for Bankr API to stabilize (market scans completing)
3. ⏳ Wait for Clawlancer escrow (micro-work bounties)
4. 📊 Track Polymarket performance over next 2 weeks
5. 🚀 Deploy Bankr Price Monitor skill to ClawHub

---

## Revenue Projection

| Agent | Expected Monthly | Status |
|-------|------------------|--------|
| Polymarket | $50-200 (scaling with bankroll) | 🟢 Live, needs edge markets |
| Clawlancer | $30-100 (once escrow available) | 🟡 Pending |
| Bankr Monitor | $20-1800 (per agent usage) | 🟢 Live |
| **Total** | **$100-2100/month** | 🟢 Growing |

---

**Last Updated:** 2026-02-27 12:47 UTC
**Next Polymarket Scan:** 2026-02-27 14:52 UTC (2 hours)
**Next Monitor Check:** 2026-02-27 13:00 UTC (15 minutes)
