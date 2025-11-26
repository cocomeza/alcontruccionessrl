'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createObra, updateObra } from '@/lib/actions/obras'
import { obraSchema, type ObraFormData } from '@/lib/schemas/obra'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Uploader } from '@/components/common/uploader'
import { Checkbox } from '@/components/ui/checkbox'
import { Obra, OBRA_CATEGORIES } from '@/lib/types/database'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface ObraFormProps {
  obra?: Obra
}

export function ObraFormImproved({ obra }: ObraFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      title: obra?.title || '',
      description: obra?.description || '',
      images: obra?.images || [],
      videos: obra?.videos || [],
      category: (obra?.category as typeof OBRA_CATEGORIES[number]['value'] | undefined) || undefined,
      featured: obra?.featured || false,
    },
  })

  const images = watch('images')
  const videos = watch('videos')

  const onSubmit = async (data: ObraFormData) => {
    // Asegurar que images y videos siempre sean arrays
    const obraData = {
      ...data,
      images: data.images || [],
      videos: data.videos || [],
    }

    // Debug logging en desarrollo
    console.log('🔍 ObraForm Submit Debug:', {
      title: obraData.title,
      imagesCount: obraData.images.length,
      videosCount: obraData.videos.length,
      images: obraData.images,
      videos: obraData.videos,
      videosType: typeof obraData.videos,
      isVideosArray: Array.isArray(obraData.videos),
      isUpdate: !!obra,
      formData: obraData,
    })

    try {
      if (obra) {
        await updateObra(obra.id, obraData)
        toast.success('Obra actualizada correctamente')
      } else {
        await createObra(obraData)
        toast.success('Obra creada correctamente')
      }
      router.push('/admin/obras')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar la obra')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          {...register('title')}
          disabled={isSubmitting}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          {...register('description')}
          disabled={isSubmitting}
          rows={5}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          {...register('category')}
          disabled={isSubmitting}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.category ? 'border-destructive' : ''
          }`}
        >
          <option value="">Sin categoría</option>
          {OBRA_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={watch('featured')}
            onCheckedChange={(checked) => setValue('featured', !!checked)}
            disabled={isSubmitting}
          />
          <Label
            htmlFor="featured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Destacar obra (mostrar en el home)
          </Label>
        </div>
        <p className="text-sm text-muted-foreground ml-6">
          Si está marcado, la obra se mostrará en la página de inicio. Si no está marcado, solo aparecerá en la sección de obras.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Imágenes</Label>
          <Uploader
            type="image"
            onUploadComplete={(urls) => setValue('images', urls)}
            existingUrls={images}
          />
        </div>

        <div>
          <Label>Videos</Label>
          <Uploader
            type="video"
            onUploadComplete={(urls) => {
              console.log('🔍 Videos upload complete callback:', {
                urls,
                urlsLength: urls.length,
                urlsType: typeof urls,
                isArray: Array.isArray(urls),
                currentVideos: videos,
              })
              setValue('videos', urls, { shouldValidate: true })
              // Verificar que se guardó correctamente
              setTimeout(() => {
                const currentVideos = watch('videos')
                console.log('🔍 Videos después de setValue:', {
                  currentVideos,
                  currentVideosLength: currentVideos?.length || 0,
                  isArray: Array.isArray(currentVideos),
                })
              }, 100)
            }}
            existingUrls={videos}
          />
          {videos && videos.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {videos.length} video{videos.length > 1 ? 's' : ''} cargado{videos.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : obra
            ? 'Actualizar Obra'
            : 'Crear Obra'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </motion.form>
  )
}

