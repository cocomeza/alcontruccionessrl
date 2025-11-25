'use server'

import sharp from 'sharp'

export async function compressImageServer(imageBuffer: ArrayBuffer): Promise<Blob> {
  const buffer = Buffer.from(imageBuffer)
  
  const compressed = await sharp(buffer)
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer()

  return new Blob([new Uint8Array(compressed)], { type: 'image/jpeg' })
}

