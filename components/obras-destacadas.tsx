'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Obra } from '@/lib/types/database'
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
                <motion.div
                  key={obra.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/obra/${obra.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      {obra.images && obra.images.length > 0 ? (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={obra.images[0]}
                            alt={obra.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading={index < 3 ? 'eager' : 'lazy'}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">Sin imagen</p>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-calypso">
                          {obra.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {obra.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
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

