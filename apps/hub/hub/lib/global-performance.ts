export const initGlobalPerformance = () => {
  if (typeof window === 'undefined') return

  // Preload critical resources
  const criticalResources = [
    { href: '/api/auth/session', as: 'fetch' },
    { href: '/fonts/inter.woff2', as: 'font', crossOrigin: 'anonymous' }
  ]

  criticalResources.forEach(({ href, as, crossOrigin }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossOrigin) link.crossOrigin = crossOrigin
    document.head.appendChild(link)
  })

  // Prefetch next likely routes
  const prefetchRoutes = ['/chat', '/memory', '/settings']
  prefetchRoutes.forEach(route => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  })

  // Service worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

export const optimizeForRegion = () => {
  if (typeof window === 'undefined') return

  // Detect user region and optimize accordingly
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const region = timezone.split('/')[0]
  
  // Set appropriate CDN endpoint
  const cdnEndpoint = region === 'America' ? 'us-cdn.henmo.ai' : 
                     region === 'Europe' ? 'eu-cdn.henmo.ai' : 
                     'asia-cdn.henmo.ai'
  
  document.documentElement.setAttribute('data-cdn', cdnEndpoint)
}