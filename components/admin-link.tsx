import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function AdminLink() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <Link href="/admin/dashboard">
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-calypso">
        <Settings className="h-5 w-5" />
        <span className="sr-only">Panel de Administración</span>
      </Button>
    </Link>
  )
}

