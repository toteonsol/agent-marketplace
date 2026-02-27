/**
 * Agent Observatory Dashboard
 * Shows real-time activity logs from all 3 agents
 * Mobile-first, clean, observation-only design
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AGENTS = [
  { id: 'polymarket', name: 'Polymarket Trader', emoji: '📈', color: 'blue' },
  { id: 'priceMonitor', name: 'Price Monitor', emoji: '💹', color: 'green' },
  { id: 'bountyHunter', name: 'Bounty Hunter', emoji: '🎯', color: 'purple' }
];

export default function Observatory() {
  const [agentsData, setAgentsData] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('polymarket');
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchAgentsData();
    const interval = setInterval(fetchAgentsData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchAgentsData = async () => {
    try {
      // In production, call your actual API endpoint
      // For now, we'll use a mock endpoint
      const response = await axios.get('/api/agents-status').catch(() => ({
        data: {
          timestamp: new Date().toISOString(),
          agents: AGENTS.map(agent => ({
            id: agent.id,
            name: agent.name,
            emoji: agent.emoji,
            status: 'active',
            lastActivity: new Date().toISOString(),
            stats: {
              marketsScanned: Math.floor(Math.random() * 100),
              pricesTracked: Math.floor(Math.random() * 50),
              bountiesScanned: Math.floor(Math.random() * 100),
            },
            recentActivities: []
          }))
        }
      }));
      setAgentsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch agents data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const currentAgent = agentsData?.agents?.find(a => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Observatory</h1>
              <p className="text-slate-400 text-sm">Real-time AI agent activity • Powered by OpenClaw</p>
            </div>
            <button
              onClick={() => setShowDonateModal(true)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium text-sm"
            >
              💚 Support Project
            </button>
          </div>

          {/* Agent Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                  selectedAgent === agent.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {agent.emoji} {agent.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentAgent && (
          <>
            {/* Agent Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(currentAgent.stats).map(([key, value]) => (
                <StatCard
                  key={key}
                  label={formatLabel(key)}
                  value={value}
                />
              ))}
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {currentAgent.emoji} Recent Activity
              </h2>
              
              {currentAgent.recentActivities && currentAgent.recentActivities.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {currentAgent.recentActivities.slice(0, 20).map((activity, i) => (
                    <ActivityItem
                      key={i}
                      activity={activity}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  No recent activity
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-slate-300 text-sm">
                <strong>ℹ️ What you're watching:</strong> Real-time logs of autonomous AI agents running on OpenClaw. These agents execute strategies independently and log every action. You can learn from their strategies or support the project with a donation.
              </p>
            </div>
          </>
        )}
      </main>

      {/* Donate Modal */}
      {showDonateModal && (
        <DonateModal onClose={() => setShowDonateModal(false)} />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

function ActivityItem({ activity }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getTypeIcon = (type) => {
    if (type.includes('error')) return '❌';
    if (type.includes('claim')) return '✅';
    if (type.includes('alert')) return '⚠️';
    if (type.includes('scan')) return '🔍';
    if (type.includes('update')) return '📊';
    return '•';
  };

  return (
    <div className="border-l-2 border-slate-700 pl-3 py-2">
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">{getTypeIcon(activity.type)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="text-white text-sm font-medium truncate">
              {activity.message}
            </p>
            <span className={`text-xs whitespace-nowrap mt-0.5 ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
          </div>
          {activity.details && Object.keys(activity.details).length > 0 && (
            <p className="text-slate-400 text-xs mt-1">
              {Object.entries(activity.details)
                .slice(0, 2)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' • ')}
            </p>
          )}
          <p className="text-slate-600 text-xs mt-1">
            {new Date(activity.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function DonateModal({ onClose }) {
  const [donationAmount, setDonationAmount] = useState('5');
  const [donationToken, setDonationToken] = useState('USDC');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    try {
      // Call Bankr donation API
      const response = await axios.post('/api/donate', {
        amount: donationAmount,
        token: donationToken,
        projectName: 'Agent Observatory'
      });
      
      if (response.data.success) {
        alert(`Thank you for donating ${donationAmount} ${donationToken}! 💜`);
        onClose();
      }
    } catch (error) {
      alert('Donation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Support Agent Observatory</h3>
        
        <p className="text-slate-400 text-sm mb-6">
          Help us keep the agents running and improve the project. Every donation supports the development of more powerful AI agents.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm">Amount</label>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              placeholder="5"
              min="1"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Token</label>
            <div className="flex gap-2 mt-1">
              {['USDC', 'MONITOR'].map(token => (
                <button
                  key={token}
                  onClick={() => setDonationToken(token)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                    donationToken === token
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDonate}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : `Donate ${donationAmount} ${donationToken}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🤖</div>
        <p className="text-slate-400">Loading Agent Observatory...</p>
      </div>
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
