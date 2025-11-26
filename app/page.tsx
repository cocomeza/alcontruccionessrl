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
  // Filtrar solo las obras destacadas y mostrar máximo 6
  const obrasDestacadas = obras.filter(obra => obra.featured === true).slice(0, 6)

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
