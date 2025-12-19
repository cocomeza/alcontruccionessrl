'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendContactEmail } from '@/lib/actions/contact'
import { toast } from 'sonner'
import { ScrollAnimation } from '@/components/common/scroll-animation'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await sendContactEmail(data)
      toast.success('Mensaje enviado correctamente. Te responderemos pronto.')
      reset()
    } catch (error) {
      toast.error('Error al enviar el mensaje. Por favor, intenta nuevamente.')
      console.error('Error sending contact email:', error)
    }
  }

  return (
    <ScrollAnimation direction="right" delay={0.2}>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-semibold text-calypso">
          Nombre *
        </Label>
        <Input
          id="name"
          {...register('name')}
          disabled={isSubmitting}
          placeholder="Tu nombre completo"
          className={`h-11 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-calypso'}`}
        />
        {errors.name && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            {errors.name.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-semibold text-calypso">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={isSubmitting}
          placeholder="tu@email.com"
          className={`h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-calypso'}`}
        />
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-semibold text-calypso">
          Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          disabled={isSubmitting}
          placeholder="011 6865-3696"
          className="h-11 focus-visible:ring-calypso"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-base font-semibold text-calypso">
          Asunto *
        </Label>
        <Input
          id="subject"
          {...register('subject')}
          disabled={isSubmitting}
          placeholder="¿En qué podemos ayudarte?"
          className={`h-11 ${errors.subject ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-calypso'}`}
        />
        {errors.subject && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            {errors.subject.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-base font-semibold text-calypso">
          Mensaje *
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          disabled={isSubmitting}
          rows={6}
          placeholder="Cuéntanos sobre tu proyecto..."
          className={`resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-calypso'}`}
        />
        {errors.message && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            {errors.message.message}
          </motion.p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold bg-calypso hover:bg-boston-blue transition-all duration-300 shadow-lg hover:shadow-xl" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            Enviando...
          </span>
        ) : (
          'Enviar Mensaje'
        )}
      </Button>
    </form>
    </ScrollAnimation>
  )
}

