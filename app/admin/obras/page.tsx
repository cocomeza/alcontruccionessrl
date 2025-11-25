import { ClientObrasPage } from './client-obras-page'

export default function ObrasAdminPage() {
  // Usar componente cliente para evitar problemas de sincronización de cookies
  return <ClientObrasPage />
}

