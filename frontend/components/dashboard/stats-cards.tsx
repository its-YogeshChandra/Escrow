"use client"

import { TrendingUp, TrendingDown, DollarSign, Users, ArrowUpRight, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
    {
        title: "Total Balance",
        value: "$24,521.00",
        change: "+12.5%",
        trend: "up",
        icon: Wallet,
    },
    {
        title: "Active Sellers",
        value: "1,284",
        change: "+8.2%",
        trend: "up",
        icon: Users,
    },
    {
        title: "Today's Volume",
        value: "$89,420",
        change: "+23.1%",
        trend: "up",
        icon: DollarSign,
    },
    {
        title: "Completed Trades",
        value: "342",
        change: "-2.4%",
        trend: "down",
        icon: ArrowUpRight,
    },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-card border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div
                                className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-primary" : "text-destructive"
                                    }`}
                            >
                                {stat.trend === "up" ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : (
                                    <TrendingDown className="h-4 w-4" />
                                )}
                                {stat.change}
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
