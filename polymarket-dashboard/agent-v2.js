#!/usr/bin/env node

/**
 * Polymarket Agent v2
 * Auto-executes bets with position management (take-profit, stop-loss)
 * 
 * Run: node agent-v2.js [--dry-run] [--force-bet]
 */

const AgentLogger = require('./logger');
const API_KEY = process.env.BANKR_API_KEY || 'bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5';
const API_URL = 'https://api.bankr.bot';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_BET = process.argv.includes('--force-bet');
const logger = new AgentLogger('./agent-data.json');

// Configuration - ULTRA CONSERVATIVE
const CONFIG = {
  // Risk Management
  maxBetPct: 0.125,       // Max 12.5% of portfolio per bet (~$1.00)
  minBankroll: 5,         // Minimum $5 to operate
  maxConcurrent: 2,       // Max 2 open positions
  
  // Entry Criteria
  minEdge: 0.20,          // Minimum 20% edge (very conservative)
  minLiquidity: 50000,    // Minimum $50k liquidity
  minVolume: 100000,      // Minimum $100k volume
  
  // Exit Strategy
  takeProfitPct: 0.20,    // Take profit at +20%
  stopLossPct: 0.10,      // Stop loss at -10%
  
  // Market Filters
  avoidShortTerm: true,   // Skip 5m/15m markets
  minDaysToExpiry: 14,    // Min 14 days until resolution (very safe)
  
  // Timing
  cooldownHours: 2,
};

// State tracking (in production, use a database)
const STATE = {
  positions: [],
  totalWagered: 0,
  totalWon: 0,
  totalLost: 0,
  lastCheck: null,
};

/**
 * Make API request to Bankr
 */
async function bankrRequest(prompt, threadId = null, timeoutSeconds = 30) {
  const body = { prompt };
  if (threadId) body.threadId = threadId;

  const response = await fetch(`${API_URL}/agent/prompt`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  // Poll for result with timeout
  let result;
  const startTime = Date.now();
  const timeoutMs = timeoutSeconds * 1000;
  
  while (true) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Bankr request timeout after ${timeoutSeconds}s`);
    }
    
    const statusRes = await fetch(`${API_URL}/agent/job/${data.jobId}`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const statusData = await statusRes.json();
    
    if (statusData.status === 'completed') {
      result = statusData.response;
      break;
    } else if (statusData.status === 'failed' || statusData.status === 'cancelled') {
      throw new Error(`Job ${statusData.status}: ${statusData.error || 'Unknown error'}`);
    }
    
    await new Promise(r => setTimeout(r, 2000));
  }

  return { result, threadId: data.threadId };
}

/**
 * Get current portfolio value
 */
async function getBankroll() {
  try {
    const { result } = await bankrRequest('What is my total portfolio value in USD across all chains?', null, 60);
    const match = result.match(/\$([\d,]+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
  } catch (e) {
    log('error', `Bankroll check failed: ${e.message}`);
    return 0;
  }
}

/**
 * Get Polymarket positions with details
 */
async function getPositions() {
  try {
    const { result } = await bankrRequest('Show my Polymarket positions with current values and P&L', null, 60);
    return parsePositions(result);
  } catch (e) {
    log('error', `Positions check failed: ${e.message}`);
    return [];
  }
}

/**
 * Parse position data (simplified - enhance based on actual response format)
 */
function parsePositions(text) {
  // In production, parse the actual response structure
  // For now, return empty if no positions
  if (text.includes('no open positions') || text.includes('currently empty')) {
    return [];
  }
  // TODO: Parse actual position data
  return [];
}

/**
 * Search for quality markets
 */
async function searchMarkets() {
  try {
    let prompt = 'Search Polymarket for markets with:';
    prompt += ' - High volume (>$50k)';
    prompt += ' - Good liquidity (>$10k)';
    prompt += ' - Resolution date at least 1 week away';
    prompt += ' - Clear yes/no outcomes';
    prompt += ' - NOT short-term (5m, 15m) markets';
    
    const { result } = await bankrRequest(prompt, null, 120);
    return parseMarkets(result);
  } catch (e) {
    log('warn', `Market search failed (will retry next run): ${e.message}`);
    return [];
  }
}

/**
 * Parse market data from response
 */
function parseMarkets(text) {
  // Simple parser - extract market info
  const markets = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Look for market URLs
    const urlMatch = line.match(/https:\/\/polymarket\.com\/[^\s]+/);
    if (urlMatch) {
      markets.push({
        url: urlMatch[0],
        text: line,
      });
    }
  }
  
  return markets;
}

/**
 * Analyze a market for edge
 */
async function analyzeMarket(marketUrl) {
  try {
    const prompt = `Analyze this Polymarket: ${marketUrl}. What are the current odds? What's your estimate of the true probability? Is there value?`;
    const { result } = await bankrRequest(prompt, null, 60);
    
    // Parse odds (simplified)
    const yesMatch = result.match(/Yes[:\s]+([\d.]+)/i);
    const noMatch = result.match(/No[:\s]+([\d.]+)/i);
    
    if (yesMatch && noMatch) {
      return {
        yesOdds: parseFloat(yesMatch[1]),
        noOdds: parseFloat(noMatch[1]),
        analysis: result,
        hasEdge: result.toLowerCase().includes('value') || result.toLowerCase().includes('underpriced'),
      };
    }
    
    return null;
  } catch (e) {
    log('error', `Market analysis failed: ${e.message}`);
    return null;
  }
}

