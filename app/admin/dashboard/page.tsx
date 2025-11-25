import { ClientDashboard } from './client-dashboard'

export default function DashboardPage() {
  // Usar componente cliente para verificar autenticación del lado del navegador
  // Esto evita problemas de sincronización de cookies entre servidor y cliente
  return <ClientDashboard />
}

