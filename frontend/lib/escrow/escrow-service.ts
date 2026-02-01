import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    NATIVE_MINT,
    createSyncNativeInstruction
} from '@solana/spl-token';
import {
    ESCROW_PROGRAM_ID,
    USDC_MINT,
    WSOL_MINT,
    deriveEscrowStatePDA,
    deriveTokenVaultPDA,
    SOL_DECIMALS,
    USDC_DECIMALS
} from './constants';
import { EscrowState, Seller, TransactionResult } from './types';
import { IDL } from './idl';

export class EscrowService {
    private connection: Connection;
    private program: Program | null = null;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    // Initialize the program with a provider (requires wallet)
    initializeProgram(provider: AnchorProvider) {
        // For Anchor 0.30+, we need to pass the IDL directly
        // The new format is auto-detected
        this.program = new Program(IDL as unknown as Idl, provider);

        // Debug: log available methods
        if (this.program && this.program.methods) {
            console.log('Available program methods:', Object.keys(this.program.methods));
        }
    }

    // Fetch all escrow accounts (sellers listing SOL)
    async fetchAllEscrows(): Promise<Seller[]> {
        try {
            console.log('Fetching escrow accounts from program:', ESCROW_PROGRAM_ID.toString());

            // EscrowStateShape account size: 8 (discriminator) + 32 (maker) + 32 (token_mint) + 32 (vault_address) + 8 (token_amount) + 1 (bump) = 113 bytes
            const ESCROW_ACCOUNT_SIZE = 113;

            const escrowAccounts = await this.connection.getProgramAccounts(ESCROW_PROGRAM_ID, {
                filters: [
                    {
                        dataSize: ESCROW_ACCOUNT_SIZE,
                    },
                ],
            });

            console.log(`Found ${escrowAccounts.length} escrow accounts`);

            const sellers: Seller[] = [];

            for (const account of escrowAccounts) {
                try {
                    console.log('Parsing escrow account:', account.pubkey.toString());
                    const escrowState = this.parseEscrowState(account.account.data);
                    console.log('Escrow state:', {
                        maker: escrowState.maker.toString(),
                        tokenMint: escrowState.tokenMint.toString(),
                        vaultAddress: escrowState.vaultAddress.toString(),
                        tokenAmount: escrowState.tokenAmount.toString(),
                    });

                    // Only show WSOL escrows (SOL listings)
                    if (!escrowState.tokenMint.equals(WSOL_MINT)) {
                        console.log('Skipping non-WSOL escrow');
                        continue;
                    }

                    // Fetch vault balance
                    let availableAmount = 0;
                    try {
                        const vaultBalance = await this.connection.getTokenAccountBalance(escrowState.vaultAddress);
                        availableAmount = Number(vaultBalance.value.uiAmount) || 0;
                        console.log('Vault balance:', availableAmount);
                    } catch (e) {
                        console.log('Could not fetch vault balance:', e);
                        // Use the stored amount as fallback
                        availableAmount = escrowState.tokenAmount.toNumber() / Math.pow(10, SOL_DECIMALS);
                    }

                    // Show even if balance is 0 for debugging
                    sellers.push({
                        id: account.pubkey.toString(),
                        name: `Seller ${escrowState.maker.toString().slice(0, 4)}...${escrowState.maker.toString().slice(-4)}`,
                        walletAddress: escrowState.maker.toString(),
                        escrowAccount: account.pubkey.toString(),
                        vaultAccount: escrowState.vaultAddress.toString(),
                        available: availableAmount,
                        currency: 'SOL',
                        price: 150.0, // Price in USDC per SOL (rough estimate)
                        minAmount: 0.001,
                        maxAmount: Math.max(availableAmount, 0.001),
                        verified: true,
                        paymentMethods: ['USDC'],
                        rating: 4.8,
                        completedTrades: 0,
                    });
                } catch (e) {
                    console.error('Error parsing escrow account:', account.pubkey.toString(), e);
                }
            }

            console.log(`Returning ${sellers.length} sellers`);
            return sellers;
        } catch (error) {
            console.error('Error fetching escrows:', error);
            return [];
        }
    }

    // Parse escrow state from account data
    private parseEscrowState(data: Buffer | Uint8Array): EscrowState {
        // Convert Uint8Array to Buffer if needed
        const buffer = Buffer.from(data);

        // Skip 8-byte discriminator
        const offset = 8;

        const maker = new PublicKey(buffer.slice(offset, offset + 32));
        const tokenMint = new PublicKey(buffer.slice(offset + 32, offset + 64));
        const vaultAddress = new PublicKey(buffer.slice(offset + 64, offset + 96));
        const tokenAmount = new BN(buffer.slice(offset + 96, offset + 104), 'le');
        const bump = buffer[offset + 104];

        return {
            maker,
            tokenMint,
            vaultAddress,
            tokenAmount,
            bump,
        };
    }

