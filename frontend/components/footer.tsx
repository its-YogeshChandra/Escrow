'use client'

import { Github, Linkedin, Twitter, MessageCircle, Instagram } from 'lucide-react'

export function Footer() {
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
  ]

  return (
    <footer className="border-t border-border/40 bg-gradient-to-t from-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Copyright */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-heading">P</span>
              </div>
              <span className="font-bold text-lg text-foreground font-heading">P2P</span>
            </div>
            <p className="text-sm text-foreground/60">
              © 2026 P2P Protocol. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 items-center">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/30 flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-200 border border-primary/20 hover:border-primary/40"
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
