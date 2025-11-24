'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createObra, updateObra } from '@/lib/actions/obras'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Uploader } from '@/components/uploader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Obra } from '@/lib/types/database'
import { motion } from 'framer-motion'

interface ObraFormProps {
  obra?: Obra
}

export function ObraForm({ obra }: ObraFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(obra?.title || '')
  const [description, setDescription] = useState(obra?.description || '')
  const [images, setImages] = useState<string[]>(obra?.images || [])
  const [videos, setVideos] = useState<string[]>(obra?.videos || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (obra) {
        await updateObra(obra.id, {
          title,
          description,
          images,
          videos,
        })
      } else {
        await createObra({
          title,
          description,
          images,
          videos,
        })
      }
      router.push('/admin/obras')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la obra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
          rows={5}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Imágenes</Label>
          <Uploader
            type="image"
            onUploadComplete={setImages}
            existingUrls={images}
          />
        </div>

        <div>
          <Label>Videos</Label>
          <Uploader
            type="video"
            onUploadComplete={setVideos}
            existingUrls={videos}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : obra ? 'Actualizar Obra' : 'Crear Obra'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </motion.form>
  )
}

