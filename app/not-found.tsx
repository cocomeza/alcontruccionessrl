import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mystic flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-calypso mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Página no encontrada</p>
        <Link href="/obras">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}

