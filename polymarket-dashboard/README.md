# Polymarket Agent Dashboard

A real-time dashboard to track autonomous Polymarket trading agent performance. Built with Next.js, deployed on Vercel..

## Features

- 📊 **Equity curve tracking** - See portfolio growth over time
- 🎯 **Win/loss analytics** - Track win rate and return metrics
- 💰 **Trade history** - View all executed trades with P&L
- 🔄 **Auto-refresh** - Updates every 30 seconds
- 🔐 **No API keys exposed** - Agent data only, no Bankr credentials

## Architecture

```
Your VPS (Private)
├── Agent runs bankr commands
├── Logs data to: agent-data.json
└── Exposes public URL to JSON

Vercel (Public)
├── Fetches agent-data.json periodically
├── Renders dashboard
└── Anyone can view performance
```

## Setup

### 1. On Your VPS

Set up the agent to log performance data:

```bash
# The agent will write to: /home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json
# Make this file publicly accessible (e.g., via a simple HTTP server)
```

### 2. Deploy to Vercel

```bash
git clone <your-repo>
cd polymarket-dashboard

# Install dependencies
npm install

# Deploy
vercel --prod
```

### 3. Configure Data Source

In `.env.local` (development) or Vercel dashboard (production):

```
NEXT_PUBLIC_AGENT_DATA_URL=https://your-vps.com/agent-data.json
```

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## GitHub Setup

1. Create a GitHub repo
2. Add to `.gitignore`:
   ```
   .env.local
   node_modules/
   .next/
   ```
3. Push code
4. Connect to Vercel

## How It Works

1. **Agent runs on VPS** every 2 hours
2. **Writes JSON log** with trade data
3. **Dashboard fetches** the public JSON
4. **Renders live metrics** with charts

The Bankr API key stays on your VPS. The frontend only reads the public log file.

## File Structure

```
polymarket-dashboard/
├── src/
│   └── app/
│       ├── page.tsx          # Main dashboard
│       ├── layout.tsx        # Root layout
│       ├── globals.css       # Styles
│       └── api/
│           └── agent-data/
│               └── route.ts  # Data API endpoint
├── public/
│   └── agent-data.json       # Agent log (auto-generated)
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Security

- ✅ No API keys in frontend code
- ✅ No credentials in GitHub
- ✅ API key stays on VPS only
- ✅ Dashboard reads public log only
- ✅ Safe to share dashboard URL

## Troubleshooting

**Dashboard shows "No data available"**
- Agent hasn't run yet
- Check `/home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json` exists
- Verify the JSON is valid

**Data not updating**
- Check agent cron job is running
- Verify JSON file is being written
- Check file permissions (should be readable)

## Future Enhancements.

- [ ] Real-time updates via WebSocket
- [ ] Performance analytics (Sharpe ratio, max drawdown)
- [ ] Multi-agent dashboard
- [ ] Performance notifications
- [ ] Strategy backtesting
