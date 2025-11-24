// Layout del admin - no verifica autenticación aquí
// La autenticación se maneja en el middleware y en cada página individual
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
