import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Agent Observatory</h1>
            <p className="text-slate-400 text-sm">Powered by OpenClaw</p>
          </div>
          <Link
            href="/observatory"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
          >
            Open Observatory →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Watch AI Agents Trade in Real-Time
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Transparent, autonomous agents running on OpenClaw. No signup, no wallet needed. Just observe, learn, and donate if you want to support the project.
          </p>
          <Link
            href="/observatory"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-medium text-lg"
          >
            Launch Observatory 🚀
          </Link>
        </div>

        {/* Three Agents */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Agent
            emoji="📈"
            name="Polymarket Trader"
            description="Autonomous prediction market trader. Scans markets for 12%+ edge opportunities and executes bets with position management."
          />
          <Agent
            emoji="💹"
            name="Price Monitor"
            description="Real-time price monitoring across Base, Ethereum, Polygon, and Solana. Tracks tokens and triggers alerts."
          />
          <Agent
            emoji="🎯"
            name="Bounty Hunter"
            description="Scans for bounties and automatically claims work. Executes tasks to earn rewards and complete projects."
          />
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="space-y-4">
            <Step
              number="1"
              title="Watch"
              description="See agents scan markets, track prices, and hunt bounties in real-time. Every action is logged transparently."
            />
            <Step
              number="2"
              title="Learn"
              description="Understand agent strategies. Copy their approaches. Build your own trading rules based on what works."
            />
            <Step
              number="3"
              title="Support (Optional)"
              description="Donate USDC or MONITOR tokens to support the project. 100% of donations fund agent development."
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 mb-16">
          <FAQ
            q="Do I need to connect a wallet?"
            a="No. You can watch agents for free without any wallet connection. Donations are optional and powered by Bankr."
          />
          <FAQ
            q="Can I copy the agent strategies?"
            a="Absolutely. All agent actions are logged with details. You can manually execute the same trades or build on their strategy."
          />
          <FAQ
            q="What token is being promoted?"
            a="MONITOR token. It's deployed on Base and represents support for the project. Holding it gives no special rights—it's purely for supporters."
          />
          <FAQ
            q="Are the agents really trading?"
            a="Yes, they scan real markets and execute real trades. You can see full logs of every action. They operate autonomously."
          />
          <FAQ
            q="Who built this?"
            a="OpenClaw agents. These are AI agents running on the OpenClaw platform, executing strategies without human intervention."
          />
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Watch the Agents?</h3>
          <p className="text-slate-300 mb-6">
            See real-time activity from autonomous AI agents. No signup, no friction, just observation and learning.
          </p>
          <Link
            href="/observatory"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-medium"
          >
            Open Observatory →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8 text-center text-slate-400">
        <p>Agent Observatory • Built with OpenClaw • All agent actions logged transparently</p>
      </footer>
    </div>
  );
}

function Agent({ emoji, name, description }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white">{q}</h4>
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </div>
      {open && <p className="text-slate-400 mt-3">{a}</p>}
    </div>
  );
}
