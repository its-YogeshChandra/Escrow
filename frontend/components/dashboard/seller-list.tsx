"use client"

import { useState } from "react"
import { Star, Shield, ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEscrow } from "@/hooks/use-escrow"
import { Seller } from "@/lib/escrow/types"

// No mock sellers - only show real on-chain data
// When no escrows exist, show empty state

export function SellerList() {
    const { sellers, loading, error, isConnected, executeSwap, fetchSellers, usdcBalance } = useEscrow()
    const [amounts, setAmounts] = useState<Record<string, string>>({})
    const [expandedSeller, setExpandedSeller] = useState<string | null>(null)
    const [processingSwap, setProcessingSwap] = useState<string | null>(null)

    const handleAmountChange = (sellerId: string, value: string) => {
        setAmounts((prev) => ({ ...prev, [sellerId]: value }))
    }

    const handleBuy = async (seller: Seller) => {
        const solAmount = parseFloat(amounts[seller.id] || "0")

        if (solAmount < seller.minAmount || solAmount > seller.maxAmount) {
            alert(`Amount must be between ${seller.minAmount} and ${seller.maxAmount} SOL`)
            return
        }

        if (!isConnected) {
            alert('Please connect your wallet first')
            return
        }

        // Calculate USDC cost based on price
        const usdcCost = solAmount * seller.price

        if (usdcCost > usdcBalance) {
            alert(`Insufficient USDC balance. You need ${usdcCost.toFixed(2)} USDC but only have ${usdcBalance.toFixed(2)} USDC`)
            return
        }

        setProcessingSwap(seller.id)

        try {
            const result = await executeSwap(seller.walletAddress, usdcCost, solAmount)

            if (result.success) {
                alert(`Successfully purchased ${solAmount} SOL for ${usdcCost.toFixed(2)} USDC!\nTransaction: ${result.signature}`)
                setAmounts((prev) => ({ ...prev, [seller.id]: "" }))
            } else {
                alert(`Swap failed: ${result.error}`)
            }
        } catch (e) {
            alert(`Error: ${(e as Error).message}`)
        } finally {
            setProcessingSwap(null)
        }
    }

    const toggleExpand = (sellerId: string) => {
        setExpandedSeller(expandedSeller === sellerId ? null : sellerId)
    }

    const formatWalletAddress = (address: string) => {
        if (address.length > 12) {
            return `${address.slice(0, 4)}...${address.slice(-4)}`
        }
        return address
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                        Available Sellers (SOL → USDC)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={fetchSellers}
                            disabled={loading}
                            className="h-8 w-8"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            {sellers.length} listing{sellers.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>
                {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                )}
                {!isConnected && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Connect your wallet to trade
                    </p>
                )}
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : sellers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <p className="text-muted-foreground mb-2">No sellers available</p>
                        <p className="text-sm text-muted-foreground">
                            Be the first to list your SOL for sale using Quick Actions!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Price (USDC/SOL)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Available
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Limits
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Buy SOL
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {sellers.map((seller) => (
                                        <tr
                                            key={seller.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-primary/20 text-primary">
                                                            {seller.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-card-foreground">
                                                                {seller.name}
                                                            </span>
                                                            {seller.verified && (
                                                                <Shield className="h-4 w-4 text-primary" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <span className="font-mono text-xs">
                                                                {formatWalletAddress(seller.walletAddress)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-card-foreground">
                                                    ${seller.price.toFixed(2)}
                                                </span>
                                                <span className="text-sm text-muted-foreground ml-1">USDC</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-card-foreground">
                                                    {seller.available.toFixed(4)} {seller.currency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {seller.minAmount} - {seller.maxAmount.toFixed(2)} SOL
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder={seller.minAmount.toString()}
                                                            value={amounts[seller.id] || ""}
                                                            onChange={(e) =>
                                                                handleAmountChange(seller.id, e.target.value)
                                                            }
                                                            className="w-28 bg-secondary border-0 text-card-foreground"
                                                            min={seller.minAmount}
                                                            max={seller.maxAmount}
                                                            step="0.01"
                                                            disabled={!isConnected || processingSwap === seller.id}
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() => handleBuy(seller)}
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                        disabled={
                                                            !isConnected ||
                                                            !amounts[seller.id] ||
                                                            parseFloat(amounts[seller.id]) < seller.minAmount ||
                                                            parseFloat(amounts[seller.id]) > seller.maxAmount ||
                                                            processingSwap === seller.id
                                                        }
                                                    >
                                                        {processingSwap === seller.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Buy'
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-border">
                            {sellers.map((seller) => (
                                <div key={seller.id} className="p-4">
                                    <button
                                        onClick={() => toggleExpand(seller.id)}
                                        className="w-full"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/20 text-primary">
                                                        {seller.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-card-foreground">
                                                            {seller.name}
                                                        </span>
                                                        {seller.verified && (
                                                            <Shield className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="h-3 w-3 fill-primary text-primary" />
                                                        <span>{seller.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <p className="font-semibold text-card-foreground">
                                                        ${seller.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {seller.available.toFixed(4)} {seller.currency}
                                                    </p>
                                                </div>
                                                {expandedSeller === seller.id ? (
                                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {expandedSeller === seller.id && (
                                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Wallet</p>
                                                    <p className="text-card-foreground font-mono text-xs">
                                                        {formatWalletAddress(seller.walletAddress)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Limits</p>
                                                    <p className="text-card-foreground font-medium">
                                                        {seller.minAmount} - {seller.maxAmount.toFixed(2)} SOL
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-sm mb-2">Payment</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {seller.paymentMethods.map((method) => (
                                                        <Badge
                                                            key={method}
                                                            variant="outline"
                                                            className="text-xs border-border text-muted-foreground"
                                                        >
                                                            {method}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        type="number"
                                                        placeholder={`Min ${seller.minAmount} SOL`}
                                                        value={amounts[seller.id] || ""}
                                                        onChange={(e) =>
                                                            handleAmountChange(seller.id, e.target.value)
                                                        }
                                                        className="bg-secondary border-0 text-card-foreground"
                                                        min={seller.minAmount}
                                                        max={seller.maxAmount}
                                                        step="0.01"
                                                        disabled={!isConnected || processingSwap === seller.id}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => handleBuy(seller)}
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                    disabled={
                                                        !isConnected ||
                                                        !amounts[seller.id] ||
                                                        parseFloat(amounts[seller.id]) < seller.minAmount ||
                                                        parseFloat(amounts[seller.id]) > seller.maxAmount ||
                                                        processingSwap === seller.id
                                                    }
                                                >
                                                    {processingSwap === seller.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        'Buy'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
