import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BANKR_API_KEY = process.env.BANKR_API_KEY || '';
const BANKR_BASE_URL = 'https://api.bankr.bot/v1';

// Donation receiving wallet
const DONATION_WALLET = '0x7f52937fa30e4bc733e0b99a4f2843ba4f7ecf12';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, token, projectName } = body;

    if (!amount || !token) {
      return NextResponse.json(
        { error: 'Amount and token required' },
        { status: 400 }
      );
    }

    // Call Bankr API to receive donation
    const bankrResponse = await axios.post(
      `${BANKR_BASE_URL}/payments/execute`,
      {
        to: DONATION_WALLET,
        token: token === 'MONITOR' ? 'MONITOR' : 'USDC',
        amount: amount.toString(),
        description: `Donation to ${projectName || 'Agent Observatory'}`,
        metadata: {
          type: 'donation',
          project: projectName
        }
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
        { error: 'Donation failed: ' + bankrResponse.data.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      txHash: bankrResponse.data.txHash,
      message: `Thank you for donating ${amount} ${token}!`,
      donation: {
        amount,
        token,
        wallet: DONATION_WALLET,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: error.message || 'Donation processing failed' },
      { status: 500 }
    );
  }
}
