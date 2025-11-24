import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, Clock, Phone } from 'lucide-react'
import { ContactHero } from '@/components/contact-hero'
import { ContactInfo } from '@/components/contact-info'

export const metadata = {
  title: 'Contacto - ALCONSTRUCCIONES SRL',
  description: 'Contáctanos para tu próximo proyecto de construcción',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de Contacto */}
            <ContactInfo />

            {/* Formulario de Contacto */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-calypso mb-6">Envíanos un Mensaje</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
