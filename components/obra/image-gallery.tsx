'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { ImageLightbox } from './image-lightbox'
import { motion } from 'framer-motion'

interface ImageGalleryProps {
  images: string[]
  title?: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
              onClick={() => handleImageClick(index)}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={image}
                  alt={`${title || 'Imagen'} - ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  unoptimized={image?.includes('supabase.co')}
                  onError={(e) => {
                    console.error('Error cargando imagen en galería:', image)
                    console.error('Event:', e)
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-semibold transition-opacity">
                    Click para ampliar
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
          title={title}
        />
      )}
    </>
  )
}

