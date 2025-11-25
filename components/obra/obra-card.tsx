'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { OBRA_CATEGORIES } from '@/lib/types/database'
import type { Obra } from '@/lib/types/database'

interface ObraCardProps {
  obra: Obra
  index: number
}

export function ObraCard({ obra, index }: ObraCardProps) {
  return (
    <motion.div
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading={index < 6 ? 'eager' : 'lazy'}
                unoptimized={obra.images[0]?.includes('supabase.co')}
                onError={(e) => {
                  console.error('Error cargando imagen:', obra.images[0])
                  console.error('Event:', e)
                }}
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Sin imagen</p>
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-semibold text-calypso flex-1">
                {obra.title}
              </h2>
              {obra.category && (
                <span className="text-xs px-2 py-1 bg-calypso/10 text-calypso rounded-full whitespace-nowrap">
                  {OBRA_CATEGORIES.find(c => c.value === obra.category)?.label || obra.category}
                </span>
              )}
            </div>
            <p className="text-muted-foreground line-clamp-3">
              {obra.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

