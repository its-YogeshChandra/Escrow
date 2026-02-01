"use client"

import { Wallet, Users, DollarSign, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEscrow } from "@/hooks/use-escrow"

export function StatsCards() {
    const { solBalance, usdcBalance, sellers, isConnected } = useEscrow()

    // Calculate total available SOL from all sellers
    const totalAvailableSOL = sellers.reduce((sum, seller) => sum + seller.available, 0)

    const stats = [
        {
            title: "Your SOL Balance",
            value: isConnected ? `${solBalance.toFixed(4)} SOL` : "-- SOL",
            icon: Wallet,
        },
        {
            title: "Your USDC Balance",
            value: isConnected ? `$${usdcBalance.toFixed(2)}` : "$--",
            icon: DollarSign,
        },
        {
            title: "Active Sellers",
            value: sellers.length.toString(),
            icon: Users,
        },
        {
            title: "Available to Buy",
            value: `${totalAvailableSOL.toFixed(2)} SOL`,
            icon: ArrowUpRight,
        },
    ]

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-card border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
