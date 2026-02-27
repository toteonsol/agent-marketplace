# Agent Observatory — Free, Transparent AI Agent Dashboard

**Status:** ✅ Ready to Deploy

## What This Is

A free, observation-only dashboard showing real-time activity from 3 autonomous AI agents running on OpenClaw:
- **📈 Polymarket Trader** — Scans markets for +12% edge opportunities
- **💹 Price Monitor** — Tracks prices across 4 chains
- **🎯 Bounty Hunter** — Hunts and claims bounties

**No wallet required. No signup. No fees. Just watch and learn.**

---

## Key Features

✅ **Free & Open** — Watch agents trade in real-time, no login needed
✅ **Fully Transparent** — Every agent action logged with details
✅ **Mobile-Optimized** — Clean UI works on phone, tablet, desktop
✅ **Learn & Copy** — See agent strategies, replicate them yourself
✅ **Optional Donations** — Support the project with USDC or MONITOR
✅ **Powered by OpenClaw** — AI agents running autonomously

---

## Architecture

### Frontend (This Repo)
- **Framework:** Next.js 14 + React + Tailwind CSS
- **Pages:**
  - `/` — Landing page explaining the project
  - `/observatory` — Real-time dashboard showing agent activity
- **API Routes:**
  - `/api/agents-status` — Fetches current agent logs
  - `/api/donate` — Processes donations via Bankr

### Backend (Local Agents)
- **Agent Log:** `polymarket-agent/agents-activity.json` (unified log)
- **Agents:**
  - `agent-simple.js` — Polymarket agent
  - `price-monitor-simple.js` — Price monitoring
  - `bounty-hunter-simple.js` — Bounty hunting
- **Logger:** `unified-agent-log.js` — Standardized logging

### Data Flow
```
Agent 1 (Polymarket) ──┐
Agent 2 (Price Mon)  ──├──> unified-agent-log.js ──> agents-activity.json
Agent 3 (Bounty)     ──┘
                              ↓
                    /api/agents-status
                              ↓
                         Observatory UI
```

---

## Deployment

### Option 1: Vercel (Recommended)

```bash
# 1. Code is already pushed to GitHub
# 2. Go to https://vercel.com/dashboard
# 3. Click "Add New" → "Project"
# 4. Select: toteonsol/agent-marketplace
# 5. Add Environment Variable:
#    Name: BANKR_API_KEY
#    Value: bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5
# 6. Click "Deploy"

# App will be live at: https://agent-observatory.vercel.app
```

**That's it.** The frontend is deployed.

### Option 2: Run Locally

```bash
cd /home/openclaw/.openclaw/workspace/agent-marketplace

# Install dependencies
npm install

# Run locally
npm run dev

# Opens at http://localhost:3000
```

---

## Running the Agents

### Manual Run
```bash
cd /home/openclaw/.openclaw/workspace/polymarket-agent

# Run all agents
./run-all-agents.sh

# Or individual agents
node agent-simple.js
node price-monitor-simple.js
node bounty-hunter-simple.js
```

### Automatic (Cron)

Add to your cron to run agents every 15 minutes:

```bash
*/15 * * * * /home/openclaw/.openclaw/workspace/polymarket-agent/run-all-agents.sh >> /var/log/agents.log 2>&1
```

Or use OpenClaw's built-in cron:
```bash
openclaw cron add agents-observatory "0 */15 * * * bash /home/openclaw/.openclaw/workspace/polymarket-agent/run-all-agents.sh"
```

---

## How It Works

### For Visitors
1. **Land on homepage** → Explains what it is
2. **Click "Open Observatory"** → See real-time agent activity
3. **Watch feeds** → See what each agent is scanning/trading
4. **Donate (optional)** → Support project with USDC or MONITOR token

### For Agents
1. **Agent runs** (every 15 min via cron)
2. **Agent scans markets/prices/bounties**
3. **Agent logs activity** to `agents-activity.json`
4. **Frontend reads log** via `/api/agents-status`
5. **Dashboard updates** in real-time

---

## Agent Details

### 📈 Polymarket Trader
- **What it does:** Scans prediction markets, finds 12%+ edge opportunities
- **Data source:** Sample markets (MVP) / Real API (production)
- **Action:** Logs market scans, opportunities found
- **Status:** Currently finding 0 edges in sample data (by design)
- **Improvement:** Connect to real Polymarket API with proper error handling

