# Quick Start Guide

## For GitHub + Vercel

### Step 1: Create GitHub Repo

```bash
# On your local machine
git clone https://github.com/yourusername/polymarket-dashboard.git
cd polymarket-dashboard

# Or initialize new repo
git init
git add .
git commit -m "Initial commit: Polymarket Agent Dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/polymarket-dashboard.git
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Click "Deploy"

### Step 3: Connect Agent Data

The dashboard needs to read your agent's performance log.

**On your VPS**, symlink the agent log:
```bash
# Inside the dashboard repo
ln -s /home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json public/agent-data.json
```

Or copy it periodically:
```bash
# Add to cron (run every 5 minutes)
*/5 * * * * cp /home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json /path/to/dashboard/public/agent-data.json
```

### Step 4: Test

Visit your Vercel URL: `https://your-app.vercel.app`

You should see:
- Current bankroll ($9.85)
- Empty trades (no bets placed yet)
- Live status indicator

### Step 5: Start Agent & Monitor

```bash
# On VPS, start the agent (dry-run first)
cd /home/openclaw/.openclaw/workspace/polymarket-agent
node agent-v2.js --dry-run

# Once ready, enable live mode
node agent-v2.js --force-bet
```

Dashboard will auto-update every 30 seconds.

## File Dependencies for Vercel

✅ **Vercel will handle these automatically:**
- `next.js` - Framework
- `react` - UI library
- `recharts` - Charts
- `tailwindcss` - Styling
- All in `package.json`

✅ **No external API keys needed** in the code

✅ **Data source:** Public `agent-data.json` file

## Troubleshooting

**"No data available" error**
```bash
# Check agent log exists and is valid JSON
cat /home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json | jq .

# Verify symlink works
ls -la public/agent-data.json
```

**Dashboard doesn't update**
- Agent may not have run yet
- Check cron job: `crontab -l`
- Manually run agent: `node agent-v2.js --dry-run`

**Vercel build fails**
```bash
npm run build  # Test locally first
```

## Environment Variables (Not Needed!)

This dashboard doesn't need any env vars because:
- ✅ No API keys in frontend
- ✅ No auth required
- ✅ Data is public JSON file
- ✅ Perfect for sharing

## Next: Fund & Deploy

Once ready:
1. Fund your agent wallet ($20-50 USDC)
2. Switch agent to live: `--force-bet`
3. Share your dashboard URL
4. Watch performance grow

**You're ready to go! 🚀**
