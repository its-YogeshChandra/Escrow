# P2P Escrow - SOL/USDC Exchange

A peer-to-peer escrow application for trading SOL and USDC on Solana devnet.

## Architecture

### Smart Contract (Anchor)
- **Location**: `/escrow-contract`
- **Program ID**: `8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm`

### Frontend (Next.js)
- **Location**: `/frontend`
- **Stack**: Next.js 16, React 19, Tailwind CSS, Solana Wallet Adapter

## How It Works

### For Sellers (Makers)
1. Connect your Solana wallet (Phantom, Solflare, etc.)
2. Click "List SOL for Sale" in Quick Actions
3. Enter the amount of SOL you want to sell
4. Confirm the transaction - SOL is deposited into escrow

### For Buyers (Takers)
1. Connect your Solana wallet
2. Browse available sellers in the dashboard
3. Enter the amount of SOL you want to buy
4. Click "Buy" - USDC is sent to seller, SOL is released from escrow

## Deployment Instructions

### 1. Deploy the Smart Contract to Devnet

```bash
# Navigate to the escrow contract directory
cd escrow-contract

# Make sure Solana CLI is configured for devnet
solana config set --url devnet

# Check your wallet has devnet SOL (airdrop if needed)
solana airdrop 2

# Build the program
anchor build

# Deploy to devnet
anchor deploy
```

### 2. Verify Deployment

After deployment, verify the program is deployed:
```bash
solana program show 8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm
```

### 3. Run the Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Token Addresses (Devnet)

- **USDC (Devnet)**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **Wrapped SOL**: `So11111111111111111111111111111111111111112`

## Getting Devnet Tokens

### Get Devnet SOL
```bash
solana airdrop 2
```

### Get Devnet USDC
Use the SPL Token Faucet or create your own test tokens:
```bash
spl-token create-token
spl-token create-account <TOKEN_MINT>
spl-token mint <TOKEN_MINT> 1000
```

## Smart Contract Instructions

### `initialize` (Create Listing)
- **Called by**: Seller (Maker)
- **Action**: Deposits tokens (WSOL) into escrow vault
- **Parameters**: `amount` (u64) - Amount of tokens to deposit

### `p2pswap` (Execute Trade)
- **Called by**: Both Maker and Taker must sign
- **Action**: Swaps tokens between maker and taker through escrow
- **Parameters**: 
  - `input_amount` (u64) - USDC amount from taker to maker
  - `output_amount` (u64) - SOL amount from vault to taker

## Important Notes

1. **Dual Signature Requirement**: The current contract requires both maker AND taker to sign the swap transaction. This is for security but requires coordination between parties.

2. **Devnet Only**: This is configured for Solana devnet. Do not use with real funds.

3. **Token Accounts**: Users must have associated token accounts for both USDC and WSOL before trading.

## File Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── layout.tsx            # Root layout with wallet provider
│   └── page.tsx              # Landing page
├── components/
│   ├── dashboard/
│   │   ├── activity-feed.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── quick-actions.tsx  # Create listings
│   │   ├── seller-list.tsx    # Buy from sellers
│   │   └── stats-cards.tsx
│   ├── wallet-provider.tsx    # Solana wallet context
│   └── ...
├── hooks/
│   └── use-escrow.ts         # Escrow hook for React
└── lib/
    └── escrow/
        ├── constants.ts      # Program IDs, mints
        ├── escrow-service.ts # Service class
        ├── idl.ts           # Anchor IDL types
        ├── types.ts         # TypeScript types
        └── index.ts         # Exports
```

## Development

### TypeScript Check
```bash
cd frontend && npx tsc --noEmit
```

### Build
```bash
cd frontend && pnpm build
```
