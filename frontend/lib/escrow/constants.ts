import { PublicKey } from '@solana/web3.js';

// Program ID for the escrow contract
export const ESCROW_PROGRAM_ID = new PublicKey('8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm');

// Devnet USDC mint address (devnet USDC)
export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Wrapped SOL mint address (same on all networks)
export const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

// Token decimals
export const USDC_DECIMALS = 6;
export const SOL_DECIMALS = 9;

// Seeds for PDA derivation
export const ESCROW_STATE_SEED = Buffer.from('escrow_state_account');
export const TOKEN_VAULT_SEED = Buffer.from('token_vault');

// Helper function to derive escrow state PDA
export function deriveEscrowStatePDA(
    maker: PublicKey,
    tokenMint: PublicKey
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [ESCROW_STATE_SEED, maker.toBuffer(), tokenMint.toBuffer()],
        ESCROW_PROGRAM_ID
    );
}

// Helper function to derive token vault PDA
export function deriveTokenVaultPDA(
    escrowStateAccount: PublicKey,
    tokenMint: PublicKey
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [TOKEN_VAULT_SEED, escrowStateAccount.toBuffer(), tokenMint.toBuffer()],
        ESCROW_PROGRAM_ID
    );
}
