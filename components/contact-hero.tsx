'use client'

import { motion } from 'framer-motion'

export function ContactHero() {
  return (
    <section className="bg-gradient-to-r from-calypso to-boston-blue dark:from-calypso/90 dark:to-boston-blue/90 text-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-morning-glory">
            Estamos aquí para ayudarte con tu próximo proyecto
          </p>
        </motion.div>
      </div>
    </section>
  )
}

