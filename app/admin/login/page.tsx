'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// Removed signIn import - using Supabase client directly for better cookie sync
import { loginSchema, type LoginFormData } from '@/lib/schemas/obra'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
// Removed unused useRouter import
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPageImproved() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    toast.loading('Iniciando sesión...')
    
    try {
      const supabase = createClient()
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!authData?.session || !authData?.user) {
        throw new Error('No se recibió sesión del servidor')
      }

      // La sesión ya está establecida, las cookies se manejan automáticamente
      toast.success('Sesión iniciada correctamente')
      
      // Esperar un momento para asegurar que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Verificar la sesión una vez más antes de redirigir
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error obteniendo sesión:', sessionError)
        }
        throw new Error('Error al obtener la sesión después del login')
      }
      
      // Redirigir directamente a la página de obras usando window.location para forzar recarga completa
      window.location.href = '/admin/obras'
      
    } catch (err: any) {
      setIsSubmitting(false)
      toast.dismiss()
      
      let errorMessage = 'Error al iniciar sesión'
      if (err?.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.'
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión.'
        } else {
          errorMessage = err.message
        }
      }
      
      toast.error(errorMessage)
      setError('root', { message: errorMessage })
    }
  }

  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-calypso">ALCONSTRUCCIONES SRL</CardTitle>
            <CardDescription>Panel de Administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register('email')}
                  disabled={isSubmitting}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    {...register('password')}
                  disabled={isSubmitting}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              </div>
              {errors.root && (
                <p className="text-sm text-destructive text-center">{errors.root.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

