'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Award } from 'lucide-react'

const razones = [
  {
    title: 'Experiencia Comprobada',
    description: 'Años de experiencia en el mercado con un portafolio de proyectos exitosos que habla por sí solo.',
  },
  {
    title: 'Equipo Profesional',
    description: 'Contamos con un equipo altamente capacitado y comprometido con la excelencia en cada proyecto.',
  },
  {
    title: 'Materiales de Primera',
    description: 'Utilizamos solo materiales de la más alta calidad, garantizando durabilidad y resistencia.',
  },
  {
    title: 'Cumplimiento de Plazos',
    description: 'Nos comprometemos a entregar cada proyecto en tiempo y forma, respetando los acuerdos establecidos.',
  },
  {
    title: 'Precios Competitivos',
    description: 'Ofrecemos la mejor relación calidad-precio del mercado, sin comprometer la excelencia.',
  },
  {
    title: 'Atención Personalizada',
    description: 'Cada cliente es único para nosotros. Brindamos atención personalizada y seguimiento constante.',
  },
]

export function NosotrosPorQue() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Award className="h-8 w-8 text-calypso" />
            <h2 className="text-3xl font-bold text-calypso">¿Por Qué Elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {razones.map((razon, index) => (
              <motion.div
                key={razon.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-calypso mb-3">{razon.title}</h3>
                    <p className="text-muted-foreground">{razon.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

