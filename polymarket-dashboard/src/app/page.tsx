'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Trade {
  id: string;
  timestamp: string;
  type?: string;
  market?: string;
  outcome?: string;
  amount: number;
  status?: 'open' | 'closed' | 'resolved';
  entryPrice?: number;
  exitPrice?: number;
  pnl?: number;
  pnlPct?: number;
  reason?: string;
  odds?: number;
  notes?: string;
}

interface AgentData {
  lastUpdate: string;
  startingBankroll: number;
  bankroll: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  trades: Trade[];
  equity: number[];
  runSummary?: {
    marketsScanned: number;
    opportunitiesFound: number;
    betsPlaced: number;
    reason: string | null;
    lastRunTime: string | null;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agent-data.json directly from public folder
        const response = await fetch('/agent-data.json');
        if (response.ok) {
          const agentData = await response.json();
          setData(agentData);
        } else {
          // Show mock data if file doesn't exist yet
          setData(mockData());
        }
      } catch (e) {
        console.error('Failed to fetch agent data:', e);
        // Show mock data for demo
        setData(mockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading agent data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">No data available</p>
          <p className="text-gray-400 text-sm">Agent may not have run yet</p>
        </div>
      </div>
    );
  }

  // Calculate stats from trade data
  const trades = (data.trades || []) as Array<Trade & { type?: string }>;
  const closedTrades = trades.filter(t => (t as any).type === 'position_close' || t.pnl !== undefined);
  const winCount = closedTrades.filter(t => (t.pnl || 0) > 0).length;
  const lossCount = closedTrades.filter(t => (t.pnl || 0) < 0).length;
  const winRate = closedTrades.length > 0 ? ((winCount / closedTrades.length) * 100).toFixed(1) : '0';
  
  // Net P&L from trades
  const netPnL = data.totalWon - data.totalLost;
  
  // ROI based on starting bankroll
  const startingBankroll = data.startingBankroll || 8.0;
  const roi = (((data.bankroll - startingBankroll) / startingBankroll) * 100).toFixed(2);
  
  // Max drawdown from equity curve
  const equity = data.equity || [];
  let maxDrawdown = 0;
  if (equity.length > 1) {
    let peak = equity[0];
    for (let i = 1; i < equity.length; i++) {
      const dd = ((peak - equity[i]) / peak) * 100;
      if (dd > maxDrawdown) maxDrawdown = dd;
      if (equity[i] > peak) peak = equity[i];
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                🎰
              </div>
              <div>
                <h1 className="text-2xl font-bold">Polymarket Agent</h1>
                <p className="text-xs text-gray-400">Autonomous Trading Monitor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm text-gray-300">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard title="Starting Bankroll" value={`$${startingBankroll.toFixed(2)}`} icon="🏦" trend="neutral" subtitle="Initial capital" />
          <MetricCard title="Current Equity" value={`$${data.bankroll.toFixed(2)}`} icon="💰" trend={netPnL > 0 ? 'up' : 'down'} subtitle={`+$${netPnL.toFixed(2)}`} />
          <MetricCard title="ROI" value={`${roi}%`} icon="📈" trend={parseFloat(roi) > 0 ? 'up' : 'down'} subtitle={`${parseFloat(roi) > 0 ? 'Gaining' : 'Losing'} value`} />
          <MetricCard title="Total Trades" value={`${closedTrades.length}`} icon="🔄" trend="neutral" subtitle={`${winCount}W / ${lossCount}L`} />
          <MetricCard title="Win Rate" value={`${winRate}%`} icon="🎯" trend={parseFloat(winRate) > 50 ? 'up' : 'down'} subtitle={`${winCount} winning trades`} />
          <MetricCard title="Max Drawdown" value={`${maxDrawdown.toFixed(1)}%`} icon="📉" trend="down" subtitle="Peak to trough" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Equity Curve */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.equity.map((val, idx) => ({ date: idx, equity: val }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="equity" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Distribution */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Win/Loss Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Wins', value: data.trades.filter(t => (t.pnlPct || 0) > 0).length },
                    { name: 'Losses', value: data.trades.filter(t => (t.pnlPct || 0) < 0).length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Run Summary */}
        {data.runSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Markets Scanned</p>
              <p className="text-2xl font-bold">{data.runSummary.marketsScanned}</p>
              <p className="text-xs text-gray-500 mt-2">Last run: {data.runSummary.lastRunTime ? new Date(data.runSummary.lastRunTime).toLocaleTimeString() : 'N/A'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Opportunities</p>
              <p className="text-2xl font-bold text-amber-400">{data.runSummary.opportunitiesFound}</p>
              <p className="text-xs text-gray-500 mt-2">With detectable edge</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Bets Placed</p>
              <p className="text-2xl font-bold text-green-400">{data.runSummary.betsPlaced}</p>
              <p className="text-xs text-gray-500 mt-2">This run</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-sm font-mono text-gray-300 mt-3">{data.runSummary.reason || '✓ Bet placed'}</p>
            </div>
          </div>
        )}

        {/* Trades Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4">Market</th>
                  <th className="text-left py-3 px-4">Outcome</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">P&L</th>
                  <th className="text-left py-3 px-4">Return</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                      No trades yet. Agent is monitoring for opportunities...
                    </td>
                  </tr>
                ) : (
                  trades.slice().reverse().slice(0, 20).map(trade => {
                    const t = trade as any;
                    return (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-300">{trade.market || t.type}</td>
                      <td className="py-3 px-4">{trade.outcome || (t.type === 'winning_redemption' ? 'Redemption' : 'Adjustment')}</td>
                      <td className="py-3 px-4">${trade.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.status === 'open' ? 'bg-blue-500/20 text-blue-300' :
                          t.type === 'position_close' ? 'bg-purple-500/20 text-purple-300' :
                          t.type === 'winning_redemption' ? 'bg-green-500/20 text-green-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {trade.status || t.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${(trade.pnl || 0) > 0 ? 'text-green-400' : (trade.pnl || 0) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        ${trade.pnl?.toFixed(2) || '0.00'}
                      </td>
                      <td className={`py-3 px-4 ${(trade.pnlPct || 0) > 0 ? 'text-green-400' : (trade.pnlPct || 0) < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {trade.pnlPct ? `${(trade.pnlPct).toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{new Date(trade.timestamp).toLocaleDateString()}</td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Last updated: {new Date(data.lastUpdate).toLocaleString()}</p>
          <p className="mt-1">Auto-refreshes every 30 seconds</p>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, subtitle }: { title: string; value: string; icon: string; trend: 'up' | 'down' | 'neutral'; subtitle?: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
      <div className="flex items-center gap-1 text-xs">
        <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </span>
        <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
          {trend === 'up' ? 'Positive' : trend === 'down' ? 'Negative' : 'Neutral'}
        </span>
      </div>
    </div>
  );
}

function mockData(): AgentData {
  return {
    lastUpdate: new Date().toISOString(),
    startingBankroll: 8.0,
    bankroll: 9.85,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    trades: [],
    equity: [8.0, 9.85],
  };
}
