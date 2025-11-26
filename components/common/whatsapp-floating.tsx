'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppButton } from './whatsapp-button'

interface WhatsAppFloatingProps {
  phoneNumber?: string
  message?: string
}

export function WhatsAppFloating({ phoneNumber, message }: WhatsAppFloatingProps) {
  const pathname = usePathname()
  
  // No mostrar en rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return <WhatsAppButton phoneNumber={phoneNumber} message={message} />
}

