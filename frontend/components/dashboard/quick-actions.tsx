"use client"

import { useState } from "react"
import { Plus, Loader2, Wallet, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEscrow } from "@/hooks/use-escrow"

export function QuickActions() {
    const { isConnected, solBalance, usdcBalance, createListing, refreshBalances } = useEscrow()
    const [listAmount, setListAmount] = useState("")
    const [isListing, setIsListing] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleCreateListing = async () => {
        const amount = parseFloat(listAmount)
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount")
            return
        }

        if (amount > solBalance) {
            alert(`Insufficient SOL balance. You have ${solBalance.toFixed(4)} SOL`)
            return
        }

        setIsListing(true)
        try {
            const result = await createListing(amount)
            if (result.success) {
                alert(`Successfully listed ${amount} SOL for sale!\nTransaction: ${result.signature}`)
                setListAmount("")
                setDialogOpen(false)
                refreshBalances()
            } else {
                alert(`Failed to create listing: ${result.error}`)
            }
        } catch (e) {
            alert(`Error: ${(e as Error).message}`)
        } finally {
            setIsListing(false)
        }
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Balances Display */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Wallet className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">SOL Balance</p>
                            <p className="font-semibold text-card-foreground">
                                {isConnected ? solBalance.toFixed(4) : '--'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">USDC Balance</p>
                            <p className="font-semibold text-card-foreground">
                                {isConnected ? usdcBalance.toFixed(2) : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-3">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-auto flex gap-3 p-4 bg-secondary border-0 hover:bg-primary/10 hover:text-primary justify-start"
                                disabled={!isConnected}
                            >
                                <Plus className="h-5 w-5" />
                                <div className="text-left">
                                    <p className="font-medium text-sm">List SOL for Sale</p>
                                    <p className="text-xs text-muted-foreground">Sell your SOL for USDC</p>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create SOL Listing</DialogTitle>
                                <DialogDescription>
                                    Deposit SOL into escrow to sell it for USDC. Buyers can purchase your SOL using USDC.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (SOL)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={listAmount}
                                        onChange={(e) => setListAmount(e.target.value)}
                                        step="0.01"
                                        min="0.01"
                                        max={solBalance}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Available: {solBalance.toFixed(4)} SOL
                                    </p>
                                </div>
                                <Button
                                    onClick={handleCreateListing}
                                    disabled={isListing || !listAmount || parseFloat(listAmount) <= 0}
                                    className="w-full"
                                >
                                    {isListing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Listing...
                                        </>
                                    ) : (
                                        'Create Listing'
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {!isConnected && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                        Connect your wallet to use quick actions
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
