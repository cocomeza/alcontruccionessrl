'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Mail, Phone } from 'lucide-react'

export function ContactHero() {
  return (
    <section className="relative bg-gradient-to-br from-calypso via-boston-blue to-calypso dark:from-calypso/95 dark:via-boston-blue/95 dark:to-calypso/95 text-white py-20 sm:py-24 overflow-hidden">
      {/* Efectos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-morning-glory/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6"
          >
            <MessageCircle className="h-10 w-10" />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Contáctanos
          </h1>
          <p className="text-xl sm:text-2xl text-morning-glory/90 mb-8 leading-relaxed">
            Estamos aquí para ayudarte a hacer realidad tu próximo proyecto de construcción
          </p>

          {/* Información rápida */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <motion.a
              href="mailto:contacto.alconstrucciones@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm sm:text-base">Email</span>
            </motion.a>
            <motion.a
              href="tel:+5491123456789"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all"
            >
              <Phone className="h-5 w-5" />
              <span className="text-sm sm:text-base">Llamar</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

