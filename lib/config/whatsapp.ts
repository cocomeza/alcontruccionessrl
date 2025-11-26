/**
 * Configuración de WhatsApp
 * 
 * Actualiza estos valores con tu número de WhatsApp real y mensaje personalizado.
 * El número debe incluir el código de país (ej: +54 para Argentina)
 */

export const WHATSAPP_CONFIG = {
  // Número de WhatsApp con código de país
  // Ejemplo para Argentina: +5491123456789
  // Ejemplo para otros países: +1234567890
  phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+5491123456789',
  
  // Mensaje predeterminado que aparecerá al abrir WhatsApp
  defaultMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 
    'Hola, me interesa conocer más sobre sus servicios de construcción.',
}

