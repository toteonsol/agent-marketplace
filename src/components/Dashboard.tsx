import React from 'react';

export default function Dashboard({ stats }) {
  const metrics = [
    {
      label: 'Active Agents',
      value: stats.totalAgents,
      icon: '🤖',
      color: 'from-blue-600 to-blue-800'
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      icon: '📊',
      color: 'from-purple-600 to-purple-800'
    },
    {
      label: 'Agent Revenue',
      value: `$${(stats.totalRevenue / 1e6).toFixed(2)}`,
      icon: '💰',
      color: 'from-green-600 to-green-800'
    },
    {
      label: 'Your Platform Fee (2%)',
      value: `$${(stats.platformFee / 1e6).toFixed(2)}`,
      icon: '💵',
      color: 'from-yellow-600 to-yellow-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${metric.color} rounded-xl p-6 border border-white/10 hover:border-white/20 transition`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">{metric.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
            </div>
            <span className="text-3xl">{metric.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
