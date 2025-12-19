import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactHero } from '@/components/contact/contact-hero'
import { ContactInfo } from '@/components/contact/contact-info'

export const metadata = {
  title: 'Contacto',
  description: 'Contáctanos para tu próximo proyecto de construcción. Estamos aquí para ayudarte a hacer realidad tus sueños con calidad y compromiso.',
  openGraph: {
    title: 'Contacto - ALCONSTRUCCIONES SRL',
    description: 'Contáctanos para tu próximo proyecto de construcción. Estamos aquí para ayudarte.',
    images: ["/logo.png"],
  },
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <ContactInfo />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
