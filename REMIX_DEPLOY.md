# Deploy via Remix IDE (5 minutes)

Easiest way to deploy the AgentMarketplace contract.

## Step 1: Go to Remix (1 minute)

1. Open https://remix.ethereum.org in your browser
2. You'll see a code editor with some default files

## Step 2: Create Contract File (1 minute)

1. Left panel → "File Explorer"
2. Click "Create New File"
3. Name it: `AgentMarketplace.sol`
4. Copy the entire contract code from:
   `/home/openclaw/.openclaw/workspace/agent-marketplace/src/contracts/AgentMarketplace.sol`
5. Paste into Remix

## Step 3: Compile (1 minute)

1. Left panel → Click the checkmark icon (Solidity Compiler)
2. Select Compiler: `0.8.19`
3. Click "Compile AgentMarketplace.sol"
4. Should show ✓ with no errors

## Step 4: Deploy (1 minute)

1. Left panel → Click the deploy icon (rocket ship)
2. Under "Environment" select: **"Injected Provider"**
3. Switch MetaMask to **Base network** (if not already)
4. Under "Contract" make sure AgentMarketplace is selected
5. Click "Deploy"
6. MetaMask will prompt you to confirm
7. Click "Confirm"
8. Wait ~10 seconds...

## Step 5: Save Contract Address (1 minute)

After deployment completes:
1. In Remix, under "Deployed Contracts" you'll see your contract
2. Copy the contract address (looks like: 0x...)
3. Save it somewhere — you'll need it for the next step

**That's it!** Your contract is now live on Base.

---

## Next: Update Environment Variables

Once you have the contract address, update `.env.local`:

```bash
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x[YOUR_CONTRACT_ADDRESS_HERE]
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3
NEXT_PUBLIC_MONITOR_ADDRESS=0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3
```

Then proceed with app deployment to Vercel.

---

## Troubleshooting

**"Injected Provider not found"**
- Make sure MetaMask is installed
- Refresh the page
- Try again

**"Wrong network"**
- MetaMask top right → Switch to Base
- Try deploying again

**"Gas estimation failed"**
- Make sure you have some ETH on Base for gas (~0.01 ETH = ~$0.05)
- Wait a minute and try again

**Deployment stuck?**
- Check MetaMask — there might be a pending transaction
- Reject it if needed, then try again

---

## Verify on Basescan (Optional)

After deployment, verify your contract on Basescan:

1. Go to https://basescan.org
2. Search for your contract address
3. Click "Verify and Publish"
4. Select:
   - Compiler: 0.8.19
   - License: MIT
5. Upload your source code from `AgentMarketplace.sol`
6. Verify

This makes it transparent to users that you're using a legitimate contract.

---

**Done!** You now have a deployed smart contract. Next: deploy the app to Vercel.
