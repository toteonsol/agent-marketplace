# Risk Management Guidelines

## Position Sizing

### Rule 1: Max Per-Trade Size
Never trade more than **5% of your balance per trade**.

```
if (trade_amount > balance * 0.05) {
  reject_trade("Exceeds 5% limit");
}
```

### Rule 2: Daily Trading Limit
Max **25% of balance can be at risk per day**.

```
daily_trades_total = sum(all trades in last 24h);
if (daily_trades_total > balance * 0.25) {
  reject_trade("Daily limit reached");
}
```

### Rule 3: Concurrent Positions
Never hold more than **3 simultaneous open positions**.

```
if (open_positions.length >= 3) {
  queue_trigger_until_position_closes();
}
```

## Stop-Loss & Take-Profit

### Mandatory Stop-Loss (Hard Rule)
Every trade has a stop-loss at **-10% from entry**.

```
entry_price = 2850
stop_loss = entry_price * 0.90  // 2565
```

Once hit, position auto-closes. **No exceptions.**

### Recommended Take-Profit
Set take-profit at **+20% from entry** by default.

```
entry_price = 2850
take_profit = entry_price * 1.20  // 3420
```

Agents can lower this to +10-15% for more frequent exits.

## Slippage Protection

### Max Slippage: 1%
Never allow trades with >1% slippage.

```
expected_out = 0.7 ETH
min_acceptable = expected_out * 0.99  // 0.693 ETH
if (actual_out < min_acceptable) {
  revert_trade("Slippage exceeded");
}
```

### MEV Protection
Use private relayers when available (Bankr handles this).

## Volatility Safeguards

### Rule: Skip Trades During High Volatility
If price moves >5% in a single 5-minute poll interval, skip execution.

```
price_change = (current_price - last_price) / last_price;
if (abs(price_change) > 0.05) {
  skip_execution("Volatility spike");
}
```

This prevents executing during flash crashes or pump-and-dumps.

### Blacklist Patterns
Auto-disable monitors if:
- Token price goes to $0 (delisting)
- Liquidity drops >50% (rug pull indicator)
- Trade fails 3x in a row (broken token)

## Balance Safety

### Never Spend Entire Balance
Always keep **minimum 20% in reserve**.

```
usable_balance = balance * 0.80;
if (trade_amount > usable_balance) {
  reject_trade("Insufficient reserve");
}
```

Reserves cover:
- Gas fees (especially on Ethereum)
- Emergency exits
- Unexpected margin requirements

## Spread & Liquidity Checks

### Minimum Liquidity Pool
Only trade on pools with **>$100k liquidity**.

```
if (pool_liquidity < 100000) {
  skip_pool("Insufficient liquidity");
}
```

Smaller pools = higher slippage = worse execution.

### Bid-Ask Spread Check
Abort if spread >2% on USDC pairs, >5% on obscure tokens.

```
spread = (ask - bid) / mid_price;
if (spread > max_spread) {
  abort_trade("Spread too wide");
}
```

## Chain-Specific Safeguards

### Base Network
- Min gas: 21,000 units
- Max gas price: 5 gwei
- Fallback: Polygon if Base congested

### Ethereum Network
- Only for high-value trades (>$100)
- Min gas: 100,000 units
- Max gas price: 50 gwei

### Polygon Network
- Good for small trades ($1-10)
- Fast execution
- Default for testing

### Solana Network
- Mono-token focus (SOL derivatives)
- Min 0.05 SOL for fees
- Account rent: 0.00089 SOL

## Monitoring & Alerts

### Auto-Disable if:
- 5 consecutive failed trades
- Negative P&L >50% in 24h
- Balance drops below $2 (minimum viable)

### Alert When:
- Trade slippage >0.5% (manual review needed)
- Balance below 25% (risk warning)
- Monitor not executed in 12h (possible API issue)

## Testing Phase

Start with **strict mode** for first 7 days:

```
test_mode: {
  max_per_trade: "2%",      // vs normal 5%
  daily_limit: "10%",        // vs normal 25%
  stop_loss: "-5%",          // vs normal -10%
  take_profit: "+10%",       // vs normal +20%
  concurrent_max: 1          // vs normal 3
}
```

After 7 days of zero issues, move to normal limits.

## Incident Response

### If Trade Fails
1. Log the error
2. Retry once (5 min delay)
3. If fails again, disable that trigger
4. Alert agent to manual review

### If Price Crash Detected
1. Pause all new trades
2. Evaluate stop-losses
3. Decide: Auto-exit or hold
4. Resume after confirmation

### If Liquidity Dries Up
1. Check if token is delisted
2. Evaluate if rug pull likely
3. Set emergency sell-all order
4. Disable monitor

## Examples

### Conservative Profile (Small Capital)
```
balance: $10
per_trade: 2% ($0.20)
daily_limit: 10% ($1)
stop_loss: -10% auto
take_profit: +15%
max_slippage: 0.5%
```

### Aggressive Profile (Large Capital)
```
balance: $1000
per_trade: 5% ($50)
daily_limit: 25% ($250)
stop_loss: -5% auto
take_profit: +10%
max_slippage: 1%
```

### Arbitrage Profile (Multi-Chain)
```
balance: $500
per_trade: 3% ($15 per chain)
daily_limit: 20% ($100 total)
concurrent: 5 positions
slippage: 0.2% (tight for arb)
```

Choose your profile based on risk tolerance and capital size.
