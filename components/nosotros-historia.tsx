'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export function NosotrosHistoria() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-calypso" />
            <h2 className="text-3xl font-bold text-calypso">Nuestra Historia</h2>
          </div>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                ALCONSTRUCCIONES SRL nació con la visión de transformar espacios y construir
                proyectos que perduren en el tiempo. Desde nuestros inicios, nos hemos
                especializado en obras de construcción de alta calidad, combinando experiencia
                técnica con innovación constante.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A lo largo de los años, hemos completado numerosos proyectos exitosos que
                reflejan nuestro compromiso con la excelencia y la satisfacción del cliente.
                Cada obra es un testimonio de nuestra dedicación y profesionalismo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoy, seguimos creciendo y mejorando, siempre con el objetivo de superar las
                expectativas y construir relaciones duraderas basadas en la confianza y el
                trabajo bien hecho.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