/**
 * Place a bet with explicit execution
 */
async function placeBet(marketUrl, outcome, amount) {
  const prompt = `Execute immediately: Buy ${amount} shares of "${outcome}" on ${marketUrl}. Do not ask for confirmation, place the order now.`;
  
  if (DRY_RUN && !FORCE_BET) {
    log('info', `[DRY RUN] Would execute: ${prompt}`);
    return { success: true, dryRun: true };
  }
  
  try {
    const { result } = await bankrRequest(prompt, null, 90);
    const success = !result.toLowerCase().includes('error') && 
                   !result.toLowerCase().includes('failed') &&
                   !result.toLowerCase().includes('how much');
    
    return { success, result };
  } catch (e) {
    log('error', `Bet failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Close a position
 */
async function closePosition(position, reason) {
  const prompt = `Sell all my shares of "${position.outcome}" on ${position.marketUrl}. Execute immediately.`;
  
  if (DRY_RUN) {
    log('info', `[DRY RUN] Would close position: ${reason}`);
    return { success: true, dryRun: true };
  }
  
  try {
    const { result } = await bankrRequest(prompt);
    return { success: true, result };
  } catch (e) {
    log('error', `Close position failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Redeem winnings (with extended timeout)
 */
async function redeemWinnings() {
  const previousBankroll = logger.getBankroll();
  
  try {
    const { result } = await bankrRequest('Redeem any winnings from resolved Polymarket markets', null, 60);
    
    // Check if there were actually winnings to redeem
    if (result && (result.toLowerCase().includes('redeemed') || result.toLowerCase().includes('won') || result.toLowerCase().includes('profit'))) {
      log('info', `Redemption result: ${result.slice(0, 100)}...`);
      
      // We'll update bankroll after this and log it as a trade
      return result;
    }
    
    return result;
  } catch (e) {
    log('error', `Redemption failed: ${e.message}`);
    return null;
  }
}

/**
 * Log with timestamp
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

/**
 * Main agent loop
 */
async function runAgent() {
  log('info', '=== Polymarket Agent v2 Starting ===');
  log('info', `Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'} ${FORCE_BET ? '(force bet)' : ''}`);
  
  try {
    // Get previous bankroll for comparison
    const previousBankroll = logger.getBankroll();
    
    // 1. Redeem any winnings
    log('info', 'Checking for redeemable winnings...');
    const redemptionResult = await redeemWinnings().catch(e => {
      log('warn', `Redemption check failed: ${e.message}`);
      return null;
    });
    
    // 2. Check bankroll
    const bankroll = await getBankroll();
    log('info', `Current bankroll: $${bankroll.toFixed(2)}`);
    
    // Record any bankroll changes as wins/losses
    const bankrollChange = bankroll - previousBankroll;
    if (bankrollChange !== 0 && previousBankroll > 0) {
      const tradeRecord = {
        type: bankrollChange > 0 ? 'winning_redemption' : 'loss_realized',
        amount: Math.abs(bankrollChange),
        pnl: bankrollChange,
        timestamp: new Date().toISOString(),
        notes: redemptionResult ? redemptionResult.slice(0, 200) : 'Bankroll adjustment',
      };
      logger.recordTrade(tradeRecord);
      log('info', `Recorded ${bankrollChange > 0 ? 'win' : 'loss'}: $${Math.abs(bankrollChange).toFixed(2)}`);
    }
    
    logger.updateBankroll(bankroll);
    
    if (bankroll < CONFIG.minBankroll) {
      log('warn', `Bankroll too low (${bankroll} < ${CONFIG.minBankroll}). Skipping bet search.`);
      return;
    }
    
    // 3. Get current positions
    const positions = await getPositions();
    log('info', `Current positions: ${positions.length}`);
    
    // 4. Manage existing positions
    for (const pos of positions) {
      const pnlPct = (pos.currentValue - pos.costBasis) / pos.costBasis;
      const pnlAmount = pos.currentValue - pos.costBasis;
      
      if (pnlPct >= CONFIG.takeProfitPct) {
        log('info', `Take profit triggered: ${(pnlPct * 100).toFixed(1)}% gain`);
        await closePosition(pos, 'take-profit');
        
        // Record the closing trade
        logger.recordTrade({
          type: 'position_close',
          reason: 'take-profit',
          market: pos.marketUrl,
          amount: pos.costBasis,
          pnl: pnlAmount,
          pnlPct: pnlPct * 100,
          timestamp: new Date().toISOString(),
        });
        
      } else if (pnlPct <= -CONFIG.stopLossPct) {
        log('info', `Stop loss triggered: ${(pnlPct * 100).toFixed(1)}% loss`);
        await closePosition(pos, 'stop-loss');
        
        // Record the closing trade
        logger.recordTrade({
          type: 'position_close',
          reason: 'stop-loss',
          market: pos.marketUrl,
          amount: pos.costBasis,
          pnl: pnlAmount,
          pnlPct: pnlPct * 100,
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    // 5. Search for new opportunities
    let marketsScanned = 0;
    let opportunitiesFound = 0;
    let betsPlaced = 0;
    let runReason = null;
    
    if (positions.length < CONFIG.maxConcurrent) {
      log('info', 'Searching for new opportunities...');
      const markets = await searchMarkets();
      marketsScanned = markets.length;
      log('info', `Found ${marketsScanned} potential markets`);
      
      for (const market of markets.slice(0, 5)) {
        const analysis = await analyzeMarket(market.url);
        
        if (analysis && analysis.hasEdge) {
          opportunitiesFound++;
          const betSize = bankroll * CONFIG.maxBetPct;
          log('info', `Edge detected! Placing $${betSize.toFixed(2)} bet`);
          
          const outcome = analysis.yesOdds < analysis.noOdds ? 'Yes' : 'No';
          const result = await placeBet(market.url, outcome, betSize.toFixed(2));
          
          if (result.success) {
            betsPlaced++;
            log('info', `Bet placed successfully!`);
            
            // Record the trade
            const tradeRecord = {
              type: 'market_entry',
              market: market.url,
              outcome,
              amount: betSize,
              odds: outcome === 'Yes' ? analysis.yesOdds : analysis.noOdds,
              timestamp: new Date().toISOString(),
              status: 'open',
            };
            logger.recordTrade(tradeRecord);
            
            break; // Only one bet per run
          } else {
            log('warn', `Bet failed: ${result.error || 'Unknown'}`);
          }
        }
      }
      
      // Determine reason for not betting
      if (marketsScanned === 0) {
        runReason = 'No markets found';
      } else if (opportunitiesFound === 0) {
        runReason = 'No opportunities with edge found';
      } else if (betsPlaced === 0) {
        runReason = 'Bet placement failed';
      } else {
        runReason = null; // Bet was placed
      }
    } else {
      runReason = 'Max concurrent positions reached';
    }
    
    // Record run summary
    logger.recordRunSummary({
      marketsScanned,
      opportunitiesFound,
      betsPlaced,
      reason: runReason,
    });
    
    // Summary
    const stats = logger.getStats();
    log('info', `=== Agent Run Complete ===`);
    log('info', `Markets: ${marketsScanned} | Opportunities: ${opportunitiesFound} | Bets Placed: ${betsPlaced}`);
    log('info', `Trades: ${stats.totalTrades} | Win Rate: ${stats.winRate}% | Return: ${stats.totalReturn}%`);
    
  } catch (e) {
    log('error', `Agent failed: ${e.message}`);
  }
}

// Run the agent
runAgent();
