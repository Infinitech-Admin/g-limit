"use client"
import dynamic from "next/dynamic"

// ssr: false is only allowed in Client Components
const Chatbot = dynamic(() => import("@/components/Chatbot"), {
  ssr: false,
  loading: () => null,
})

export default function ClientProviders() {
  return <Chatbot />
}
