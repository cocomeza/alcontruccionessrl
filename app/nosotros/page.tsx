import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Target, Award, Users } from 'lucide-react'
import { NosotrosHero } from '@/components/nosotros-hero'
import { NosotrosHistoria } from '@/components/nosotros-historia'
import { NosotrosValores } from '@/components/nosotros-valores'
import { NosotrosPorQue } from '@/components/nosotros-porque'
import { NosotrosEquipo } from '@/components/nosotros-equipo'

export const metadata = {
  title: 'Nosotros - ALCONSTRUCCIONES SRL',
  description: 'Conoce nuestra historia, valores y equipo profesional',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <NosotrosHero />

        <NosotrosHistoria />

        <NosotrosValores />

        <NosotrosPorQue />

        <NosotrosEquipo />
      </main>
      <Footer />
    </div>
  )
}
