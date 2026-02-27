#!/usr/bin/env node

/**
 * Agent Performance Logger
 * Writes trade data to JSON file for dashboard consumption
 */

const fs = require('fs');
const path = require('path');

class AgentLogger {
  constructor(logPath = './agent-data.json') {
    this.logPath = logPath;
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.logPath)) {
        return JSON.parse(fs.readFileSync(this.logPath, 'utf-8'));
      }
    } catch (e) {
      console.error('Failed to load log:', e.message);
    }

    return {
      lastUpdate: new Date().toISOString(),
      bankroll: 0,
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      trades: [],
      equity: [],
      runSummary: {
        marketsScanned: 0,
        opportunitiesFound: 0,
        betsPlaced: 0,
        reason: null,
        lastRunTime: null,
      },
    };
  }

  save() {
    this.data.lastUpdate = new Date().toISOString();
    fs.writeFileSync(this.logPath, JSON.stringify(this.data, null, 2));
  }

  recordTrade(trade) {
    if (!trade.id) trade.id = `trade_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    if (!trade.timestamp) trade.timestamp = new Date().toISOString();

    // Update totals
    if (trade.amount) this.data.totalWagered += trade.amount;
    if (trade.pnl) {
      if (trade.pnl > 0) {
        this.data.totalWon += trade.pnl;
      } else {
        this.data.totalLost += Math.abs(trade.pnl);
      }
    }

    this.data.trades.push(trade);
    this.save();
  }

  updateBankroll(amount) {
    this.data.bankroll = amount;
    this.data.equity.push(amount);
    this.save();
  }

  getBankroll() {
    return this.data.bankroll;
  }

  recordRunSummary(summary) {
    // summary = { marketsScanned, opportunitiesFound, betsPlaced, reason }
    this.data.runSummary = {
      marketsScanned: summary.marketsScanned || 0,
      opportunitiesFound: summary.opportunitiesFound || 0,
      betsPlaced: summary.betsPlaced || 0,
      reason: summary.reason || null,
      lastRunTime: new Date().toISOString(),
    };
    this.save();
  }

  getStats() {
    const trades = this.data.trades;
    const winCount = trades.filter(t => (t.pnl || 0) > 0).length;
    const lossCount = trades.filter(t => (t.pnl || 0) < 0).length;
    const winRate = trades.length > 0 ? (winCount / trades.length * 100).toFixed(1) : 0;
    const totalReturn = trades.length > 0 ? ((this.data.totalWon - this.data.totalLost) / (this.data.totalWagered || 1) * 100).toFixed(1) : 0;

    return {
      totalTrades: trades.length,
      winCount,
      lossCount,
      winRate,
      totalReturn,
      bankroll: this.data.bankroll,
      totalWon: this.data.totalWon,
      totalLost: this.data.totalLost,
      runSummary: this.data.runSummary,
    };
  }
}

module.exports = AgentLogger;