    // Check if user already has an escrow listing
    async hasExistingListing(makerWallet: PublicKey): Promise<boolean> {
        try {
            const [escrowStateAccount] = deriveEscrowStatePDA(makerWallet, WSOL_MINT);
            const accountInfo = await this.connection.getAccountInfo(escrowStateAccount);
            return accountInfo !== null;
        } catch {
            return false;
        }
    }

    // Get user's existing escrow details
    async getExistingListing(makerWallet: PublicKey): Promise<Seller | null> {
        try {
            const [escrowStateAccount] = deriveEscrowStatePDA(makerWallet, WSOL_MINT);
            const accountInfo = await this.connection.getAccountInfo(escrowStateAccount);

            if (!accountInfo) return null;

            const escrowState = this.parseEscrowState(accountInfo.data);

            // Get vault balance
            let availableAmount = 0;
            try {
                const vaultBalance = await this.connection.getTokenAccountBalance(escrowState.vaultAddress);
                availableAmount = Number(vaultBalance.value.uiAmount) || 0;
            } catch {
                availableAmount = escrowState.tokenAmount.toNumber() / Math.pow(10, SOL_DECIMALS);
            }

            return {
                id: escrowStateAccount.toString(),
                name: `Your Listing`,
                walletAddress: escrowState.maker.toString(),
                escrowAccount: escrowStateAccount.toString(),
                vaultAccount: escrowState.vaultAddress.toString(),
                available: availableAmount,
                currency: 'SOL',
                price: 150.0,
                minAmount: 0.001,
                maxAmount: availableAmount,
                verified: true,
                paymentMethods: ['USDC'],
                rating: 5.0,
                completedTrades: 0,
            };
        } catch (e) {
            console.error('Error getting existing listing:', e);
            return null;
        }
    }

    // Create a new escrow listing (seller deposits SOL)
    async createListing(
        makerWallet: PublicKey,
        amount: number, // Amount in SOL
        signTransaction: (tx: Transaction) => Promise<Transaction>
    ): Promise<TransactionResult> {
        if (!this.program) {
            return { success: false, error: 'Program not initialized' };
        }

        try {
            // Check if escrow already exists
            const hasListing = await this.hasExistingListing(makerWallet);
            if (hasListing) {
                return {
                    success: false,
                    error: 'You already have an active listing. Each wallet can only have one SOL listing at a time.'
                };
            }

            const amountLamports = new BN(amount * Math.pow(10, SOL_DECIMALS));

            // Derive PDAs
            const [escrowStateAccount] = deriveEscrowStatePDA(makerWallet, WSOL_MINT);
            const [tokenVault] = deriveTokenVaultPDA(escrowStateAccount, WSOL_MINT);

            // Get or create maker's WSOL token account
            const makerTokenAccount = getAssociatedTokenAddressSync(WSOL_MINT, makerWallet);

            // Check if maker's WSOL account exists
            const makerWsolAccount = await this.connection.getAccountInfo(makerTokenAccount);

            const transaction = new Transaction();

            // If WSOL account doesn't exist, create it and wrap SOL
            if (!makerWsolAccount) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        makerWallet,
                        makerTokenAccount,
                        makerWallet,
                        WSOL_MINT
                    )
                );

