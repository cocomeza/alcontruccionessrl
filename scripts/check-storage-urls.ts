/**
 * Script para verificar las URLs de imágenes y videos guardadas en la base de datos
 * Ejecutar con: npx tsx scripts/check-storage-urls.ts
 */

import { createClient } from '@/lib/supabase/server'
import { isSupabaseUrl } from '@/lib/utils/storage'

async function checkStorageUrls() {
  console.log('🔍 Verificando URLs de storage en la base de datos...\n')

  try {
    const supabase = await createClient()
    
    // Obtener todas las obras
    const { data: obras, error } = await supabase
      .from('obras')
      .select('id, title, images, videos')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error al obtener obras:', error.message)
      process.exit(1)
    }

    if (!obras || obras.length === 0) {
      console.log('⚠️  No se encontraron obras en la base de datos.')
      return
    }

    console.log(`📊 Total de obras encontradas: ${obras.length}\n`)

    let totalImages = 0
    let totalVideos = 0
    let invalidImages = 0
    let invalidVideos = 0

    for (const obra of obras) {
      console.log(`\n📦 Obra: ${obra.title} (ID: ${obra.id})`)
      
      // Verificar imágenes
      if (obra.images && Array.isArray(obra.images) && obra.images.length > 0) {
        console.log(`  🖼️  Imágenes (${obra.images.length}):`)
        obra.images.forEach((imageUrl: string, index: number) => {
          totalImages++
          const isValid = imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')
          const isSupabase = isSupabaseUrl(imageUrl)
          
          if (!isValid || !isSupabase) {
            invalidImages++
            console.log(`    ❌ [${index + 1}] URL inválida o no es de Supabase:`, imageUrl)
          } else {
            console.log(`    ✅ [${index + 1}] ${imageUrl}`)
          }
        })
      } else {
        console.log('  🖼️  Sin imágenes')
      }

      // Verificar videos
      if (obra.videos && Array.isArray(obra.videos) && obra.videos.length > 0) {
        console.log(`  🎥 Videos (${obra.videos.length}):`)
        obra.videos.forEach((videoUrl: string, index: number) => {
          totalVideos++
          const isValid = videoUrl && typeof videoUrl === 'string' && videoUrl.startsWith('http')
          const isSupabase = isSupabaseUrl(videoUrl)
          
          if (!isValid || !isSupabase) {
            invalidVideos++
            console.log(`    ❌ [${index + 1}] URL inválida o no es de Supabase:`, videoUrl)
          } else {
            console.log(`    ✅ [${index + 1}] ${videoUrl}`)
          }
        })
      } else {
        console.log('  🎥 Sin videos')
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMEN:')
    console.log('='.repeat(60))
    console.log(`Total de imágenes: ${totalImages}`)
    console.log(`  ✅ Válidas: ${totalImages - invalidImages}`)
    console.log(`  ❌ Inválidas: ${invalidImages}`)
    console.log(`\nTotal de videos: ${totalVideos}`)
    console.log(`  ✅ Válidos: ${totalVideos - invalidVideos}`)
    console.log(`  ❌ Inválidos: ${invalidVideos}`)

    if (invalidImages > 0 || invalidVideos > 0) {
      console.log('\n⚠️  Se encontraron URLs inválidas. Verifica:')
      console.log('   1. Que el bucket "obras-media" esté configurado como público')
      console.log('   2. Que las políticas de storage permitan acceso público')
      console.log('   3. Que las URLs se estén generando correctamente con getPublicUrl()')
      process.exit(1)
    } else {
      console.log('\n✅ Todas las URLs son válidas!')
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkStorageUrls()

