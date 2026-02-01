'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getEscrowService, EscrowService } from '@/lib/escrow/escrow-service';
import { Seller, TransactionResult } from '@/lib/escrow/types';

export function useEscrow() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [escrowService, setEscrowService] = useState<EscrowService | null>(null);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [solBalance, setSolBalance] = useState<number>(0);
    const [usdcBalance, setUsdcBalance] = useState<number>(0);

    // Initialize escrow service
    useEffect(() => {
        const service = getEscrowService(connection);
        setEscrowService(service);

        if (wallet.publicKey && wallet.signTransaction) {
            const provider = new AnchorProvider(
                connection,
                wallet as any,
                { commitment: 'confirmed' }
            );
            service.initializeProgram(provider);
        }
    }, [connection, wallet.publicKey, wallet.signTransaction]);

    // Fetch user balances when wallet changes
    useEffect(() => {
        async function fetchBalances() {
            if (!escrowService || !wallet.publicKey) {
                setSolBalance(0);
                setUsdcBalance(0);
                return;
            }

            try {
                const [sol, usdc] = await Promise.all([
                    escrowService.getSolBalance(wallet.publicKey),
                    escrowService.getUsdcBalance(wallet.publicKey),
                ]);
                setSolBalance(sol);
                setUsdcBalance(usdc);
            } catch (e) {
                console.error('Error fetching balances:', e);
            }
        }

        fetchBalances();
    }, [escrowService, wallet.publicKey]);

    // Fetch all available sellers/escrows
    const fetchSellers = useCallback(async () => {
        if (!escrowService) return;

        setLoading(true);
        setError(null);

        try {
            const escrows = await escrowService.fetchAllEscrows();
            setSellers(escrows);
        } catch (e) {
            setError((e as Error).message);
            console.error('Error fetching sellers:', e);
        } finally {
            setLoading(false);
        }
    }, [escrowService]);

    // Fetch sellers on mount and when service is ready
    useEffect(() => {
        fetchSellers();
    }, [fetchSellers]);

    // Create a new listing (for sellers)
    const createListing = useCallback(async (amount: number): Promise<TransactionResult> => {
        if (!escrowService || !wallet.publicKey || !wallet.signTransaction) {
            return { success: false, error: 'Wallet not connected' };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await escrowService.createListing(
                wallet.publicKey,
                amount,
                wallet.signTransaction as (tx: Transaction) => Promise<Transaction>
            );

            if (result.success) {
                // Refresh sellers list
                await fetchSellers();
            }

            return result;
        } catch (e) {
            const errorMsg = (e as Error).message;
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [escrowService, wallet.publicKey, wallet.signTransaction, fetchSellers]);

    // Execute a swap (for buyers)
    const executeSwap = useCallback(async (
        makerAddress: string,
        inputAmount: number,
        outputAmount: number
    ): Promise<TransactionResult> => {
        if (!escrowService || !wallet.publicKey || !wallet.signTransaction) {
            return { success: false, error: 'Wallet not connected' };
        }

        setLoading(true);
        setError(null);

        try {
            const makerPubkey = new PublicKey(makerAddress);

            const result = await escrowService.executeSwap(
                makerPubkey,
                wallet.publicKey,
                inputAmount,
                outputAmount,
                wallet.signTransaction as (tx: Transaction) => Promise<Transaction>
            );

            if (result.success) {
                // Refresh sellers list and balances
                await fetchSellers();
            }

            return result;
        } catch (e) {
            const errorMsg = (e as Error).message;
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    }, [escrowService, wallet.publicKey, wallet.signTransaction, fetchSellers]);

    // Refresh balances
    const refreshBalances = useCallback(async () => {
        if (!escrowService || !wallet.publicKey) return;

        try {
            const [sol, usdc] = await Promise.all([
                escrowService.getSolBalance(wallet.publicKey),
                escrowService.getUsdcBalance(wallet.publicKey),
            ]);
            setSolBalance(sol);
            setUsdcBalance(usdc);
        } catch (e) {
            console.error('Error refreshing balances:', e);
        }
    }, [escrowService, wallet.publicKey]);

    return {
        // State
        sellers,
        loading,
        error,
        solBalance,
        usdcBalance,
        isConnected: !!wallet.publicKey,
        walletAddress: wallet.publicKey?.toString() || null,

        // Actions
        fetchSellers,
        createListing,
        executeSwap,
        refreshBalances,
    };
}
