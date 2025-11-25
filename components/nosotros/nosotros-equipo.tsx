'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

const equipo = [
  { role: 'Ingenieros', description: 'Especialistas en planificación y ejecución de obras' },
  { role: 'Arquitectos', description: 'Diseño y optimización de espacios' },
  { role: 'Maestros Mayores', description: 'Supervisión y control de calidad' },
  { role: 'Oficiales', description: 'Ejecución especializada de trabajos' },
  { role: 'Administrativos', description: 'Gestión y coordinación de proyectos' },
  { role: 'Seguridad', description: 'Prevención y cumplimiento normativo' },
]

export function NosotrosEquipo() {
  return (
    <section className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-calypso" />
            <h2 className="text-3xl font-bold text-calypso">Nuestro Equipo</h2>
          </div>
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestro equipo está formado por profesionales altamente capacitados y con
                amplia experiencia en el sector de la construcción. Cada miembro aporta su
                expertise para garantizar el éxito de cada proyecto.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipo.map((miembro, index) => (
                  <motion.div
                    key={miembro.role}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className="bg-mystic rounded-lg p-6 h-full">
                      <h3 className="text-lg font-semibold text-calypso mb-2">{miembro.role}</h3>
                      <p className="text-sm text-muted-foreground">{miembro.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

