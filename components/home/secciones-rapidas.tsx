'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollAnimation } from '@/components/common/scroll-animation'
import { Building2, MessageCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function SeccionesRapidas() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-mystic/30 dark:from-card dark:to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <ScrollAnimation direction="left" delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative bg-white dark:bg-card rounded-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-calypso/10 rounded-lg group-hover:bg-calypso group-hover:scale-110 transition-all duration-300">
                  <Building2 className="h-6 w-6 text-calypso group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-calypso">Sobre Nosotros</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                Conoce nuestra historia, valores y el equipo profesional que hace posible cada proyecto. Construyendo con excelencia desde 2020.
              </p>
              <Link href="/nosotros">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto group/btn border-calypso/20 hover:bg-calypso hover:text-white hover:border-calypso transition-all duration-300"
                >
                  Saber Más
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </ScrollAnimation>

          <ScrollAnimation direction="right" delay={0.2}>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative bg-gradient-to-br from-calypso to-boston-blue rounded-xl p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 text-white group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">Contáctanos</h3>
              </div>
              <p className="text-white/90 mb-6 leading-relaxed text-base">
                ¿Tienes un proyecto en mente? Estamos aquí para ayudarte a hacerlo realidad. Contáctanos y comencemos a construir juntos.
              </p>
              <Link href="/contacto">
                <Button 
                  className="w-full sm:w-auto bg-white text-calypso hover:bg-morning-glory hover:text-white transition-all duration-300 group/btn"
                >
                  Contactar
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}

