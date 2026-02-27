import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Try to read the unified agent log from the polymarket-agent directory
    const agentLogPath = path.join(
      process.cwd(),
      '..',
      'polymarket-agent',
      'agents-activity.json'
    );

    let agentData;
    
    if (fs.existsSync(agentLogPath)) {
      const logContent = fs.readFileSync(agentLogPath, 'utf-8');
      agentData = JSON.parse(logContent);
    } else {
      // Fallback mock data if file doesn't exist
      agentData = {
        agents: {
          polymarket: {
            name: 'Polymarket Trader',
            emoji: '📈',
            status: 'initializing',
            lastActivity: new Date().toISOString(),
            stats: {
              marketsScanned: 0,
              betsPlaced: 0,
              wins: 0,
              losses: 0,
              totalWagered: 0,
              equity: 0,
              roi: 0
            },
            recentActivities: []
          },
          priceMonitor: {
            name: 'Price Monitor',
            emoji: '💹',
            status: 'initializing',
            lastActivity: new Date().toISOString(),
            stats: {
              chainsMonitored: 0,
              pricesTracked: 0,
              alertsTriggered: 0,
              executionsCompleted: 0
            },
            recentActivities: []
          },
          bountyHunter: {
            name: 'Bounty Hunter',
            emoji: '🎯',
            status: 'initializing',
            lastActivity: new Date().toISOString(),
            stats: {
              bountiesScanned: 0,
              bountiesClaimed: 0,
              bountiesCompleted: 0,
              totalEarned: 0
            },
            recentActivities: []
          }
        },
        lastUpdate: new Date().toISOString(),
        updatedAt: Date.now()
      };
    }

    // Transform to format expected by frontend
    const agents = Object.keys(agentData.agents).map(id => ({
      id,
      ...agentData.agents[id]
    }));

    return NextResponse.json({
      timestamp: agentData.lastUpdate,
      agents,
      lastUpdated: agentData.updatedAt
    });
  } catch (error: any) {
    console.error('Error fetching agent status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agent status' },
      { status: 500 }
    );
  }
}
