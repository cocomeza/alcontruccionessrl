'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Obra } from '@/lib/types/database'
import { ObraCard } from './obra-card'
import { ObraCardSkeleton } from './obra-card-skeleton'

interface ObrasDestacadasProps {
  obras: Obra[]
}

export function ObrasDestacadas({ obras }: ObrasDestacadasProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-calypso mb-3 sm:mb-4">
            Obras Destacadas
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Conoce algunos de nuestros proyectos más importantes
          </p>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <ObraCardSkeleton key={i} />
            ))}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {obras.map((obra, index) => (
              <ObraCard key={obra.id} obra={obra} index={index} />
            ))}
          </div>
        </Suspense>
        <div className="text-center">
          <Link href="/obras">
            <Button variant="outline" size="lg">
              Ver Todas las Obras
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

