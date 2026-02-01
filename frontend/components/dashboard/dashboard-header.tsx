"use client"

import Link from "next/link"
import { Search, Wallet, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground hidden sm:block">P2P Exchange</span>
                </div>
                <div className="relative hidden md:block ml-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search sellers..."
                        className="w-64 pl-9 bg-secondary border-0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Home</span>
                    </Button>
                </Link>
                <ThemeToggle />
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all">
                    Connect Wallet
                </Button>
            </div>
        </header>
    )
}
