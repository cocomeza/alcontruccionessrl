'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SeccionesRapidas() {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center p-4 sm:p-6 md:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-calypso mb-3 sm:mb-4">Sobre Nosotros</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Conoce nuestra historia, valores y el equipo profesional que hace posible cada proyecto.
            </p>
            <Link href="/nosotros">
              <Button variant="outline" className="w-full sm:w-auto">Saber Más</Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center p-4 sm:p-6 md:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-calypso mb-3 sm:mb-4">Contáctanos</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              ¿Tienes un proyecto en mente? Estamos aquí para ayudarte a hacerlo realidad.
            </p>
            <Link href="/contacto">
              <Button className="w-full sm:w-auto">Contactar</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