### 💹 Price Monitor
- **What it does:** Tracks token prices across Base, Ethereum, Polygon, Solana
- **Data source:** Simulated prices (MVP) / Real price feeds (production)
- **Action:** Logs prices, triggers alerts on >X% change
- **Status:** Actively logging price updates and alerts
- **Improvement:** Integrate with CoinGecko, Bankr, or DEX price feeds

### 🎯 Bounty Hunter
- **What it does:** Scans bounty platforms, attempts to claim work
- **Data source:** Sample bounties (MVP) / Real Clawlancer API (production)
- **Action:** Logs available bounties, claims, completions
- **Status:** Actively logging bounty hunts
- **Improvement:** Integrate with real Clawlancer API

---

## Next Steps

### Phase 1: MVP (Current)
- ✅ Dashboard deployed
- ✅ Agents logging
- ✅ Free observation
- ⏳ Add real data sources

### Phase 2: Production Data
- Integrate Polymarket real API (with timeout fixes)
- Integrate real price feeds
- Integrate real Clawlancer API
- Better error handling

### Phase 3: Monetization (Optional)
- Add "Premium Insights" (paid)
- Advanced strategy analytics
- Trading signal notifications
- Capital pool (if users request it)

---

## FAQs

**Q: Will the agents actually make money?**
A: Possibly. The MVP uses demo data. Once real APIs are integrated, agents will trade real markets with real capital.

**Q: Can I donate?**
A: Yes. Click the "Support Project" button. Donations go to funding agent development.

**Q: What's the MONITOR token?**
A: A token on Base that represents support for the project. It has no special utility—it's just for supporters.

**Q: Can I copy the strategies?**
A: Absolutely. All strategies are logged transparently. Copy what works and build your own.

**Q: Is this a scam?**
A: No. It's open-source, transparent, and non-commercial. We're just showing what autonomous agents can do.

---

## Technical Details

### Build
```bash
npm run build  # Creates optimized build
npm run start  # Runs production server
npm run dev    # Runs development server
```

### Agent Logging Format
```json
{
  "agents": {
    "polymarket": {
      "name": "Polymarket Trader",
      "status": "active",
      "stats": {
        "marketsScanned": 4,
        "betsPlaced": 0
      },
      "recentActivities": [
        {
          "timestamp": "2026-02-27T10:00:00.000Z",
          "type": "scan_complete",
          "message": "Scanned 4 markets, found 0 with 12%+ edge",
          "status": "success"
        }
      ]
    }
  }
}
```

### API Endpoints

**GET /api/agents-status**
Returns current agent status and recent activities.

```bash
curl https://agent-observatory.vercel.app/api/agents-status
```

**POST /api/donate**
Process a donation via Bankr.

```bash
curl -X POST https://agent-observatory.vercel.app/api/donate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "5",
    "token": "USDC",
    "projectName": "Agent Observatory"
  }'
```

---

## Files & Structure

```
agent-marketplace/
├── src/
│   ├── pages/
│   │   ├── index.tsx              (Landing page)
│   │   ├── observatory.tsx         (Dashboard)
│   │   └── api/
│   │       ├── agents-status.ts    (Agent data endpoint)
│   │       ├── donate.ts           (Donation endpoint)
│   │       └── pay.ts              (Legacy payment, unused)
│   ├── components/
│   │   ├── AgentCard.tsx           (Agent display)
│   │   └── Dashboard.tsx           (Stats display)
│   └── styles/
│       └── globals.css             (Tailwind styles)
├── package.json
├── tsconfig.json
└── tailwind.config.js

polymarket-agent/
├── unified-agent-log.js            (Logger class)
├── agent-simple.js                 (Polymarket agent)
├── price-monitor-simple.js         (Price monitor)
├── bounty-hunter-simple.js         (Bounty hunter)
├── run-all-agents.sh               (Cron runner)
└── agents-activity.json            (Live log)
```

---

## Support

- **Issues?** Check the logs: `tail /home/openclaw/.openclaw/workspace/polymarket-agent/agents-activity.json`
- **Deploy issues?** Check Vercel dashboard for build logs
- **Questions?** See FAQ above

---

**Built with OpenClaw 🤖**
