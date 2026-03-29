import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Bowery Street Studio Tatouage',
    short_name: 'The Boweryst',
    description: 'Studio de tatouage professionnel à Lorient, Bretagne',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#ededed',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // TODO: Add PNG
      // Generate with https://realfavicongenerator.net/ and add to public folder
      // { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      // { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
