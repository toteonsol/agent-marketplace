#!/usr/bin/env node

/**
 * Bankr Price Monitor - Example Configurations
 * Copy & modify these to set up your own monitoring strategies
 */

const BANKR_API_KEY = process.env.BANKR_API_KEY;
const API_BASE = 'https://api.bankr.bot';

// ============================================================================
// EXAMPLE 1: Simple Buy-on-Dip Strategy
// ============================================================================

const example1_buy_on_dip = {
  name: "ETH Dip Buyer",
  description: "Buy $2 of ETH whenever price dips below $2800",
  
  monitor: {
    token: "ETH",
    chain: "base",
    frequency: "5m"
  },
  
  trigger: {
    condition: "price < 2800",
    action: "buy",
    amount: "$2",
    description: "Buy on dip"
  },
  
  exit: {
    stop_loss: "-10%",
    take_profit: "+20%"
  }
};

// ============================================================================
// EXAMPLE 2: Multi-Token DCA (Dollar-Cost Averaging)
// ============================================================================

const example2_multi_token_dca = {
  name: "Crypto DCA Portfolio",
  description: "Buy equal amounts of 3 tokens every 6 hours (set-it-and-forget-it)",
  
  monitors: [
    {
      token: "ETH",
      chain: "base",
      frequency: "6h"
    },
    {
      token: "SOL",
      chain: "solana",
      frequency: "6h"
    },
    {
      token: "BTC",
      chain: "ethereum",
      frequency: "6h"
    }
  ],
  
  triggers: [
    {
      token: "ETH",
      condition: "time % 6h == 0",  // Every 6 hours
      action: "buy",
      amount: "$1"
    },
    {
      token: "SOL",
      condition: "time % 6h == 0",
      action: "buy",
      amount: "$1"
    },
    {
      token: "BTC",
      condition: "time % 6h == 0",
      action: "buy",
      amount: "$1"
    }
  ],
  
  notes: "Low-effort, high-discipline strategy. Good for beginners with limited capital."
};

// ============================================================================
// EXAMPLE 3: Range Trading (Buy Low, Sell High)
// ============================================================================

const example3_range_trader = {
  name: "SOL Range Trader",
  description: "Buy SOL at support ($140), sell at resistance ($160)",
  
  monitor: {
    token: "SOL",
    chain: "solana",
    frequency: "5m"
  },
  
  triggers: [
    {
      name: "Buy at support",
      condition: "price < 140",
      action: "buy",
      amount: "$1.50",
      notes: "Accumulate at bottom"
    },
    {
      name: "Sell at resistance",
      condition: "price > 160",
      action: "sell",
      amount: "50%",
      notes: "Take profits at top"
    }
  ],
  
  position_management: {
    max_accumulation: "3 SOL",
    reenter_after_sell: true,
    stop_loss: "-15% from avg_entry"
  },
  
  notes: "Effective in sideways markets. Avoid during strong trends."
};

// ============================================================================
// EXAMPLE 4: Arbitrage Opportunity Hunter
// ============================================================================

const example4_arbitrage = {
  name: "Cross-Chain Arbitrage",
  description: "Buy USDC on Base when cheaper, sell on Ethereum",
  
  monitors: [
    {
      token: "USDC",
      chain: "base",
      frequency: "5m"
    },
    {
      token: "USDC",
      chain: "ethereum",
      frequency: "5m"
    }
  ],
  
  trigger: {
    condition: "base_price < ethereum_price * 0.995",  // 0.5% cheaper on Base
    action: "arb_buy_sell",
    steps: [
      {
        step: 1,
        action: "buy",
        token: "USDC",
        chain: "base",
        amount: "$5"
      },
      {
        step: 2,
        action: "bridge",
        from: "base",
        to: "ethereum"
      },
      {
        step: 3,
        action: "sell",
        token: "USDC",
        chain: "ethereum",
        expected_profit: ">0.5%"
      }
    ]
  },
  
  notes: "Complex but high-probability. Requires price sync across chains."
};

// ============================================================================
// EXAMPLE 5: Trend-Following (Momentum Strategy)
// ============================================================================

const example5_trend_follower = {
  name: "BTC Trend Follower",
  description: "Buy when price breaks above 24h high, sell on moving-avg breakdown",
  
  monitor: {
    token: "BTC",
    chain: "ethereum",
    frequency: "1h",
    analytics: {
      calculate: ["sma_20", "high_24h", "low_24h"]
    }
  },
  
  triggers: [
    {
      name: "Buy breakout",
      condition: "price > high_24h",
      action: "buy",
      amount: "$3",
      notes: "Enter on bullish breakout"
    },
    {
      name: "Sell breakdown",
      condition: "price < sma_20",
      action: "sell",
      amount: "100%",
      notes: "Exit on trend reversal"
    }
  ],
  
  notes: "Works best in trending markets. Skip in choppy/sideways action."
};