                // Transfer SOL to the WSOL account
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: makerWallet,
                        toPubkey: makerTokenAccount,
                        lamports: amountLamports.toNumber(),
                    })
                );

                // Sync native
                transaction.add(createSyncNativeInstruction(makerTokenAccount));
            }

            // Add initialize instruction
            const initializeIx = await this.program.methods
                .initialize(amountLamports)
                .accounts({
                    maker: makerWallet,
                    tokenMint: WSOL_MINT,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    escrowStateAccount,
                    tokenVault,
                    makerTokenAccount,
                })
                .instruction();

            transaction.add(initializeIx);

            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = makerWallet;

            // Sign and send
            const signedTx = await signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signedTx.serialize());

            await this.connection.confirmTransaction(signature);

            return { success: true, signature };
        } catch (error) {
            console.error('Error creating listing:', error);
            return { success: false, error: (error as Error).message };
        }
    }

    // Execute P2P swap (buyer purchases SOL with USDC)
    async executeSwap(
        makerPubkey: PublicKey,
        takerWallet: PublicKey,
        inputAmount: number, // USDC amount
        outputAmount: number, // SOL amount
        signTransaction: (tx: Transaction) => Promise<Transaction>
    ): Promise<TransactionResult> {
        if (!this.program) {
            return { success: false, error: 'Program not initialized' };
        }

        try {
            const inputAmountBN = new BN(inputAmount * Math.pow(10, USDC_DECIMALS));
            const outputAmountBN = new BN(outputAmount * Math.pow(10, SOL_DECIMALS));

            // Derive PDAs
            const [escrowStateAccount] = deriveEscrowStatePDA(makerPubkey, WSOL_MINT);
            const [vaultAccount] = deriveTokenVaultPDA(escrowStateAccount, WSOL_MINT);

            // Get token accounts
            const makerInputAccount = getAssociatedTokenAddressSync(USDC_MINT, makerPubkey);
            const makerOutputAccount = getAssociatedTokenAddressSync(USDC_MINT, makerPubkey);
            const takerInputAccount = getAssociatedTokenAddressSync(USDC_MINT, takerWallet);
            const takerOutputAccount = getAssociatedTokenAddressSync(WSOL_MINT, takerWallet);

            const transaction = new Transaction();

            // Check if taker's WSOL account exists, create if not
            const takerWsolAccount = await this.connection.getAccountInfo(takerOutputAccount);
            if (!takerWsolAccount) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        takerWallet,
                        takerOutputAccount,
                        takerWallet,
                        WSOL_MINT
                    )
                );
            }

            // Note: The p2pswap instruction requires BOTH maker and taker to sign
            // This is a limitation of the current contract design
            // For a real P2P marketplace, you'd typically use a different pattern

            // Log available methods for debugging
            console.log('Program methods available:', Object.keys(this.program.methods || {}));

            // Try to find the correct method name (could be p2pswap or p2Pswap depending on conversion)
            const methods = this.program.methods as Record<string, unknown>;
            let swapMethod = methods['p2pswap'] || methods['p2Pswap'] || methods['P2pswap'];

            if (!swapMethod) {
                // List available methods for debugging
                const availableMethods = Object.keys(methods).join(', ');
                return {
                    success: false,
                    error: `Swap method not found. Available methods: ${availableMethods}`
                };
            }

            const swapIx = await (swapMethod as Function).call(this.program.methods, inputAmountBN, outputAmountBN)
                .accounts({
                    maker: makerPubkey,
                    taker: takerWallet,
                    inputTokenMint: USDC_MINT,
                    outputTokenMint: WSOL_MINT,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    escrowStateAccount,
                    makerInputAccount,
                    makerOutputAccount,
                    takerInputAccount,
                    takerOutputAccount,
                    vaultAccount,
                })
                .instruction();

            transaction.add(swapIx);

            // Get recent blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = takerWallet;

            // Sign and send
            const signedTx = await signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signedTx.serialize());

            await this.connection.confirmTransaction(signature);

            return { success: true, signature };
        } catch (error) {
            console.error('Error executing swap:', error);
            return { success: false, error: (error as Error).message };
        }
    }

    // Get user's SOL balance
    async getSolBalance(wallet: PublicKey): Promise<number> {
        const balance = await this.connection.getBalance(wallet);
        return balance / Math.pow(10, SOL_DECIMALS);
    }

    // Get user's USDC balance
    async getUsdcBalance(wallet: PublicKey): Promise<number> {
        try {
            const tokenAccount = getAssociatedTokenAddressSync(USDC_MINT, wallet);
            const balance = await this.connection.getTokenAccountBalance(tokenAccount);
            return Number(balance.value.uiAmount) || 0;
        } catch {
            return 0;
        }
    }

    // Get user's WSOL balance  
    async getWsolBalance(wallet: PublicKey): Promise<number> {
        try {
            const tokenAccount = getAssociatedTokenAddressSync(WSOL_MINT, wallet);
            const balance = await this.connection.getTokenAccountBalance(tokenAccount);
            return Number(balance.value.uiAmount) || 0;
        } catch {
            return 0;
        }
    }
}

// Singleton instance
let escrowServiceInstance: EscrowService | null = null;

export function getEscrowService(connection: Connection): EscrowService {
    if (!escrowServiceInstance) {
        escrowServiceInstance = new EscrowService(connection);
    }
    return escrowServiceInstance;
}
