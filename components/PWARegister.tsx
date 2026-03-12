'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope)

          // Check for updates every 1 hour instead of every minute
          setInterval(() => {
            registration.update().catch(() => {})
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error('SW registration failed:', error)
        })

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated')
      })
    }
  }, [])

  return null
}
