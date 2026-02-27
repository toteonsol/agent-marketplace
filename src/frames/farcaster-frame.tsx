import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';

const AGENTS = [
  {
    id: 0,
    name: '📈 Polymarket Trader',
    description: 'Autonomous prediction trader',
    emoji: '📈'
  },
  {
    id: 1,
    name: '💹 Price Monitor',
    description: 'Price monitoring across 4 chains',
    emoji: '💹'
  },
  {
    id: 2,
    name: '🎯 Bounty Hunter',
    description: 'Clawlancer bounty completion',
    emoji: '🎯'
  }
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return NextResponse.json({ message: 'Invalid frame message' }, { status: 403 });
  }

  const buttonIndex = body.untrustedData.buttonIndex || 1;
  const state = body.untrustedData.inputText || '';

  // Route to appropriate frame
  if (buttonIndex === 1) {
    return showAgentList();
  } else if (buttonIndex >= 2 && buttonIndex <= 4) {
    return showAgentDetail(buttonIndex - 2);
  } else if (buttonIndex === 5) {
    return showPurchase(parseInt(state));
  }

  return showAgentList();
}

function showAgentList(): NextResponse {
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Agent Services Marketplace" />
      <meta property="og:description" content="Access AI agent services: trading, price monitoring, bounty hunting" />
      <meta property="og:image" content="https://agent-marketplace.vercel.app/og.png" />
      
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://agent-marketplace.vercel.app/frame-agents.png" />
      <meta property="fc:frame:button:1" content="🤖 Polymarket Trader" />
      <meta property="fc:frame:post_url" content="https://agent-marketplace.vercel.app/api/frame" />
      <meta property="fc:frame:button:2" content="💹 Price Monitor" />
      <meta property="fc:frame:post_url" content="https://agent-marketplace.vercel.app/api/frame" />
      <meta property="fc:frame:button:3" content="🎯 Bounty Hunter" />
      <meta property="fc:frame:post_url" content="https://agent-marketplace.vercel.app/api/frame" />
      <meta property="fc:frame:button:4" content="🔗 Launch App" />
      <meta property="fc:frame:button:4:action" content="link" />
      <meta property="fc:frame:button:4:target" content="https://agent-marketplace.vercel.app" />
    </head>
    <body></body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
}

function showAgentDetail(agentId: number): NextResponse {
  const agent = AGENTS[agentId];
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta property="og:title" content="${agent.name}" />
      <meta property="og:description" content="${agent.description}" />
      <meta property="og:image" content="https://agent-marketplace.vercel.app/frame-agent-${agentId}.png" />
      
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://agent-marketplace.vercel.app/frame-agent-${agentId}.png" />
      <meta property="fc:frame:button:1" content="💰 Pay with USDC" />
      <meta property="fc:frame:button:1:action" content="tx" />
      <meta property="fc:frame:button:1:target" content="https://agent-marketplace.vercel.app/api/tx?agent=${agentId}&token=usdc" />
      <meta property="fc:frame:button:2" content="🔥 Burn MONITOR" />
      <meta property="fc:frame:button:2:action" content="tx" />
      <meta property="fc:frame:button:2:target" content="https://agent-marketplace.vercel.app/api/tx?agent=${agentId}&token=monitor" />
      <meta property="fc:frame:button:3" content="← Back" />
      <meta property="fc:frame:post_url" content="https://agent-marketplace.vercel.app/api/frame" />
    </head>
    <body></body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
}

function showPurchase(agentId: number): NextResponse {
  const agent = AGENTS[agentId];
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta property="og:title" content="Purchase ${agent.name}" />
      <meta property="og:description" content="Transaction complete! Your agent service is activated." />
      <meta property="og:image" content="https://agent-marketplace.vercel.app/frame-success.png" />
      
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://agent-marketplace.vercel.app/frame-success.png" />
      <meta property="fc:frame:button:1" content="🎯 Use Agent" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://agent-marketplace.vercel.app/agent/${agentId}" />
      <meta property="fc:frame:button:2" content="📊 View Dashboard" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta property="fc:frame:button:2:target" content="https://agent-marketplace.vercel.app/dashboard" />
    </head>
    <body></body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
}
