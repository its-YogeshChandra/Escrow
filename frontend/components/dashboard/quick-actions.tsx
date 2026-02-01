"use client"

import { ArrowDownLeft, ArrowUpRight, RefreshCw, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
    {
        icon: ArrowDownLeft,
        label: "Deposit",
        description: "Add funds to wallet",
    },
    {
        icon: ArrowUpRight,
        label: "Withdraw",
        description: "Transfer to bank",
    },
    {
        icon: RefreshCw,
        label: "Exchange",
        description: "Convert currencies",
    },
    {
        icon: Plus,
        label: "New Trade",
        description: "Start P2P trade",
    },
]

export function QuickActions() {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="h-auto flex-col gap-2 p-4 bg-secondary border-0 hover:bg-primary/10 hover:text-primary"
                        >
                            <action.icon className="h-5 w-5" />
                            <div className="text-center">
                                <p className="font-medium text-sm">{action.label}</p>
                                <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
