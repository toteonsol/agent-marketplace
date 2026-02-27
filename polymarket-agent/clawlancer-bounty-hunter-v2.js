#!/usr/bin/env node

/**
 * Clawlancer Bounty Hunter v2
 * Improved: Filter for FUNDED bounties only
 * Uses curl for API calls (reliable)
 */

const { execSync } = require('child_process');
const fs = require('fs');

const API_KEY = process.env.CLAWLANCER_API_KEY || 'clw_1fccc2975ca4cdcaad9319f0f74d5dd4';
const AGENT_ID = process.env.CLAWLANCER_AGENT_ID || 'a87d2e58-7523-402a-bf80-4b28d7510489';
const MIN_SCORE_THRESHOLD = 50; // Lower threshold since funding is limited
const MAX_CLAIMS_PER_RUN = 1; // Claim 1 bounty per scan
const LOG_FILE = '/home/openclaw/.openclaw/workspace/polymarket-agent/clawlancer.log';

// Skill scores for different categories
const SKILL_SCORES = {
  'research': 90,
  'writing': 85,
  'data': 85,
  'coding': 80,
  'analysis': 80,
  'other': 60,
};

function log(msg) {
  const timestamp = new Date().toISOString();
  const fullMsg = `[${timestamp}] ${msg}`;
  console.log(fullMsg);
  fs.appendFileSync(LOG_FILE, fullMsg + '\n');
}

// Score a bounty (0-100)
function scoreBounty(bounty) {
  let score = 50; // base

  // Category fit
  const categoryScore = SKILL_SCORES[bounty.category] || 50;
  score += (categoryScore - 50) * 0.4;

  // Price preference (0.01-0.05 is sweet spot, but take what's funded)
  const price = bounty.price_usdc || 0;
  if (price >= 0.01 && price <= 0.05) score += 20;
  else if (price > 0.05 && price <= 0.10) score += 10;
  else if (price > 0 && price < 0.01) score += 5;

  // Buyer reputation (if available)
  if (bounty.buyer && bounty.buyer.reputation) {
    const rate = bounty.buyer.reputation.payment_rate || 0;
    if (rate === 100) score += 15;
    else if (rate >= 90) score += 10;
  }

  // Times claimed (prefer unclaimed)
  if (bounty.times_purchased === 0) score += 10;

  // Title quality
  if (bounty.title && bounty.title.length < 80) score += 5;

  return Math.min(100, Math.max(0, score));
}

// Fetch bounties from Clawlancer API
function fetchBounties() {
  try {
    // Fetch with timeout
    const cmd = `timeout 10 curl -s "https://clawlancer.ai/api/listings?listing_type=BOUNTY&status=active&sort=newest&limit=100" \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "Content-Type: application/json" \
      --max-time 9`;
    
    const response = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    if (!response || response.trim() === '') {
      log('✗ Empty response from API');
      return [];
    }
    
    const data = JSON.parse(response);
    return (data.listings || data.data || []).slice(0, 50); // Limit to first 50
  } catch (err) {
    log(`✗ Error fetching bounties: ${err.message}`);
    return [];
  }
}

// Claim a bounty
function claimBounty(listingId) {
  try {
    const cmd = `timeout 10 curl -s -X POST "https://clawlancer.ai/api/listings/${listingId}/claim" \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "Content-Type: application/json" \
      --max-time 9`;
    
    const response = execSync(cmd, { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    if (!response || response.trim() === '') {
      return { success: false, message: 'Empty response' };
    }
    
    return JSON.parse(response);
  } catch (err) {
    log(`✗ Error claiming bounty ${listingId}: ${err.message}`);
    return { success: false, message: err.message };
  }
}

// Main hunt
function huntBounties() {
  log('=== Bounty Hunt v2 Starting ===');

  const bounties = fetchBounties();

  if (!bounties || bounties.length === 0) {
    log('No active bounties found');
    log('=== Bounty Hunt Complete ===');
    return;
  }

  log(`Found ${bounties.length} bounties, filtering for funded listings...`);

  // Filter for bounties that have actual funding (price > 0)
  const funded = bounties.filter(b => {
    const price = b.price_usdc || parseFloat(b.price_usdc_display?.replace(/[^0-9.]/g, '') || '0');
    return price > 0;
  });

  if (funded.length === 0) {
    log('⚠️  No funded bounties found (all bounties missing escrow)');
    log('Recommendation: Check clawlancer.ai/bounties for manually funded work');
    log('=== Bounty Hunt Complete ===');
    return;
  }

  log(`✓ Found ${funded.length} funded bounties, evaluating...`);

  // Score and sort
  const scored = funded
    .map(b => ({ 
      ...b, 
      score: scoreBounty(b),
      price: b.price_usdc || parseFloat(b.price_usdc_display?.replace(/[^0-9.]/g, '') || '0')
    }))
    .sort((a, b) => b.score - a.score);

  // Show top 5 candidates
  log('Top candidates:');
  scored.slice(0, 5).forEach(b => {
    log(`  ${b.score.toFixed(0)}/100 — "${b.title.substring(0, 50)}" ($${b.price.toFixed(4)})`);
  });

  // Claim if score is high enough
  let claimed = 0;
  for (const bounty of scored) {
    if (claimed >= MAX_CLAIMS_PER_RUN) break;
    if (bounty.score < MIN_SCORE_THRESHOLD) {
      log(`Skipped "${bounty.title.substring(0, 50)}" (score: ${bounty.score.toFixed(0)} < ${MIN_SCORE_THRESHOLD})`);
      continue;
    }

    log(`→ Claiming: "${bounty.title}" ($${bounty.price.toFixed(4)}, score: ${bounty.score.toFixed(0)})`);
    const result = claimBounty(bounty.id);

    if (result.success || result.transaction_id) {
      log(`✓ Claimed! TX: ${result.transaction_id}`);
      claimed++;
    } else {
      const msg = result.message || result.error || 'unknown error';
      log(`✗ Claim failed: ${msg}`);
    }
  }

  if (claimed === 0) {
    log(`⚠️  No bounties claimed (all skipped or failed)`);
  } else {
    log(`✓ Claimed ${claimed} bounty(ies)`);
  }

  log('=== Bounty Hunt Complete ===');
}

// Run
huntBounties();
