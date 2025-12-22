/**
 * Script para diagnosticar problemas con videos en la base de datos
 * Ejecutar con: npx tsx scripts/check-videos-in-db.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkVideos() {
  console.log('🔍 Verificando videos en la base de datos...\n')

  const { data: obras, error } = await supabase
    .from('obras')
    .select('id, title, images, videos, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('❌ Error al obtener obras:', error)
    return
  }

  if (!obras || obras.length === 0) {
    console.log('⚠️ No hay obras en la base de datos')
    return
  }

  console.log(`📊 Total de obras encontradas: ${obras.length}\n`)

  obras.forEach((obra, index) => {
    const images = Array.isArray(obra.images) ? obra.images : (obra.images ? [obra.images] : [])
    const videos = Array.isArray(obra.videos) ? obra.videos : (obra.videos ? [obra.videos] : [])

    console.log(`\n${index + 1}. Obra: "${obra.title}"`)
    console.log(`   ID: ${obra.id}`)
    console.log(`   Imágenes: ${images.length}`)
    if (images.length > 0) {
      console.log(`     - ${images.slice(0, 2).join('\n     - ')}`)
      if (images.length > 2) console.log(`     ... y ${images.length - 2} más`)
    }
    console.log(`   Videos: ${videos.length}`)
    if (videos.length > 0) {
      console.log(`     - ${videos.slice(0, 2).join('\n     - ')}`)
      if (videos.length > 2) console.log(`     ... y ${videos.length - 2} más`)
      
      // Verificar si las URLs son válidas
      videos.forEach((videoUrl, i) => {
        const isVideoUrl = videoUrl.includes('video') || 
                           videoUrl.includes('.mp4') || 
                           videoUrl.includes('.webm') || 
                           videoUrl.includes('.ogg')
        if (!isVideoUrl) {
          console.log(`     ⚠️ Video ${i + 1} no parece ser una URL de video: ${videoUrl}`)
        }
      })
    } else {
      console.log(`   ⚠️ No hay videos en esta obra`)
    }

    // Verificar si hay videos en el campo de imágenes (error común)
    const videosInImages = images.filter(img => 
      img.includes('video') || 
      img.includes('.mp4') || 
      img.includes('.webm') || 
      img.includes('.ogg')
    )
    if (videosInImages.length > 0) {
      console.log(`   ❌ PROBLEMA DETECTADO: ${videosInImages.length} video(s) encontrado(s) en el campo de imágenes!`)
      videosInImages.forEach(video => console.log(`     - ${video}`))
    }
  })

  // Resumen
  const obrasConVideos = obras.filter(obra => {
    const videos = Array.isArray(obra.videos) ? obra.videos : (obra.videos ? [obra.videos] : [])
    return videos.length > 0
  })

  console.log(`\n\n📊 RESUMEN:`)
  console.log(`   - Obras con videos: ${obrasConVideos.length}/${obras.length}`)
  console.log(`   - Total de videos: ${obras.reduce((acc, obra) => {
    const videos = Array.isArray(obra.videos) ? obra.videos : (obra.videos ? [obra.videos] : [])
    return acc + videos.length
  }, 0)}`)
}

checkVideos().catch(console.error)
