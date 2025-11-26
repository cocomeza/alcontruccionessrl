'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react'
import { validateImage, validateVideo, compressImage, formatFileSize } from '@/lib/utils/upload'
import { uploadFile } from '@/lib/utils/storage'
import { motion, AnimatePresence } from 'framer-motion'

interface UploaderProps {
  type: 'image' | 'video'
  onUploadComplete: (urls: string[]) => void
  existingUrls?: string[]
}

export function Uploader({ type, onUploadComplete, existingUrls = [] }: UploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newErrors: string[] = []
    const validFiles: File[] = []
    const newPreviews: string[] = []

    console.log(`🔍 Uploader handleFileSelect (${type}):`, {
      selectedFilesCount: selectedFiles.length,
      selectedFiles: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
    })

    for (const file of selectedFiles) {
      const validator = type === 'image' ? validateImage : validateVideo
      const validation = validator(file)

      if (!validation.valid) {
        console.error(`❌ Archivo inválido (${type}):`, file.name, validation.error)
        newErrors.push(`${file.name}: ${validation.error}`)
        continue
      }

      validFiles.push(file)
      console.log(`✅ Archivo válido (${type}):`, file.name)

      if (type === 'image') {
        const preview = URL.createObjectURL(file)
        newPreviews.push(preview)
      }
    }

    console.log(`🔍 Uploader: Archivos válidos después de validación:`, {
      validFilesCount: validFiles.length,
      validFiles: validFiles.map(f => f.name),
    })

    setErrors(newErrors)
    setFiles((prev) => {
      const updated = [...prev, ...validFiles]
      console.log(`🔍 Uploader: Estado files actualizado:`, {
        prevCount: prev.length,
        newCount: updated.length,
        totalFiles: updated.map(f => f.name),
      })
      return updated
    })
    setPreviews((prev) => [...prev, ...newPreviews])
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (type === 'image') {
      setPreviews((prev) => {
        URL.revokeObjectURL(prev[index])
        return prev.filter((_, i) => i !== index)
      })
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setErrors([])

    const urls: string[] = []
    const totalFiles = files.length

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        let fileToUpload: File | Blob = file

        if (type === 'image') {
          fileToUpload = await compressImage(file)
        }

        const url = await uploadFile(
          fileToUpload,
          `${type}s/${file.name}`,
          (progressValue) => {
            const overallProgress = ((i + progressValue / 100) / totalFiles) * 100
            setProgress(overallProgress)
          }
        )

        urls.push(url)
        setProgress(((i + 1) / totalFiles) * 100)
      }

      const allUrls = [...uploadedUrls, ...urls]
      console.log('🔍 Uploader: URLs combinadas:', {
        uploadedUrls,
        newUrls: urls,
        allUrls,
        allUrlsLength: allUrls.length,
        isArray: Array.isArray(allUrls),
      })
      setUploadedUrls(allUrls)
      console.log('🔍 Uploader: Llamando onUploadComplete con:', allUrls)
      onUploadComplete(allUrls)
      setFiles([])
      setPreviews([])
      setProgress(0)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Error al subir archivos'])
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedUrl = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(newUrls)
    onUploadComplete(newUrls)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Seleccionar {type === 'image' ? 'imágenes' : 'videos'}
          </Button>
          {files.length > 0 && (
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="bg-boston-blue hover:bg-calypso"
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir {files.length} {type === 'image' ? 'imagen' : 'video'}{files.length > 1 ? 'es' : ''} a la plataforma
            </Button>
          )}
        </div>
        {files.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {files.length} {type === 'image' ? 'imagen' : 'video'}{files.length > 1 ? 'es' : ''} seleccionado{files.length > 1 ? 's' : ''}. 
            Haz clic en "Subir" para cargar {files.length > 1 ? 'los archivos' : 'el archivo'} a Supabase Storage.
          </p>
        )}
      </div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            Subiendo... {Math.round(progress)}%
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              {type === 'image' && previews[index] ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative aspect-square rounded-lg border flex items-center justify-center bg-muted">
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            {type === 'image' ? 'Imágenes' : 'Videos'} subidos:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedUrls.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                {type === 'image' ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUploadedUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-lg border flex items-center justify-center bg-muted">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUploadedUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

