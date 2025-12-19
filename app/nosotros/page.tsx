import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Target, Award, Users } from 'lucide-react'
import { NosotrosHero } from '@/components/nosotros/nosotros-hero'
import { NosotrosHistoria } from '@/components/nosotros/nosotros-historia'
import { NosotrosValores } from '@/components/nosotros/nosotros-valores'
import { NosotrosPorQue } from '@/components/nosotros/nosotros-porque'
import { NosotrosEquipo } from '@/components/nosotros/nosotros-equipo'

export const metadata = {
  title: 'Nosotros',
  description: 'Conoce nuestra historia, valores y equipo profesional. Construyendo sueños con calidad, compromiso y excelencia desde 2020.',
  openGraph: {
    title: 'Nosotros - ALCONSTRUCCIONES SRL',
    description: 'Conoce nuestra historia, valores y equipo profesional. Construyendo sueños desde 2020.',
    images: ["/logo.png"],
  },
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
