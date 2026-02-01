"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SellerList } from "@/components/dashboard/seller-list"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />

            <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                {/* Page Title */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Overview</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s your trading overview.
                    </p>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Main Grid */}
                {/* Main Content Stack */}
                <div className="space-y-6">
                    <SellerList />
                    <QuickActions />
                    <ActivityFeed />
                </div>
            </main>
        </div>
    )
}
