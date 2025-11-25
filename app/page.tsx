import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getObras } from '@/lib/actions/obras'
import { HomeHero } from '@/components/home/home-hero'
import { ObrasDestacadas } from '@/components/obra/obras-destacadas'
import { SeccionesRapidas } from '@/components/home/secciones-rapidas'

export const metadata = {
  title: "ALCONSTRUCCIONES SRL - Inicio",
  description: "Portfolio de obras de construcción de ALCONSTRUCCIONES SRL",
};

export default async function HomePage() {
  const obras = await getObras()
  const obrasDestacadas = obras.slice(0, 3) // Mostrar solo las 3 primeras

  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <HomeHero />

        {obrasDestacadas.length > 0 && (
          <ObrasDestacadas obras={obrasDestacadas} />
        )}

        <SeccionesRapidas />
      </main>
      <Footer />
    </div>
  )
}