// ============================================================================
// EXAMPLE 6: Mean Reversion (Contrarian)
// ============================================================================

const example6_mean_reversion = {
  name: "Pump & Dump Fade",
  description: "Buy after 10%+ pumps (mean-revert), sell after dumps",
  
  monitor: {
    token: "USDC",  // Stable token to pair with volatility
    chain: "base",
    frequency: "15m",
    analytics: {
      calculate: ["volatility_24h", "price_changes"]
    }
  },
  
  trigger: {
    condition: "volatility > 10%",
    action: "conditional",
    options: [
      {
        if: "price_up_10%_from_avg",
        then: "sell",
        reasoning: "Overbought, expect reversion down"
      },
      {
        if: "price_down_10%_from_avg",
        then: "buy",
        reasoning: "Oversold, expect bounce back up"
      }
    ]
  },
  
  notes: "Counterintuitive but effective. Requires emotional discipline."
};

// ============================================================================
// EXAMPLE 7: Micro-Cap Moonshot (High-Risk, High-Reward)
// ============================================================================

const example7_moonshot = {
  name: "New Token Spotter",
  description: "Monitor new Base tokens for early 10x opportunities",
  
  monitor: {
    token: "any_new",
    chain: "base",
    filters: {
      age: "< 48h",           // Token deployed recently
      volume: "> $10k",       // Has some activity
      liquidity: "> $50k"     // Not zero-liquidity rug
    },
    frequency: "15m"
  },
  
  trigger: {
    condition: "community_sentiment_bullish AND technical_setup_ready",
    action: "buy",
    amount: "$0.50",
    max_exposure: "$2 total"  // Risk control for moonshots
  },
  
  exit: {
    stop_loss: "-50%",        // Higher risk tolerance
    take_profit: "+300%"      // Chase big wins
  },
  
  notes: "High risk / high reward. Only use spare capital you can afford to lose."
};

// ============================================================================
// EXAMPLE 8: Stablecoin Yield Farming (Low-Risk)
// ============================================================================

const example8_stablecoin_farming = {
  name: "USDC Yield Farming",
  description: "Lock USDC in yield farms, compound returns weekly",
  
  strategy: {
    token: "USDC",
    chain: "base",
    action: "yield_farming",
    
    steps: [
      {
        week: "Every Friday",
        action: "collect_yield",
        reinvest: true,
        description: "Auto-compound yields"
      }
    ]
  },
  
  expected_yield: "15-25% APY",
  risk: "Low (stablecoin denominated)",
  
  notes: "Boring but steady. Great for build capital slowly."
};

// ============================================================================
// HELPER: How to Use These Examples
// ============================================================================

function deploy_example(example_config) {
  console.log(`Deploying: ${example_config.name}`);
  console.log(`Description: ${example_config.description}`);
  
  // In production, this would:
  // 1. Validate configuration
  // 2. Create monitors on API
  // 3. Set triggers
  // 4. Start polling
  
  console.log("\nConfiguration:");
  console.log(JSON.stringify(example_config, null, 2));
}

// ============================================================================
// Export all examples
// ============================================================================

module.exports = {
  example1_buy_on_dip,
  example2_multi_token_dca,
  example3_range_trader,
  example4_arbitrage,
  example5_trend_follower,
  example6_mean_reversion,
  example7_moonshot,
  example8_stablecoin_farming,
  deploy_example
};

// ============================================================================
// Quick Start: Run one example
// ============================================================================

if (require.main === module) {
  console.log("=".repeat(70));
  console.log("BANKR PRICE MONITOR - EXAMPLE STRATEGIES");
  console.log("=".repeat(70));
  console.log("\nAvailable examples:");
  console.log("1. Buy on Dip (Simple)");
  console.log("2. Multi-Token DCA (Beginner-Friendly)");
  console.log("3. Range Trading (Intermediate)");
  console.log("4. Cross-Chain Arbitrage (Advanced)");
  console.log("5. Trend Following (Intermediate)");
  console.log("6. Mean Reversion (Advanced)");
  console.log("7. Moonshot Hunter (High-Risk)");
  console.log("8. Stablecoin Yield (Low-Risk)");
  console.log("\nCopy any example above and customize for your strategy.");
}
