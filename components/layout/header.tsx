'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { Logo } from '@/components/layout/logo'
import { AdminLinkClient } from '@/components/admin/admin-link-client'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

// import { AdminLinkDebug } from '@/components/admin/admin-link-debug' // Descomentar para debug

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/obras', label: 'Obras' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 relative shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-2 min-w-0 flex-1 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-calypso truncate group-hover:text-boston-blue transition-colors">
                ALCONSTRUCCIONES SRL
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Construcción y Obras</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-calypso"
                      : "text-muted-foreground hover:text-calypso"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-calypso/10 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ThemeToggle />
            <AdminLinkClient />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
