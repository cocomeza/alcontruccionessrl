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

    for (const file of selectedFiles) {
      const validator = type === 'image' ? validateImage : validateVideo
      const validation = validator(file)

      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.error}`)
        continue
      }

      validFiles.push(file)

      if (type === 'image') {
        const preview = URL.createObjectURL(file)
        newPreviews.push(preview)
      }
    }

    setErrors(newErrors)
    setFiles((prev) => [...prev, ...validFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
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
      setUploadedUrls(allUrls)
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
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
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
          <Button onClick={handleUpload} disabled={uploading}>
            Subir {files.length} archivo{files.length > 1 ? 's' : ''}
          </Button>
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

