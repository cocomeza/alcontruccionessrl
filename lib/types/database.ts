export interface Obra {
  id: string
  title: string
  description: string
  images: string[]
  videos: string[]
  category?: string
  created_at: string
}

export interface ObraInsert {
  title: string
  description: string
  images: string[]
  videos: string[]
  category?: string
}

export interface ObraUpdate {
  title?: string
  description?: string
  images?: string[]
  videos?: string[]
  category?: string
}

export const OBRA_CATEGORIES = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'edificios-altura', label: 'Edificios en Altura' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'obra-publica', label: 'Obra Pública' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'refaccion', label: 'Refacción' },
  { value: 'ampliacion', label: 'Ampliación' },
  { value: 'otros', label: 'Otros' },
] as const

export type ObraCategory = typeof OBRA_CATEGORIES[number]['value']

