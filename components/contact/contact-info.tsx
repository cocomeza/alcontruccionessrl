'use client'

import { ScrollAnimation } from '@/components/common/scroll-animation'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, Clock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const contactItems = [
  {
    icon: Mail,
    title: 'Email',
    content: 'contacto.alconstrucciones@gmail.com',
    href: 'mailto:contacto.alconstrucciones@gmail.com',
    color: 'text-boston-blue',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    content: '011 6865-3696',
    href: 'tel:+541168653696',
    color: 'text-boston-blue',
  },
  {
    icon: MapPin,
    title: 'Ubicación',
    content: 'Ezeiza, Pcia de Bs As, Argentina',
    href: null,
    color: 'text-boston-blue',
  },
  {
    icon: Clock,
    title: 'Horarios',
    content: (
      <div className="space-y-1">
        <p>Lunes - Viernes: 8:00 - 18:00</p>
        <p>Sábados: 9:00 - 13:00</p>
        <p>Domingos: Cerrado</p>
      </div>
    ),
    href: null,
    color: 'text-boston-blue',
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <ScrollAnimation direction="left" delay={0.1}>
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-calypso mb-8">Información de Contacto</h2>
            
            <div className="space-y-6">
              {contactItems.map((item, index) => {
                const Icon = item.icon
                const Component = item.href ? motion.a : motion.div
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <Component
                      href={item.href || undefined}
                      className={`flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors ${item.href ? 'cursor-pointer' : ''}`}
                    >
                      <div className={`p-3 bg-${item.color.replace('text-', '')}/10 rounded-lg flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-calypso mb-1.5 text-base">{item.title}</h3>
                        {typeof item.content === 'string' ? (
                          <p className="text-muted-foreground hover:text-boston-blue transition-colors text-sm sm:text-base">
                            {item.content}
                          </p>
                        ) : (
                          <div className="text-muted-foreground text-sm sm:text-base">
                            {item.content}
                          </div>
                        )}
                      </div>
                    </Component>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Mapa */}
      <Card className="mx-2 sm:mx-0">
        <CardContent className="p-0">
          <div className="h-48 sm:h-56 md:h-64 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276843!2d-58.3815701!3d-34.6037389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccd4c1c1b1b1b%3A0x1c1b1b1b1b1b1b1b!2sBuenos%20Aires%2C%20CABA%2C%20Argentina!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Ubicación de ALCONSTRUCCIONES SRL"
            />
          </div>
          <div className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              📍 Actualiza las coordenadas del mapa en el código con tu ubicación real
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

