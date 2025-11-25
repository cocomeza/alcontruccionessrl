'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, Clock, Phone } from 'lucide-react'

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-calypso mb-6">Información de Contacto</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-boston-blue mt-1" />
              <div>
                <h3 className="font-semibold text-calypso mb-1">Email</h3>
                <a href="mailto:contacto@alconstrucciones.com" className="text-muted-foreground hover:text-boston-blue transition-colors">
                  contacto@alconstrucciones.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-boston-blue mt-1" />
              <div>
                <h3 className="font-semibold text-calypso mb-1">Teléfono</h3>
                <a href="tel:+5491123456789" className="text-muted-foreground hover:text-boston-blue transition-colors">
                  +54 9 11 2345-6789
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-boston-blue mt-1" />
              <div>
                <h3 className="font-semibold text-calypso mb-1">Ubicación</h3>
                <p className="text-muted-foreground">
                  Buenos Aires, Argentina
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-boston-blue mt-1" />
              <div>
                <h3 className="font-semibold text-calypso mb-1">Horarios</h3>
                <div className="text-muted-foreground space-y-1">
                  <p>Lunes - Viernes: 8:00 - 18:00</p>
                  <p>Sábados: 9:00 - 13:00</p>
                  <p>Domingos: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </motion.div>
  )
}

