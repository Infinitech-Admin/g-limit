// lib/imageLoader.ts
export default function imageLoader({ src }: { src: string }) {
  // If the src is already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // Define paths that should be served from Next.js public folder (local images)
  const localPaths = [
    '/photo',
    '/images', 
    '/assets',
    '/static',
    '/public',
    '/logos',
    '/icons',
    '/screenshots'
  ]
  
  // Check if the image path starts with any local path
  const isLocalImage = localPaths.some(path => src.startsWith(path))
  
  if (isLocalImage) {
    // Return the path as-is for Next.js to serve from public folder
    return src
  }
  
  // For API images (uploads, storage, categories, etc.), prepend API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  return `${API_URL}${src}`
}
