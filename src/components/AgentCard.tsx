import React from 'react';

export default function AgentCard({ agent, onSelect }) {
  const getAgentIcon = (name) => {
    if (name.includes('Polymarket')) return '📈';
    if (name.includes('Price')) return '💹';
    if (name.includes('Bounty')) return '🎯';
    return '🤖';
  };

  const getAgentStats = (agent) => {
    if (agent.name.includes('Polymarket')) {
      return [
        { label: 'Win Rate', value: `${(agent.stats.winRate * 100).toFixed(0)}%` },
        { label: 'Avg Return', value: `${(agent.stats.avgReturn * 100).toFixed(0)}%` },
        { label: 'Capital', value: `$${(agent.stats.capital / 1e6).toFixed(2)}` }
      ];
    } else if (agent.name.includes('Price')) {
      return [
        { label: 'Chains', value: agent.stats.chainsCovered },
        { label: 'Alerts', value: agent.stats.alertsTriggered },
        { label: 'Execution', value: `${(agent.stats.executionRate * 100).toFixed(0)}%` }
      ];
    } else if (agent.name.includes('Bounty')) {
      return [
        { label: 'Completed', value: agent.stats.bountiesCompleted },
        { label: 'Avg Value', value: `$${(agent.stats.avgValue / 1e6).toFixed(2)}` },
        { label: 'Delivery', value: `${(agent.stats.deliveryRate * 100).toFixed(0)}%` }
      ];
    }
    return [];
  };

  const stats = getAgentStats(agent);

  return (
    <div className="bg-slate-800/40 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition hover:shadow-lg hover:shadow-blue-500/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{getAgentIcon(agent.name)}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{agent.name}</h3>
            <p className="text-slate-400 text-sm">{agent.totalUsages} uses</p>
          </div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
          <p className="text-green-400 text-xs font-medium">Active</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{agent.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-700/30 rounded-lg p-2 text-center">
            <p className="text-slate-400 text-xs">{stat.label}</p>
            <p className="text-white font-semibold text-sm mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="bg-slate-700/50 rounded-lg p-3 mb-4 space-y-2">
        {agent.usdcPrice > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">USDC</span>
            <span className="text-white font-mono">${(agent.usdcPrice / 1e6).toFixed(2)}</span>
          </div>
        )}
        {agent.monitorPrice > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">MONITOR</span>
            <span className="text-green-400 font-mono">{(agent.monitorPrice / 1e18).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Revenue */}
      <div className="text-xs text-slate-500 mb-4">
        Total Revenue: ${(agent.totalRevenue / 1e6).toFixed(2)}
      </div>

      {/* Button */}
      <button
        onClick={onSelect}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition active:scale-95"
      >
        Use Agent
      </button>
    </div>
  );
}
