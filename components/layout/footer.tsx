'use client'

import { Facebook, Instagram, Mail, MapPin, Phone, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-calypso to-boston-blue dark:from-calypso/95 dark:to-boston-blue/95 text-white mt-auto">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-8">
          {/* Información de la Empresa con Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-morning-glory" />
              <h3 className="text-xl font-bold">ALCONSTRUCCIONES SRL</h3>
            </div>
            <p className="text-morning-glory/90 text-sm mb-4 leading-relaxed">
              Construyendo sueños con calidad, compromiso y excelencia desde 2020.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://facebook.com/alconstrucciones"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-all backdrop-blur-sm"
                aria-label="Facebook"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/alconstrucciones"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-all backdrop-blur-sm"
                aria-label="Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-morning-glory">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="h-5 w-5 text-morning-glory flex-shrink-0 mt-0.5" />
                <span>Ezeiza, Pcia de Bs As, Argentina</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone className="h-5 w-5 text-morning-glory flex-shrink-0" />
                <a href="tel:+541168653696" className="hover:text-white transition-colors">
                  011 6865-3696
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Mail className="h-5 w-5 text-morning-glory flex-shrink-0" />
                <a href="mailto:contacto.alconstrucciones@gmail.com" className="hover:text-white transition-colors">
                  contacto.alconstrucciones@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-morning-glory/80">
            <p>
              &copy; {currentYear} ALCONSTRUCCIONES SRL. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1">
              Desarrollado por{' '}
              <a
                href="https://botoncreativo.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-morning-glory hover:text-white transition-colors font-medium"
              >
                Botón Creativo
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
