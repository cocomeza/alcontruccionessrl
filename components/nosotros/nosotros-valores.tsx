'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Target } from 'lucide-react'

const valores = [
  {
    title: 'Calidad',
    description: 'Nos comprometemos a entregar obras de la más alta calidad, utilizando materiales premium y técnicas probadas.',
  },
  {
    title: 'Integridad',
    description: 'Actuamos con honestidad y transparencia en cada proyecto, cumpliendo siempre con nuestros compromisos.',
  },
  {
    title: 'Innovación',
    description: 'Incorporamos nuevas tecnologías y métodos para mejorar continuamente nuestros procesos constructivos.',
  },
  {
    title: 'Compromiso',
    description: 'Nos dedicamos completamente a cada proyecto, asegurando que se complete a tiempo y dentro del presupuesto.',
  },
  {
    title: 'Respeto',
    description: 'Valoramos a nuestros clientes, colaboradores y el medio ambiente en cada decisión que tomamos.',
  },
  {
    title: 'Excelencia',
    description: 'Buscamos la perfección en cada detalle, desde la planificación hasta la entrega final del proyecto.',
  },
]

export function NosotrosValores() {
  return (
    <section className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="h-8 w-8 text-calypso" />
            <h2 className="text-3xl font-bold text-calypso">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-calypso mb-3 text-center">{valor.title}</h3>
                    <p className="text-muted-foreground">{valor.description}</p>
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

