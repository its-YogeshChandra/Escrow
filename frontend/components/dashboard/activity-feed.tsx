"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
    {
        id: "1",
        type: "trade",
        message: "Trade completed with Alex Morgan",
        amount: "+$1,250 USDT",
        time: "2 min ago",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        status: "success",
    },
    {
        id: "2",
        type: "deposit",
        message: "Deposit received",
        amount: "+$500.00",
        time: "15 min ago",
        status: "success",
    },
    {
        id: "3",
        type: "trade",
        message: "Trade initiated with Sarah Chen",
        amount: "$800 USDT",
        time: "1 hour ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
        status: "pending",
    },
    {
        id: "4",
        type: "withdrawal",
        message: "Withdrawal processed",
        amount: "-$2,000.00",
        time: "3 hours ago",
        status: "success",
    },
    {
        id: "5",
        type: "trade",
        message: "Trade completed with David Kim",
        amount: "+$3,500 USDT",
        time: "5 hours ago",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        status: "success",
    },
]

export function ActivityFeed() {
    return (
        <Card className="bg-card border-border h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                        {activity.avatar ? (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt="User" />
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-card-foreground truncate">{activity.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`text-sm font-medium ${activity.amount.startsWith("+")
                                            ? "text-primary"
                                            : activity.amount.startsWith("-")
                                                ? "text-destructive"
                                                : "text-muted-foreground"
                                        }`}
                                >
                                    {activity.amount}
                                </span>
                                <Badge
                                    variant={activity.status === "success" ? "default" : "secondary"}
                                    className={`text-xs ${activity.status === "success"
                                            ? "bg-primary/10 text-primary border-0"
                                            : "bg-secondary text-muted-foreground border-0"
                                        }`}
                                >
                                    {activity.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
