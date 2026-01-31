import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Github, Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight border-2 border-primary/20 px-4 py-1.5 rounded-lg backdrop-blur-sm">
          Logo
        </div>

        <nav className="hidden md:flex gap-4">
          <div className="w-24 h-8 border border-border rounded-md bg-background/50 backdrop-blur-sm" />
          <div className="w-24 h-8 border border-border rounded-md bg-background/50 backdrop-blur-sm" />
          <div className="w-24 h-8 border border-border rounded-md bg-background/50 backdrop-blur-sm" />
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" className="rounded-xl border-2 font-semibold">
            Launch app
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Tagline */}
          <div className="border border-border rounded-3xl p-8 bg-card/60 backdrop-blur-md shadow-sm">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
              big tagline for the the p2p application
            </h1>
          </div>

          {/* Some text */}
          <div className="border border-border rounded-2xl p-6 bg-card/40 backdrop-blur-sm">
            <p className="text-lg text-muted-foreground font-medium">some text</p>
          </div>

          {/* Some text again - Bigger box */}
          <div className="border border-border rounded-2xl p-8 bg-card/40 backdrop-blur-sm flex-1 min-h-[200px]">
            <p className="text-lg text-muted-foreground font-medium">some text again</p>
          </div>
        </div>

        {/* Right Column - Image Section */}
        <div className="lg:col-span-7">
          <div className="h-full min-h-[500px] w-full border border-border rounded-3xl bg-secondary/30 backdrop-blur-md flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
            <span className="text-muted-foreground/50 text-xl font-medium relative z-10 transition-transform duration-500 group-hover:scale-110">
              image section
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-auto">
        <div className="border-t border-border pt-8 flex flex-col lg:flex-row gap-8">
          {/* Big Footer Box */}
          <div className="flex-1 border border-border rounded-2xl h-32 bg-card/40 backdrop-blur-sm" />

          {/* Social Links */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            <div className="grid grid-cols-1 gap-2 text-muted-foreground font-medium">
              <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" /> Instagram
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" /> Twitter
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" /> Discord
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </Link>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-semibold">
              <span className="text-primary">with logo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
