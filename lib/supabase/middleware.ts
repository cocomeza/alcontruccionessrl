import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it so that the user
  // is never authenticated, and they will be redirected to the login page
  // on every request.

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Logging para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.nextUrl.pathname} - User: ${user ? user.email : 'null'}, Error: ${authError?.message || 'none'}`)
  }

  // NO redirigir automáticamente por errores de auth - permitir que los componentes cliente manejen la verificación
  // Esto evita problemas de sincronización de cookies después del login
  if (authError && process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Error de auth en ${request.nextUrl.pathname}: ${authError.message} - Permitiendo acceso para verificación cliente`)
  }

  // Si el usuario está autenticado y está en /admin/login, PERMITIR que el cliente maneje la redirección
  // No redirigir desde el middleware para evitar conflictos con la redirección del cliente
  // El cliente redirigirá a /admin/obras después del login exitoso

  // Permitir que todas las rutas admin se carguen - los componentes cliente verificarán la autenticación
  // Esto evita problemas de sincronización de cookies entre servidor y cliente después del login
  // Los componentes cliente redirigirán al login si no hay sesión válida

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}

