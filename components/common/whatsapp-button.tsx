'use client'

import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { WHATSAPP_CONFIG } from '@/lib/config/whatsapp'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export function WhatsAppButton({ 
  phoneNumber = WHATSAPP_CONFIG.phoneNumber,
  message = WHATSAPP_CONFIG.defaultMessage,
  className = ''
}: WhatsAppButtonProps) {
  // Formatear número: remover espacios, guiones y el + si está
  const formattedNumber = phoneNumber.replace(/[\s\-+]/g, '')
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        bg-boston-blue hover:bg-calypso
        text-white
        p-4 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        flex items-center justify-center
        group
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Contactar por WhatsApp</span>
      
      {/* Tooltip opcional */}
      <span className="
        absolute right-full mr-3
        bg-gray-900 text-white text-sm
        px-3 py-2 rounded-lg
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        hidden sm:block
      ">
        ¿Necesitas ayuda?
      </span>
    </motion.a>
  )
}

