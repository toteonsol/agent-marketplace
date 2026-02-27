import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Bankr API configuration
const BANKR_API_KEY = process.env.BANKR_API_KEY || '';
const BANKR_BASE_URL = 'https://api.bankr.bot/v1';

// Transactions database file
const DB_FILE = path.join(process.cwd(), 'data', 'transactions.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read transactions from file
function readTransactions() {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ transactions: [], lastUpdated: new Date().toISOString() }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

// Write transactions to file
function writeTransactions(data: any) {
  ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Log transaction
function logTransaction(agentId: string, userAddress: string, amount: string, token: 'USDC' | 'MONITOR', txHash?: string) {
  const db = readTransactions();
  const transaction = {
    id: uuidv4(),
    agentId,
    userAddress,
    amount,
    token,
    txHash: txHash || 'pending',
    timestamp: new Date().toISOString(),
    platformFee: (parseFloat(amount) * 0.02).toFixed(6), // 2% fee to you
    creatorFee: (parseFloat(amount) * 0.98).toFixed(6), // 98% to agent creator
  };
  db.transactions.push(transaction);
  writeTransactions(db);
  return transaction;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, userAddress, paymentToken, amount } = body;

    if (!agentId || !userAddress || !paymentToken || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate token
    if (paymentToken !== 'USDC' && paymentToken !== 'MONITOR') {
      return NextResponse.json(
        { error: 'Invalid payment token. Must be USDC or MONITOR' },
        { status: 400 }
      );
    }

    // Call Bankr API to process payment
    const bankrResponse = await axios.post(
      `${BANKR_BASE_URL}/payments/execute`,
      {
        from: userAddress,
        token: paymentToken,
        amount: amount,
        description: `Agent Marketplace - Service Purchase (Agent ID: ${agentId})`,
        metadata: {
          agentId,
          marketplace: 'agent-services',
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${BANKR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (!bankrResponse.data.success) {
      return NextResponse.json(
        { error: 'Payment failed: ' + bankrResponse.data.error },
        { status: 400 }
      );
    }

    // Log transaction
    const transaction = logTransaction(
      agentId,
      userAddress,
      amount,
      paymentToken as 'USDC' | 'MONITOR',
      bankrResponse.data.txHash
    );

    return NextResponse.json({
      success: true,
      transaction,
      txHash: bankrResponse.data.txHash,
      message: 'Payment processed successfully',
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch transaction history
export async function GET(request: NextRequest) {
  try {
    const db = readTransactions();
    
    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let transactions = db.transactions;

    // Filter by agent if specified
    if (agentId) {
      transactions = transactions.filter((tx: any) => tx.agentId === agentId);
    }

    // Return latest transactions (limit)
    const result = transactions.slice(-limit).reverse();

    // Calculate stats
    const stats = {
      totalTransactions: transactions.length,
      totalVolume: transactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0),
      totalPlatformFees: transactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.platformFee), 0),
      byToken: {
        USDC: transactions.filter((tx: any) => tx.token === 'USDC').length,
        MONITOR: transactions.filter((tx: any) => tx.token === 'MONITOR').length,
      }
    };

    return NextResponse.json({
      transactions: result,
      stats,
      lastUpdated: db.lastUpdated,
    });
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
