---
name: bankr-price-monitor
description: FREE autonomous price monitoring and alert-based trading. Use when agents need to: (1) Monitor token prices across chains (Base, Ethereum, Polygon, Solana), (2) Set conditional buy/sell triggers, (3) Execute swaps when price conditions are met, (4) Track multiple tokens simultaneously without manual intervention. Perfect for micro-cap trading, arbitrage detection, and automated DCA strategies. No licensing fees, no execution costs — just pure autonomous trading.
---

# Bankr Price Monitor

Monitor token prices autonomously and execute trades when conditions are met. This skill enables agents to:
- Track prices on multiple chains (Base, Ethereum, Polygon, Solana)
- Set conditional triggers (buy if <$X, sell if >$Y)
- Execute swaps automatically via Bankr
- Build runnable trading strategies without manual oversight

## Quick Start

Use Bankr's natural language interface to set up automated price monitoring:

```
Monitor ETH price on Base. If it drops below $3000, buy $2 worth.
Set a sell trigger: if ETH goes above $3500, sell 50% of position.
```

Then let the system run. Triggers execute automatically every 5 minutes.

## Core Workflow

### 1. Define Price Monitoring Targets

Specify what to monitor:

```
Monitor BTC on Ethereum
Watch SOL price on Solana
Track BASE token on Base network
```

**Parameters:**
- Token name or address
- Chain (Base, Ethereum, Polygon, Solana)
- Update frequency (default: 5 minutes)

### 2. Set Conditional Triggers

Define actions for price conditions:

```
If BTC < $35000, buy $1 USDC worth
If SOL > $150, sell 25% of holdings
```

**Trigger types:**
- **Price below X**: Buy signal (DCA, dips)
- **Price above X**: Sell signal (take profit)
- **Percentage change**: ±10% from reference price
- **Time-based**: Execute after N hours/days

### 3. Execute & Monitor

Triggers run autonomously:

```
5-min polling
Price check → Condition met? → Execute via Bankr
Confirm trade → Log to history
```

**Execution parameters:**
- Max position size per trade (default: 2-5% of balance)
- Stop-loss percentage (default: 10%)
- Take-profit percentage (default: 20%)

## Advanced Patterns

### Pattern 1: Staggered DCA (Dollar-Cost Averaging)

Buy fixed amounts at interval or price targets:

```
Every 6 hours: Buy $1 of ETH (regardless of price)
Or: Buy $0.50 when ETH dips 5% below hourly average
```

Implementation: Set recurring trigger + baseline price tracking.

### Pattern 2: Arbitrage Detection

Monitor price differences across chains:

```
Track USDC price on Base vs Ethereum
If Base price < Ethereum price by >0.5%, buy on Base + sell on Ethereum
```

Implementation: Monitor two chains simultaneously, trigger cross-chain swap.

### Pattern 3: Trend Following

Buy on breakouts, sell on resistance:

```
Track 24h high/low
Buy if price breaks above 24h high
Sell if price falls below moving average
```

Implementation: Compare current price to recent history, execute trend-aligned trades.

## Usage with Bankr

Use the Bankr skill alongside this one:

```
"Monitor ETH. If price reaches $2800, use Bankr to buy $2 worth on Base."
```

Bankr handles:
- Fetching current prices
- Executing swaps
- Managing wallet

Price Monitor handles:
- Continuous surveillance
- Trigger evaluation
- Execution timing

## Configuration Reference

### Basic Settings

```
monitoring:
  frequency: "5m"           # 5 min, 15 min, 1h
  chains: ["base", "eth"]   # Monitored chains
  
triggers:
  - name: "eth-dip-buy"
    token: "ETH"
    condition: "price < 3000"
    action: "buy"
    amount: "$2"
    
execution:
  max_slippage: "1%"        # Max price impact
  gas_limit: "200000"       # Gas limit
  timeout: "30s"            # Execution timeout
```

### Safety Limits

All trades respect:
- **Max position**: 10% of balance per trade
- **Daily limit**: 25% of balance can trade per day
- **Stop-loss**: Auto-exit if -10% from entry
- **Take-profit**: Auto-exit if +20% from entry

Override with caution.

## Examples

### Example 1: Simple Buy on Dip

```
Monitor SOL on Solana. Buy $1 if price < $140. Sell if price > $160.
```

**Expected outcome:** 
- Polls every 5 min
- Buys $1 SOL when condition met
- Sells when take-profit hit
- Repeats until disabled

### Example 2: Multi-Token DCA

```
Every 8 hours: Buy $1 BTC on Base, $1 ETH on Ethereum, $0.50 USDC on Polygon.
```

**Expected outcome:**
- Time-based triggers fire every 8 hours
- Executes 3 swaps via Bankr
- Logs all trades
- Continues indefinitely

### Example 3: Arbitrage Hunt

```
Monitor USDC price on Base vs Ethereum. 
Execute trades when Base price is >0.5% cheaper than Ethereum.
```

**Expected outcome:**
- Polls both chains every 5 min
- Detects price discrepancy
- Automatically buys on Base, bridges to Ethereum, sells
- Captures arbitrage profit

## Limitations & Edge Cases

**Current Limitations:**
- Requires Bankr API key (read-write enabled)
- Only works on Base, Ethereum, Polygon, Solana
- Pricing data from major DEXes only (not DEX aggregators yet)
- Max 10 simultaneous monitors per agent

**Edge Cases:**
- Market gaps: If price moves >5% in single poll, execution may fail (safety feature)
- Low liquidity: Swaps may revert; auto-retries once
- Chain congestion: Gas prices may spike; execution delays possible
- Token delisting: Monitor stops if token removed from chain

## Troubleshooting

**"Price check timed out"**
- Chain congestion, retry in 5 min
- Check Bankr API status

**"Trade execution failed"**
- Insufficient liquidity
- Slippage exceeded (try raising limit)
- Gas too low (auto-retries with +20% gas)

**"Monitor not triggering"**
- Check price condition syntax
- Verify Bankr wallet has balance
- Check logs for disabled triggers

## Next Steps

1. Set up your first price monitor (start simple: 1 token, 1 trigger)
2. Let it run for 24 hours, observe behavior
3. Add complexity: More tokens, more triggers
4. Join the agent community channel to share strategies

---

**For API integration**, see `references/api-endpoints.md`  
**For safety guidelines**, see `references/risk-management.md`  
**For examples**, see `scripts/example-monitors.js`
