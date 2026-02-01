"use client"

import { useState } from "react"
import { Check, Star, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Seller {
    id: string
    name: string
    email: string
    avatar: string
    rating: number
    completedTrades: number
    available: number
    currency: string
    price: number
    minAmount: number
    maxAmount: number
    verified: boolean
    paymentMethods: string[]
}

const sellers: Seller[] = [
    {
        id: "1",
        name: "Alex Morgan",
        email: "alex.m@email.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        rating: 4.9,
        completedTrades: 1523,
        available: 12500,
        currency: "USDT",
        price: 1.02,
        minAmount: 100,
        maxAmount: 5000,
        verified: true,
        paymentMethods: ["Bank Transfer", "PayPal"],
    },
    {
        id: "2",
        name: "Sarah Chen",
        email: "sarah.c@email.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
        rating: 4.8,
        completedTrades: 892,
        available: 8200,
        currency: "USDT",
        price: 1.01,
        minAmount: 50,
        maxAmount: 3000,
        verified: true,
        paymentMethods: ["Bank Transfer", "Wise"],
    },
    {
        id: "3",
        name: "Michael Johnson",
        email: "michael.j@email.com",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
        rating: 4.7,
        completedTrades: 654,
        available: 15000,
        currency: "USDT",
        price: 1.015,
        minAmount: 200,
        maxAmount: 10000,
        verified: true,
        paymentMethods: ["Bank Transfer"],
    },
    {
        id: "4",
        name: "Emily Davis",
        email: "emily.d@email.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
        rating: 4.6,
        completedTrades: 421,
        available: 5500,
        currency: "USDT",
        price: 1.025,
        minAmount: 25,
        maxAmount: 2000,
        verified: false,
        paymentMethods: ["PayPal", "Venmo"],
    },
    {
        id: "5",
        name: "David Kim",
        email: "david.k@email.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        rating: 4.9,
        completedTrades: 2103,
        available: 25000,
        currency: "USDT",
        price: 1.008,
        minAmount: 500,
        maxAmount: 15000,
        verified: true,
        paymentMethods: ["Bank Transfer", "Wise", "PayPal"],
    },
    {
        id: "6",
        name: "Jessica Lee",
        email: "jessica.l@email.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
        rating: 4.5,
        completedTrades: 287,
        available: 3200,
        currency: "USDT",
        price: 1.03,
        minAmount: 50,
        maxAmount: 1500,
        verified: true,
        paymentMethods: ["Venmo"],
    },
]

export function SellerList() {
    const [amounts, setAmounts] = useState<Record<string, string>>({})
    const [expandedSeller, setExpandedSeller] = useState<string | null>(null)

    const handleAmountChange = (sellerId: string, value: string) => {
        setAmounts((prev) => ({ ...prev, [sellerId]: value }))
    }

    const handleBuy = (seller: Seller) => {
        const amount = parseFloat(amounts[seller.id] || "0")
        if (amount >= seller.minAmount && amount <= seller.maxAmount) {
            alert(`Initiating purchase of $${amount} ${seller.currency} from ${seller.name}`)
        }
    }

    const toggleExpand = (sellerId: string) => {
        setExpandedSeller(expandedSeller === sellerId ? null : sellerId)
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                        Available Sellers
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {sellers.length} online
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Seller
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Available
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Limits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Buy Amount
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
                                                <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
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
                                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                                    <span>{seller.rating}</span>
                                                    <span className="mx-1">|</span>
                                                    <span>{seller.completedTrades} trades</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-card-foreground">
                                            ${seller.price.toFixed(3)}
                                        </span>
                                        <span className="text-sm text-muted-foreground ml-1">USD</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-card-foreground">
                                            {seller.available.toLocaleString()} {seller.currency}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-muted-foreground">
                                            ${seller.minAmount} - ${seller.maxAmount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {seller.paymentMethods.slice(0, 2).map((method) => (
                                                <Badge
                                                    key={method}
                                                    variant="outline"
                                                    className="text-xs border-border text-muted-foreground"
                                                >
                                                    {method}
                                                </Badge>
                                            ))}
                                            {seller.paymentMethods.length > 2 && (
                                                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                                                    +{seller.paymentMethods.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                    $
                                                </span>
                                                <Input
                                                    type="number"
                                                    placeholder={seller.minAmount.toString()}
                                                    value={amounts[seller.id] || ""}
                                                    onChange={(e) =>
                                                        handleAmountChange(seller.id, e.target.value)
                                                    }
                                                    className="w-28 pl-7 bg-secondary border-0 text-card-foreground"
                                                    min={seller.minAmount}
                                                    max={seller.maxAmount}
                                                />
                                            </div>
                                            <Button
                                                onClick={() => handleBuy(seller)}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                disabled={
                                                    !amounts[seller.id] ||
                                                    parseFloat(amounts[seller.id]) < seller.minAmount ||
                                                    parseFloat(amounts[seller.id]) > seller.maxAmount
                                                }
                                            >
                                                Buy
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
                                            <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
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
                                                ${seller.price.toFixed(3)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {seller.available.toLocaleString()} {seller.currency}
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
                                            <p className="text-muted-foreground">Trades</p>
                                            <p className="text-card-foreground font-medium">{seller.completedTrades}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Limits</p>
                                            <p className="text-card-foreground font-medium">
                                                ${seller.minAmount} - ${seller.maxAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-2">Payment Methods</p>
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
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                type="number"
                                                placeholder={`Min $${seller.minAmount}`}
                                                value={amounts[seller.id] || ""}
                                                onChange={(e) =>
                                                    handleAmountChange(seller.id, e.target.value)
                                                }
                                                className="pl-7 bg-secondary border-0 text-card-foreground"
                                                min={seller.minAmount}
                                                max={seller.maxAmount}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => handleBuy(seller)}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            disabled={
                                                !amounts[seller.id] ||
                                                parseFloat(amounts[seller.id]) < seller.minAmount ||
                                                parseFloat(amounts[seller.id]) > seller.maxAmount
                                            }
                                        >
                                            Buy
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
