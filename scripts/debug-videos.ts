/**
 * Script de diagnóstico para verificar videos en obras
 * Ejecutar con: npx tsx scripts/debug-videos.ts
 */

import { createClient } from '@/lib/supabase/server'

async function debugVideos() {
  const supabase = await createClient()
  
  console.log('🔍 Verificando obras con videos...\n')
  
  const { data: obras, error } = await supabase
    .from('obras')
    .select('id, title, images, videos')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Error al obtener obras:', error)
    return
  }
  
  console.log(`📊 Total de obras: ${obras?.length || 0}\n`)
  
  obras?.forEach((obra, index) => {
    const imagesCount = Array.isArray(obra.images) ? obra.images.length : 0
    const videosCount = Array.isArray(obra.videos) ? obra.videos.length : 0
    
    console.log(`\n${index + 1}. Obra: ${obra.title}`)
    console.log(`   ID: ${obra.id}`)
    console.log(`   Imágenes: ${imagesCount}`)
    console.log(`   Videos: ${videosCount}`)
    
    if (videosCount > 0) {
      console.log(`   📹 URLs de videos:`)
      obra.videos.forEach((video: string, i: number) => {
        console.log(`      ${i + 1}. ${video}`)
        console.log(`         - Es URL de Supabase: ${video.includes('supabase.co') || video.includes('supabase.com')}`)
        console.log(`         - Es URL válida: ${video.startsWith('http')}`)
      })
    }
    
    if (imagesCount > 0 && videosCount > 0) {
      console.log(`   ⚠️  Esta obra tiene imágenes Y videos. En la card se mostrará solo la imagen.`)
    } else if (videosCount > 0 && imagesCount === 0) {
      console.log(`   ✅ Esta obra solo tiene videos. Debería mostrarse el video en la card.`)
    }
  })
  
  // Verificar obras con videos pero sin imágenes
  const obrasSoloVideos = obras?.filter(
    obra => 
      Array.isArray(obra.videos) && 
      obra.videos.length > 0 && 
      (!obra.images || (Array.isArray(obra.images) && obra.images.length === 0))
  )
  
  console.log(`\n\n📹 Obras que SOLO tienen videos (deberían mostrar video en la card): ${obrasSoloVideos?.length || 0}`)
  
  // Verificar obras con videos e imágenes
  const obrasConVideosEImagenes = obras?.filter(
    obra => 
      Array.isArray(obra.videos) && 
      obra.videos.length > 0 && 
      Array.isArray(obra.images) && 
      obra.images.length > 0
  )
  
  console.log(`📸 Obras con videos E imágenes (mostrarán imagen en la card): ${obrasConVideosEImagenes?.length || 0}`)
}

debugVideos().catch(console.error)

