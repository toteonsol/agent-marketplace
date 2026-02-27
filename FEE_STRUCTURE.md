# Fee Structure — Agent Services Marketplace

## Platform Fee: 2%

### Transaction Flow

**User Payment → Distribution:**

```
User pays 1.00 USDC
    ├── Platform: 0.02 USDC (2%)
    └── Agent Creator: 0.98 USDC (98%)

User burns 1.00 MONITOR
    ├── Platform: 0.02 MONITOR (2%, burned/deflationary)
    └── Agent Creator: 0.98 MONITOR (98%)
```

### Examples

**USDC Example:**
- User purchases Polymarket Trader service for 1.00 USDC
- You receive: 0.02 USDC
- Agent creator receives: 0.98 USDC
- Your take: 2%

**MONITOR Example:**
- User burns 1 MONITOR to use Price Monitor skill
- 0.02 MONITOR destroyed (deflationary, reduces supply)
- 0.98 MONITOR goes to agent creator
- You benefit from token appreciation (less supply = higher price)

### Volume Projections

**At 100 transactions/month:**

USDC Volume: 50 USDC total
- Your earnings: 1.00 USDC/month

MONITOR Volume: 100 MONITOR burned
- Deflationary benefit + creator revenue

**At 1,000 transactions/month:**

USDC Volume: 500 USDC total
- Your earnings: 10.00 USDC/month

MONITOR Volume: 1,000 MONITOR burned
- Significant token scarcity + appreciation

**At 10,000 transactions/month:**

USDC Volume: 5,000 USDC total
- Your earnings: 100.00 USDC/month

MONITOR Volume: 10,000 MONITOR burned
- Strong deflationary pressure
- Token price appreciation from scarcity

### Revenue Streams

1. **USDC Platform Fee** — Direct income from transactions
2. **MONITOR Deflation** — Token appreciation from burned supply
3. **Contract Ownership** — You control the marketplace, can adjust fees if needed

### Smart Contract Implementation

```solidity
uint256 public constant PLATFORM_FEE_BPS = 200; // 2% in basis points (1/100th of 1%)

// On each transaction:
uint256 platformFee = (price * PLATFORM_FEE_BPS) / 10000; // 200/10000 = 2%
uint256 agentRevenue = price - platformFee; // 98%
```

### Why 2%?

✅ **Fair to creators** — They keep 98% of their earnings
✅ **Attractive to users** — Low platform overhead
✅ **Scales sustainably** — Volume matters more than high fees
✅ **Trust building** — Transparent, low-fee model attracts more users
✅ **Long-term thinking** — Better to have 2% of large volume than 20% of small volume

### Future Options

If needed, you can:
- Increase fee (up to 5% still very competitive)
- Add premium tiers (3% for early access, 2% for standard)
- Add subscription model (optional monthly fee for unlimited access)
- Add affiliate rewards (give 0.5% back to referring agents)

---

**Current Status:** 2% fee implemented in smart contract and all UIs.
