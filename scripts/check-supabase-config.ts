/**
 * Script para verificar la configuración de Supabase
 * Ejecutar con: npx tsx scripts/check-supabase-config.ts
 */

import { createClient } from '@supabase/supabase-js'

async function main() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('🔍 Verificando configuración de Supabase...\n')

  // Verificar variables de entorno
  console.log('1. Variables de entorno:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? '✅ Configurada' : '❌ NO CONFIGURADA'}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'}`)

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('\n❌ ERROR: Faltan variables de entorno. Configura .env.local')
    process.exit(1)
  }

  // Verificar formato de URL
  if (!SUPABASE_URL.startsWith('https://') || !SUPABASE_URL.includes('.supabase.co')) {
    console.log('\n⚠️  ADVERTENCIA: La URL de Supabase no parece válida')
    console.log(`   URL actual: ${SUPABASE_URL}`)
    console.log('   Debería ser algo como: https://xxxxx.supabase.co')
  }

  // Crear cliente y verificar conexión
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  console.log('\n2. Verificando conexión con Supabase...')

  // Intentar una consulta simple
  try {
    const { error } = await supabase
      .from('obras')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log(`   ❌ Error de conexión: ${error.message}`)
      if (error.message.includes('relation "obras" does not exist')) {
        console.log('\n   💡 SOLUCIÓN: Ejecuta el script SQL en Supabase:')
        console.log('      1. Ve a tu proyecto en Supabase')
        console.log('      2. Abre SQL Editor')
        console.log('      3. Ejecuta el contenido de supabase/setup.sql')
      }
      if (error.message.includes('permission denied')) {
        console.log('\n   💡 SOLUCIÓN: Verifica las políticas RLS en Supabase')
        console.log('      1. Ve a Authentication > Policies')
        console.log('      2. Verifica que las políticas estén configuradas correctamente')
      }
    } else {
      console.log('   ✅ Conexión exitosa')
    }
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`)
  }

  // Verificar autenticación
  console.log('\n3. Verificando configuración de autenticación...')
  console.log('   ℹ️  Para verificar autenticación:')
  console.log('      1. Ve a Authentication > Settings en Supabase')
  console.log('      2. Verifica que "Enable Email Signup" esté habilitado')
  console.log('      3. Verifica que "Enable Email Confirmations" esté configurado según tus necesidades')

  console.log('\n4. Verificando usuarios existentes...')
  console.log('   ℹ️  Para verificar usuarios:')
  console.log('      1. Ve a Authentication > Users en Supabase')
  console.log('      2. Verifica que exista al menos un usuario')
  console.log('      3. Si el usuario tiene "Email Confirmed" = false, confírmalo manualmente')

  console.log('\n5. Verificando políticas RLS...')
  console.log('   ℹ️  Para verificar políticas:')
  console.log('      1. Ve a Table Editor > obras > RLS Policies')
  console.log('      2. Deberías ver políticas para lectura pública y escritura autenticada')

  console.log('\n✅ Verificación completada')
  console.log('\n📝 Próximos pasos si hay problemas:')
  console.log('   1. Verifica que las variables de entorno estén en .env.local')
  console.log('   2. Verifica que el proyecto de Supabase esté activo')
  console.log('   3. Ejecuta los scripts SQL en supabase/setup.sql')
  console.log('   4. Crea un usuario en Authentication > Users')
  console.log('   5. Verifica las políticas RLS en la tabla obras')
}

main().catch(console.error)
