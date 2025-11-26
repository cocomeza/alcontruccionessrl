/**
 * Script para debuggear los datos de las obras en la base de datos
 * Ejecutar con: npx tsx scripts/debug-obra-data.ts
 */

import { createClient } from '@/lib/supabase/server'

async function debugObraData() {
  console.log('🔍 Debuggeando datos de obras...\n')

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

    obras.forEach((obra, index) => {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`📦 Obra ${index + 1}: ${obra.title}`)
      console.log(`   ID: ${obra.id}`)
      console.log(`\n   🖼️  Imágenes:`)
      if (obra.images && Array.isArray(obra.images) && obra.images.length > 0) {
        console.log(`      ✅ Tiene ${obra.images.length} imagen(es)`)
        obra.images.forEach((img, i) => {
          console.log(`         [${i + 1}] ${img}`)
          console.log(`             Tipo: ${typeof img}`)
          console.log(`             Es URL válida: ${img?.startsWith('http')}`)
          console.log(`             Es Supabase: ${img?.includes('supabase')}`)
        })
      } else {
        console.log(`      ❌ No tiene imágenes`)
        console.log(`         Tipo de datos: ${typeof obra.images}`)
        console.log(`         Valor: ${JSON.stringify(obra.images)}`)
      }

      console.log(`\n   🎥 Videos:`)
      if (obra.videos && Array.isArray(obra.videos) && obra.videos.length > 0) {
        console.log(`      ✅ Tiene ${obra.videos.length} video(s)`)
        obra.videos.forEach((vid, i) => {
          console.log(`         [${i + 1}] ${vid}`)
          console.log(`             Tipo: ${typeof vid}`)
          console.log(`             Es URL válida: ${vid?.startsWith('http')}`)
          console.log(`             Es Supabase: ${vid?.includes('supabase')}`)
        })
      } else {
        console.log(`      ❌ No tiene videos`)
        console.log(`         Tipo de datos: ${typeof obra.videos}`)
        console.log(`         Valor: ${JSON.stringify(obra.videos)}`)
      }

      // Análisis de qué se mostrará en la card
      const hasImages = obra.images && Array.isArray(obra.images) && obra.images.length > 0
      const hasVideos = obra.videos && Array.isArray(obra.videos) && obra.videos.length > 0
      const showVideo = !hasImages && hasVideos

      console.log(`\n   📋 Análisis de visualización:`)
      console.log(`      hasImages: ${hasImages}`)
      console.log(`      hasVideos: ${hasVideos}`)
      console.log(`      showVideo: ${showVideo}`)
      if (hasImages) {
        console.log(`      → Se mostrará: IMAGEN`)
      } else if (showVideo) {
        console.log(`      → Se mostrará: VIDEO`)
      } else {
        console.log(`      → Se mostrará: PLACEHOLDER "Sin imagen"`)
      }
    })

    console.log(`\n${'='.repeat(60)}`)
    console.log('✅ Análisis completado')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

debugObraData()

