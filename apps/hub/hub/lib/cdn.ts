const CDN_BASE = 'https://cdn.henmo.ai'

export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return

  const resources = [
    '/fonts/inter.woff2',
    '/icons/logo.svg',
    '/api/auth/session'
  ]

  resources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.startsWith('/api') ? resource : `${CDN_BASE}${resource}`
    link.as = resource.includes('font') ? 'font' : resource.includes('api') ? 'fetch' : 'image'
    if (resource.includes('font')) link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

export const prefetchRoutes = (routes: string[]) => {
  if (typeof window === 'undefined') return

  routes.forEach(route => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  })
}

export const optimizeImages = (src: string, width?: number) => {
  if (src.startsWith('http')) return src
  const params = width ? `?w=${width}&q=80&f=webp` : '?q=80&f=webp'
  return `${CDN_BASE}${src}${params}`
}