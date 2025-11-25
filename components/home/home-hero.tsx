'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HomeHero() {
  return (
    <section className="relative bg-gradient-to-r from-calypso to-boston-blue dark:from-calypso/90 dark:to-boston-blue/90 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/hero-background.jpg"
          alt=""
          fill
          className="object-cover opacity-50"
          priority
          fetchPriority="high"
          quality={90}
          sizes="100vw"
          onError={(e) => {
            // Si la imagen no existe, ocultar el contenedor
            e.currentTarget.style.display = 'none'
          }}
        />
        {/* Overlay oscuro para mejor legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-calypso/60 to-boston-blue/60 dark:from-calypso/50 dark:to-boston-blue/50"></div>
      </div>
      
      {/* Contenido */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2 drop-shadow-lg">
            ALCONSTRUCCIONES SRL
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-morning-glory mb-6 sm:mb-8 px-4 drop-shadow-md">
            Construyendo sueños con calidad y compromiso
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/obras" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-calypso hover:bg-morning-glory shadow-lg">
                Ver Nuestras Obras
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contacto" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto border-2 border-white text-white bg-white/10 hover:bg-white hover:text-calypso shadow-lg backdrop-blur-sm font-semibold"
              >
                Contáctanos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

