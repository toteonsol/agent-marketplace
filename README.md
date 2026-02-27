# Agent Services Marketplace

A mini app on Base and Farcaster where users can discover and pay for AI agent services using USDC or MONITOR tokens.

## Features

✅ **On-Chain Payment**
- Pay with USDC (stablecoin)
- Burn MONITOR tokens (deflationary)
- 2% platform fee (you earn from every transaction)

✅ **Agent Services**
- Polymarket Trader (prediction market bot)
- Price Monitor (cross-chain price monitoring)
- Bounty Hunter (automated bounty claiming)

✅ **Farcaster Frame**
- Discoverable in Farcaster feeds
- Interactive buttons to browse agents
- Direct payment via frame transaction

✅ **Base Mini App**
- Real-time agent performance dashboard
- Transaction history
- Revenue tracking
- Agent statistics

## Quick Start

### Prerequisites
- Node.js 18+
- Vercel account (for deployment)
- MetaMask or other Web3 wallet

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Deploy

```bash
npm run build
vercel --prod
```

## Architecture

### Smart Contract (AgentMarketplace.sol)
- Register agents
- Process USDC payments
- Burn MONITOR tokens
- Track revenue
- Handle payouts

**Contract Address (Base):** (Deploy and update this)

### Frontend
- **App:** Next.js + React + TailwindCSS
- **Blockchain:** wagmi + viem
- **Charts:** Recharts
- **State:** Zustand

### Farcaster Integration
- OpenGraph frames for agent discovery
- Transaction frames for payments
- Button-based navigation

## Token Addresses (Base)

- **USDC:** `0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3`
- **MONITOR:** `0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3`

## How It Works

### For Users

1. **Discover** agents on Farcaster or Base app
2. **View** agent performance & pricing
3. **Pay** with USDC or burn MONITOR
4. **Use** the agent service
5. **Track** results on dashboard

### For You

1. **Register** your agents in the contract
2. **Set pricing** in USDC and MONITOR
3. **Earn** 20% of every transaction
4. **Track revenue** in real-time
5. **Scale** by adding more agents

## Revenue Model

```
User pays: 1 USDC for agent service

Platform earns: 0.02 USDC (2%)
Agent creator gets: 0.98 USDC (98%)

OR

User burns: 1 MONITOR token

Platform earns: 0.02 MONITOR (burned, deflationary)
Agent creator gets: 0.98 MONITOR
```

## File Structure

```
agent-marketplace/
├── src/
│   ├── contracts/
│   │   └── AgentMarketplace.sol     (Smart contract)
│   ├── pages/
│   │   └── index.tsx                (Main app)
│   ├── components/
│   │   ├── Dashboard.tsx            (Stats display)
│   │   └── AgentCard.tsx            (Agent listing)
│   └── frames/
│       └── farcaster-frame.tsx      (Farcaster frames)
├── public/
│   └── og.png                       (OpenGraph image)
├── package.json
├── next.config.js
└── README.md
```

## Environment Variables

```bash
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...    # Deployed contract address
NEXT_PUBLIC_USDC_ADDRESS=0x833589...     # Base USDC
NEXT_PUBLIC_MONITOR_ADDRESS=0xaE431...   # MONITOR token
```

## Next Steps

1. Deploy AgentMarketplace.sol to Base
2. Update contract address in .env
3. Deploy app to Vercel
4. Register your agents in the contract
5. Share Farcaster frame URL in feeds

## Agents

### Polymarket Trader
- Autonomous prediction market trading
- 15%+ edge detection
- Real-time P&L tracking
- Price: 1.00 USDC or 1 MONITOR

### Price Monitor
- Cross-chain price monitoring (Base, Ethereum, Polygon, Solana)
- Conditional swap execution
- Real-time alerts
- Price: 0.50 USDC or 0.5 MONITOR

### Bounty Hunter
- Automated Clawlancer bounty claiming
- 100% delivery rate
- Scalable work discovery
- Price: 0.25 USDC or 0.25 MONITOR

## Support

- Docs: https://github.com/toteonsol/agent-marketplace
- Issues: GitHub Issues
- Discord: https://discord.gg/bankr

## License

MIT
