import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
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
        this.program = new Program(IDL as unknown as Idl, provider);
    }

    // Fetch all escrow accounts (sellers listing SOL)
    async fetchAllEscrows(): Promise<Seller[]> {
        try {
            const escrowAccounts = await this.connection.getProgramAccounts(ESCROW_PROGRAM_ID, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: '4VzCgfqN', // EscrowStateShape discriminator in base58
                        },
                    },
                ],
            });

            const sellers: Seller[] = [];

            for (const account of escrowAccounts) {
                try {
                    const escrowState = this.parseEscrowState(account.account.data);

                    // Fetch vault balance
                    const vaultBalance = await this.connection.getTokenAccountBalance(escrowState.vaultAddress);
                    const availableAmount = Number(vaultBalance.value.uiAmount) || 0;

                    if (availableAmount > 0) {
                        sellers.push({
                            id: account.pubkey.toString(),
                            name: `Seller ${account.pubkey.toString().slice(0, 4)}...${account.pubkey.toString().slice(-4)}`,
                            walletAddress: escrowState.maker.toString(),
                            escrowAccount: account.pubkey.toString(),
                            vaultAccount: escrowState.vaultAddress.toString(),
                            available: availableAmount,
                            currency: 'SOL',
                            price: 1.0, // Default price, could be stored in extended state
                            minAmount: 0.01,
                            maxAmount: availableAmount,
                            verified: true,
                            paymentMethods: ['USDC'],
                            rating: 4.8,
                            completedTrades: 0,
                        });
                    }
                } catch (e) {
                    console.error('Error parsing escrow account:', e);
                }
            }

            return sellers;
        } catch (error) {
            console.error('Error fetching escrows:', error);
            return [];
        }
    }

    // Parse escrow state from account data
    private parseEscrowState(data: Buffer): EscrowState {
        // Skip 8-byte discriminator
        const offset = 8;

        const maker = new PublicKey(data.slice(offset, offset + 32));
        const tokenMint = new PublicKey(data.slice(offset + 32, offset + 64));
        const vaultAddress = new PublicKey(data.slice(offset + 64, offset + 96));
        const tokenAmount = new BN(data.slice(offset + 96, offset + 104), 'le');
        const bump = data[offset + 104];

        return {
            maker,
            tokenMint,
            vaultAddress,
            tokenAmount,
            bump,
        };
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

            const swapIx = await this.program.methods
                .p2pswap(inputAmountBN, outputAmountBN)
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
