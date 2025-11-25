'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OBRA_CATEGORIES } from '@/lib/types/database'
import { motion } from 'framer-motion'

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    // Resetear página cuando cambia la categoría
    params.delete('page')
    router.push(`/obras?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleCategoryChange('all')}
      >
        Todas
      </Button>
      {OBRA_CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(category.value)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}

