import { MetadataRoute } from 'next'

/**
 * Sitemap Dinámico para Mapa Ambiental
 * Este archivo genera un sitemap.xml automáticamente
 * para mejorar el SEO y la indexación en motores de búsqueda
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Agregar más URLs dinámicamente cuando se implemente
    // Por ejemplo: páginas de datasets individuales
    // {
    //   url: `${baseUrl}/dataset/${id}`,
    //   lastModified: dataset.updatedAt,
    //   changeFrequency: 'weekly',
    //   priority: 0.6,
    // },
  ]
}
