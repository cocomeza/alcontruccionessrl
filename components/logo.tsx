'use client'

import Image from 'next/image'
import { useState } from 'react'

export function Logo() {
  const [error, setError] = useState(false)

  if (error) {
    // Si no hay logo, no mostrar nada
    return null
  }

  return (
    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
      <Image
        src="/logo.png"
        alt="ALCONSTRUCCIONES SRL Logo"
        fill
        className="object-contain"
        priority
        fetchPriority="high"
        onError={() => setError(true)}
      />
    </div>
  )
}

