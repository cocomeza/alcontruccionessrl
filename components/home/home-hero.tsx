'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2, Award, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export function HomeHero() {
  return (
    <section className="relative bg-gradient-to-br from-calypso via-boston-blue to-calypso dark:from-calypso/95 dark:via-boston-blue/95 dark:to-calypso/95 text-white py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Imagen de fondo con efecto parallax */}
      <div className="absolute inset-0">
        <Image
          src="/hero-background.jpg"
          alt="Obras de construcción de ALCONSTRUCCIONES SRL"
          fill
          className="object-cover opacity-30 dark:opacity-20"
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        {/* Overlay con gradiente mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-calypso/80 via-boston-blue/70 to-calypso/80 dark:from-calypso/70 dark:via-boston-blue/60 dark:to-calypso/70"></div>
        {/* Efecto de partículas decorativas */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-morning-glory/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-morning-glory/40 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
              <Award className="h-4 w-4" />
              Construcción de Calidad desde 2020
            </span>
          </motion.div>

          {/* Título principal con animación */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 px-2 drop-shadow-2xl leading-tight"
          >
            <span className="block">ALCONSTRUCCIONES</span>
            <span className="block text-morning-glory">SRL</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-morning-glory/90 mb-8 sm:mb-10 px-4 drop-shadow-lg font-light max-w-2xl mx-auto"
          >
            Construyendo sueños con calidad, compromiso y excelencia
          </motion.p>

          {/* Estadísticas rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-morning-glory" />
              <div className="text-2xl sm:text-3xl font-bold">30</div>
              <div className="text-xs sm:text-sm text-morning-glory/80">Proyectos</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-morning-glory" />
              <div className="text-2xl sm:text-3xl font-bold">5+</div>
              <div className="text-xs sm:text-sm text-morning-glory/80">Años</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-morning-glory" />
              <div className="text-2xl sm:text-3xl font-bold">100%</div>
              <div className="text-xs sm:text-sm text-morning-glory/80">Satisfacción</div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <Link href="/obras" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-calypso hover:bg-morning-glory hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg px-8 py-6"
              >
                Ver Nuestras Obras
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contacto" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                className="w-full sm:w-auto border-2 border-white text-white bg-white/10 hover:bg-white hover:text-calypso shadow-xl hover:shadow-2xl backdrop-blur-md font-semibold text-base sm:text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300"
              >
                Contáctanos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

