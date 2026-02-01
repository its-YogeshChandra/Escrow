import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

// Escrow state shape matching the on-chain account
export interface EscrowState {
    maker: PublicKey;
    tokenMint: PublicKey;
    vaultAddress: PublicKey;
    tokenAmount: BN;
    bump: number;
}

// Frontend-friendly seller representation
export interface Seller {
    id: string;
    name: string;
    walletAddress: string;
    escrowAccount: string;
    vaultAccount: string;
    available: number;
    currency: string;
    price: number;
    minAmount: number;
    maxAmount: number;
    verified: boolean;
    paymentMethods: string[];
    rating: number;
    completedTrades: number;
}

// Trade/Swap parameters
export interface SwapParams {
    makerPublicKey: PublicKey;
    inputAmount: number;  // USDC amount (taker pays)
    outputAmount: number; // SOL amount (taker receives)
}

// Transaction result
export interface TransactionResult {
    success: boolean;
    signature?: string;
    error?: string;
}

// Listing parameters for sellers
export interface ListingParams {
    amount: number; // Amount of WSOL to deposit
    pricePerToken: number; // Price in USDC per SOL
    minAmount: number;
    maxAmount: number;
}
