// lib/imageLoader.ts
export default function imageLoader({ src }: { src: string }) {
  // If the src is already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // Otherwise, prepend your API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  return `${API_URL}${src}`
}
