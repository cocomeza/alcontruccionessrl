export function AdminLoading() {
  return (
    <div className="min-h-screen bg-mystic flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-calypso"></div>
        <p className="text-muted-foreground">Verificando autenticación...</p>
      </div>
    </div>
  )
}

