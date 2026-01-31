'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/60 to-background/20 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent via-primary to-primary/60 flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg font-heading">P</span>
          </div>
          <span className="font-bold text-xl text-foreground font-heading tracking-tight">P2P</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-12 items-center">
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">Home</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">Solutions</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">Pricing</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">Resources</a>
        </nav>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full text-foreground/60 hover:text-primary"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-full px-6 font-semibold shadow-lg hover:shadow-xl transition-all">
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  )
}
