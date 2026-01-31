'use client'

import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero'
import { Footer } from '@/components/footer'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Home() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Enhanced gradient background with more vibrancy
  const gradientStyle = {
    background: theme === 'dark'
      ? 'linear-gradient(135deg, oklch(0.08 0.02 286) 0%, oklch(0.15 0.08 280) 35%, oklch(0.12 0.06 256) 60%, oklch(0.1 0.04 270) 100%)'
      : 'linear-gradient(135deg, oklch(0.98 0.01 286) 0%, oklch(0.94 0.02 286) 50%, oklch(0.92 0.01 286) 100%)',
  }

  return (
    <div style={gradientStyle} className="min-h-screen transition-all duration-300">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  )
}
