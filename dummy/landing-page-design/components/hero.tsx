'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-accent/10 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 flex items-center min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[900px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-stretch w-full">
          {/* Left Column - Text Content */}
          <div className="flex flex-col gap-6 lg:gap-8 max-w-xl xl:max-w-2xl">
            {/* New Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">New</span>
              <span className="text-sm text-primary/70">Introducing the next evolution</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-foreground leading-tight mb-4 lg:mb-6 text-pretty font-heading">
                Build on
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  decentralized protocol
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-lg xl:text-xl text-foreground/70 leading-relaxed max-w-md lg:max-w-lg font-medium">
                Power your next-generation NFT, GameFi, and metaverse projects with our cutting-edge blockchain solutions.
              </p>
            </div>

            {/* Secondary Description */}
            <div className="pt-2 lg:pt-4">
              <p className="text-sm sm:text-base lg:text-base xl:text-lg text-foreground/60 leading-relaxed max-w-lg">
                Experience seamless integration, advanced security, and unparalleled scalability for Web3 applications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-6 text-base rounded-full flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all">
                Schedule demo
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-8 py-6 text-base rounded-full border-border/50 hover:bg-foreground/5 bg-transparent text-foreground font-semibold">
                Get Started
              </Button>
            </div>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <div className="relative w-full h-80 sm:h-96 md:h-[450px] lg:h-[520px] xl:h-[600px] 2xl:h-[700px]">
              {/* Background gradient effect */}
              <div className="absolute -inset-12 lg:-inset-16 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 blur-3xl opacity-60" />

              {/* Main dark card container */}
              <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-card/50 to-card/80 border border-primary/30 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

                {/* Animated gradient border effect */}
                <div className="absolute inset-0 border border-gradient-to-r from-primary/40 via-accent/40 to-primary/30" />
              </div>

              {/* Image Content Area - Empty placeholder */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-center p-8 lg:p-12 flex flex-col items-center justify-center h-full">
                  {/* Empty space for user's image */}
                  <img
                    src={"../public/Gemini_Generated_Image_gwkbfygwkbfygwkb.png"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
