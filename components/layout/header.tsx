import Link from 'next/link'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { Logo } from '@/components/layout/logo'
import { AdminLinkClient } from '@/components/admin/admin-link-client'
import { ThemeToggle } from '@/components/layout/theme-toggle'
// import { AdminLinkDebug } from '@/components/admin/admin-link-debug' // Descomentar para debug

export function Header() {
  return (
    <header className="bg-white dark:bg-card border-b sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-1">
            <Logo />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-calypso truncate">ALCONSTRUCCIONES SRL</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Construcción y Obras</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-calypso transition-colors">
              Inicio
            </Link>
            <Link href="/obras" className="text-muted-foreground hover:text-calypso transition-colors">
              Obras
            </Link>
            <Link href="/nosotros" className="text-muted-foreground hover:text-calypso transition-colors">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-muted-foreground hover:text-calypso transition-colors">
              Contacto
            </Link>
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
