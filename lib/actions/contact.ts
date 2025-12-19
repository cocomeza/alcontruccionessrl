'use server'

// Usando Resend para envío de emails (gratis hasta 100 emails/día)
// Alternativa: EmailJS o Formspree

export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  // Opción 1: Usar Resend (recomendado - gratis hasta 100 emails/día)
  // Necesitas crear cuenta en https://resend.com y obtener API key
  // Agregar RESEND_API_KEY en .env.local
  
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = await import('resend')
      const resendClient = new resend.Resend(process.env.RESEND_API_KEY)

      await resendClient.emails.send({
        from: 'ALCONSTRUCCIONES SRL <onboarding@resend.dev>', // Cambiar por tu dominio verificado
        to: process.env.CONTACT_EMAIL || 'contacto.alconstrucciones@gmail.com',
        reply_to: data.email,
        subject: `Contacto: ${data.subject}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
          <p><strong>Asunto:</strong> ${data.subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
      })

      return { success: true }
    } catch (error) {
      console.error('Error sending email with Resend:', error)
      throw new Error('Error al enviar el email')
    }
  }

  // Opción 2: Fallback - Simular envío (para desarrollo)
  // En producción, deberías usar Resend, EmailJS o Formspree
  console.log('Contact form submission (development mode):', data)
  
  // Simular delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
}

