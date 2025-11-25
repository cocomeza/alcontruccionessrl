'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Home, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    handleLogout()
  }, [])

  return (
    <div className="min-h-screen bg-mystic dark:bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <LogOut className="h-12 w-12 text-calypso" />
            </div>
            <CardTitle className="text-2xl text-calypso">Sesión Cerrada</CardTitle>
            <CardDescription>
              Has cerrado sesión correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
            <Link href="/admin/login" className="block">
              <Button variant="outline" className="w-full">
                Iniciar Sesión Nuevamente
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

