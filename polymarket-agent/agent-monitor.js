#!/usr/bin/env node

/**
 * AGENT MONITOR — Verify all agents are running correctly
 * 
 * Checks:
 * 1. Polymarket agent (agent-v2.js) — Runs every 2 hours
 * 2. Clawlancer bounty hunter — Runs every 30 minutes
 * 3. Bankr price monitor — Runs every 6 hours (if enabled)
 * 
 * Alerts if:
 * - Wrong script is running (e.g., Manifold instead of Polymarket)
 * - Agent hasn't run recently (missed scheduled runs)
 * - Data file is stale (not being updated)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/home/openclaw/.openclaw/workspace';
const AGENT_DIR = path.join(WORKSPACE, 'polymarket-agent');

// Configuration
const AGENTS = {
  polymarket: {
    name: 'Polymarket Agent (agent-v2.js)',
    script: 'agent-v2.js',
    interval: 2 * 60 * 60 * 1000, // 2 hours
    logFile: path.join(AGENT_DIR, 'agent.log'),
    dataFile: path.join(AGENT_DIR, 'agent-data.json'),
    expectedInLog: ['Polymarket Agent', 'Market search', 'bankroll']
  },
  clawlancer: {
    name: 'Clawlancer Bounty Hunter',
    script: 'clawlancer-bounty-hunter-v2.js',
    interval: 30 * 60 * 1000, // 30 minutes
    logFile: path.join(AGENT_DIR, 'clawlancer.log'),
    dataFile: path.join(AGENT_DIR, 'clawlancer.log'),
    expectedInLog: ['Bounty Hunt', 'Found', 'bounties']
  }
};

const ALERT_THRESHOLD = {
  polymarket: 3 * 60 * 60 * 1000, // 3 hours (1 hour grace)
  clawlancer: 45 * 60 * 1000 // 45 minutes (15 min grace)
};

function getLastLogEntry(logFile) {
  try {
    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const lastLine = lines[lines.length - 1];
    
    // Extract timestamp from log line (format: [2026-02-27T12:43:14.818Z])
    const match = lastLine.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    if (match) {
      return new Date(match[1]);
    }
    return null;
  } catch (err) {
    return null;
  }
}

function checkCronJob(script) {
  try {
    const crontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
    
    // Check if the correct script is in crontab
    if (crontab.includes(script)) {
      return { correct: true, found: true };
    }
    
    // Check if wrong Manifold script is running instead
    if (script === 'agent-v2.js' && crontab.includes('agent-manifold.js')) {
      return { correct: false, found: true, error: 'WRONG SCRIPT: agent-manifold.js instead of agent-v2.js' };
    }
    
    return { correct: false, found: false, error: `Script not found in crontab` };
  } catch (err) {
    return { correct: false, found: false, error: `Crontab error: ${err.message}` };
  }
}

function checkAgentHealth(agentKey) {
  const agent = AGENTS[agentKey];
  const now = Date.now();
  
  const alerts = [];
  const stats = {
    name: agent.name,
    script: agent.script,
    status: '✅ HEALTHY'
  };
  
  // 1. Check cron job is correct
  const cronCheck = checkCronJob(agent.script);
  if (!cronCheck.correct) {
    alerts.push(`❌ CRON ERROR: ${cronCheck.error}`);
    stats.status = '❌ CRITICAL';
  }
  
  // 2. Check log file exists and is recent
  const lastRun = getLastLogEntry(agent.logFile);
  if (!lastRun) {
    alerts.push(`⚠️  No log entries found`);
  } else {
    const timeSinceRun = now - lastRun.getTime();
    const threshold = ALERT_THRESHOLD[agentKey];
    
    if (timeSinceRun > threshold) {
      alerts.push(`⚠️  Agent hasn't run in ${Math.round(timeSinceRun / 1000 / 60)} minutes (threshold: ${Math.round(threshold / 1000 / 60)} min)`);
      stats.status = '⚠️  STALE';
    }
    
    stats.lastRun = lastRun.toISOString();
    stats.minutesSinceRun = Math.round(timeSinceRun / 1000 / 60);
  }
  
  // 3. Check data file is being updated
  try {
    const stats_data = JSON.parse(fs.readFileSync(agent.dataFile, 'utf-8'));
    if (stats_data.lastUpdate) {
      const dataAge = now - new Date(stats_data.lastUpdate).getTime();
      if (dataAge > threshold) {
        alerts.push(`⚠️  Data file stale (${Math.round(dataAge / 1000 / 60)} min old)`);
      }
      stats.lastDataUpdate = stats_data.lastUpdate;
    }
  } catch (err) {
    // Data file may not exist for all agents
  }
  
  return { alerts, stats };
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 AGENT MONITORING REPORT');
  console.log('='.repeat(80));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('');
  
  let hasIssues = false;
  const report = [];
  
  Object.keys(AGENTS).forEach(agentKey => {
    const { alerts, stats } = checkAgentHealth(agentKey);
    
    console.log(`${stats.status} ${stats.name}`);
    console.log(`   Script: ${stats.script}`);
    console.log(`   Last Run: ${stats.lastRun || 'NEVER'}`);
    if (stats.minutesSinceRun !== undefined) {
      console.log(`   Minutes Since Run: ${stats.minutesSinceRun}`);
    }
    
    if (alerts.length > 0) {
      hasIssues = true;
      alerts.forEach(alert => {
        console.log(`   ${alert}`);
      });
    }
    
    console.log('');
    report.push({ agent: agentKey, ...stats, alerts });
  });
  
  // Summary
  console.log('='.repeat(80));
  if (hasIssues) {
    console.log('⚠️  ISSUES DETECTED — Review alerts above');
  } else {
    console.log('✅ ALL AGENTS HEALTHY');
  }
  console.log('='.repeat(80) + '\n');
  
  return report;
}

// Export for use in other scripts
module.exports = {
  checkAgentHealth,
  generateReport,
  AGENTS
};

// Run if called directly
if (require.main === module) {
  generateReport();
}
