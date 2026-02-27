import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentCard from '@/components/AgentCard';
import Dashboard from '@/components/Dashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    // Try to get user address from localStorage or prompt for it
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setUserAddress(savedAddress);
    }

    fetchAgents();
    fetchTransactions();
    const interval = setInterval(() => {
      fetchAgents();
      fetchTransactions();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      // In production, call contract via ethers/wagmi
      const mockAgents = [
        {
          id: 0,
          name: 'Polymarket Trader',
          description: 'Autonomous prediction market trader with 15%+ edge detection',
          creator: '0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12',
          usdcPrice: 100000000, // $1.00
          monitorPrice: 1000000000000000000, // 1 MONITOR
          active: true,
          totalUsages: 42,
          totalRevenue: 42000000,
          stats: {
            winRate: 0.65,
            avgReturn: 0.18,
            capital: 999500000
          }
        },
        {
          id: 1,
          name: 'Price Monitor',
          description: 'Real-time price monitoring & conditional trading across 4 chains',
          creator: '0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3',
          usdcPrice: 50000000, // $0.50
          monitorPrice: 500000000000000000, // 0.5 MONITOR
          active: true,
          totalUsages: 128,
          totalRevenue: 64000000,
          stats: {
            chainsCovered: 4,
            alertsTriggered: 312,
            executionRate: 0.94
          }
        },
        {
          id: 2,
          name: 'Bounty Hunter',
          description: 'Autonomous Clawlancer bounty claim & completion system',
          creator: '0xA404D2308123B9E99b67E11Bb107A164E1F821EF',
          usdcPrice: 25000000, // $0.25
          monitorPrice: 250000000000000000, // 0.25 MONITOR
          active: true,
          totalUsages: 87,
          totalRevenue: 21750000,
          stats: {
            bountiesCompleted: 45,
            avgValue: 500000,
            deliveryRate: 1.0
          }
        }
      ];
      setAgents(mockAgents);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/pay?limit=20');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Fall back to empty array on error
      setTransactions([]);
    }
  };

  const platformStats = {
    totalAgents: agents.length,
    totalTransactions: transactions.length,
    totalRevenue: agents.reduce((acc, agent) => acc + agent.totalRevenue, 0),
    platformFee: agents.reduce((acc, agent) => acc + (agent.totalRevenue * 0.0204), 0), // 2% of total (0.02 / 0.98)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Agent Services</h1>
            <p className="text-slate-400 text-sm">Autonomous AI agents for trading, monitoring & bounties</p>
          </div>
          {userAddress ? (
            <div className="text-right">
              <p className="text-slate-400">Wallet Connected</p>
              <p className="text-xs text-slate-500">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
              <button
                onClick={() => {
                  localStorage.removeItem('userAddress');
                  setUserAddress(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 mt-1"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const addr = prompt('Enter your Ethereum address (0x...):');
                if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr)) {
                  localStorage.setItem('userAddress', addr);
                  setUserAddress(addr);
                } else {
                  alert('Invalid address format');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <Dashboard stats={platformStats} />

        {/* Agents Grid */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Available Agents</h2>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading agents...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={() => {
                    setSelectedAgent(agent);
                    setShowPurchaseModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="mt-12 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {transactions.length > 0 ? (
              transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-slate-700 pb-3">
                  <span className="text-slate-400">
                    Agent #{tx.agentId} • {tx.user.slice(0, 6)}...
                  </span>
                  <span className={`font-mono ${tx.token === 'USDC' ? 'text-blue-400' : 'text-green-400'}`}>
                    {tx.token === 'USDC' ? '$' : ''}{(tx.amount / 1e6).toFixed(2)} {tx.token}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No transactions yet</p>
            )}
          </div>
        </section>
      </main>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedAgent && (
        <PurchaseModal agent={selectedAgent} onClose={() => setShowPurchaseModal(false)} userAddress={userAddress} />
      )}
    </div>
  );
}

function PurchaseModal({ agent, onClose, userAddress }) {
  const [paymentMethod, setPaymentMethod] = useState('USDC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const price = paymentMethod === 'USDC' ? agent.usdcPrice : agent.monitorPrice;
  const displayPrice = paymentMethod === 'USDC' ? (price / 1e6).toFixed(2) : (price / 1e18).toFixed(6);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">{agent.name}</h3>
        <p className="text-slate-400 mb-6">{agent.description}</p>

        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <p className="text-slate-400 text-sm mb-2">Payment Method</p>
          <div className="flex gap-2">
            {['USDC', 'MONITOR'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  paymentMethod === method
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
          <p className="text-slate-400 text-sm">Price</p>
          <p className="text-2xl font-bold text-white">{displayPrice} {paymentMethod}</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            disabled={loading || !userAddress}
            onClick={async () => {
              if (!userAddress) {
                setError('Please connect your wallet first');
                return;
              }

              setLoading(true);
              setError('');

              try {
                const response = await axios.post('/api/pay', {
                  agentId: agent.id,
                  userAddress,
                  paymentToken: paymentMethod,
                  amount: displayPrice,
                });

                if (response.data.success) {
                  alert(`Payment successful! Transaction: ${response.data.txHash}`);
                  onClose();
                } else {
                  setError(response.data.error || 'Payment failed');
                }
              } catch (err: any) {
                setError(err.response?.data?.error || err.message || 'Payment failed');
              } finally {
                setLoading(false);
              }
            }}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? 'Processing...' : !userAddress ? 'Connect Wallet' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}
