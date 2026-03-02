"use client"

import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, MessageCircle, Send, Sparkles, Aperture } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface QuickReply {
  label: string
  message: string
}

const quickReplies: QuickReply[] = [
  { label: "Our Services", message: "What services do you offer?" },
  { label: "Pricing Info", message: "What are your pricing options?" },
  { label: "Book Session", message: "How can I book a photography session?" },
  { label: "Portfolio", message: "Can I see your portfolio?" },
  { label: "Studio Location", message: "Where is your studio located?" },
  { label: "Contact Info", message: "How can I contact you?" },
]

const studioInfo = {
  about: "Founded with a passion for capturing life's most meaningful moments, our studio has grown into a trusted destination for professional photography. Every project begins with a simple belief: moments deserve to be preserved with care, intention, and beauty. We don't just take photos—we craft visual stories meant to last generations.",
  values: [
    { title: "Artistic Excellence", description: "Unique artistic vision creating meaningful, beautiful images." },
    { title: "Professional Quality", description: "Highest standards of professional photography guaranteed." },
    { title: "Personal Connection", description: "Understanding your story, creating collaborative experiences." },
    { title: "Client Commitment", description: "Your satisfaction is priority. Expectations exceeded." }
  ],
  experience: {
    years: "1+ Year of Creative excellence",
    clients: "50+ Trusted partnerships",
    photos: "5K+ Moments preserved"
  },
  studio: {
    name: "The G-Limit Studio",
    description: "A thoughtfully designed environment that empowers creativity, precision, and artistic freedom.",
    location: "Unit 303, Campos Rueda Building, Urban Avenue, Makati City",
    features: [
      "Professional Equipment: Industry-leading cameras and lighting",
      "Production Capabilities: High-end editing and workflows",
      "Creative Environment: Natural light, backdrops, and freedom"
    ]
  }
}

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()

  if (message.includes('service') || message.includes('offer')) {
    return "We offer a wide range of professional photography services including portraits, events, weddings, commercial photography, and creative shoots. Each service is tailored to capture your unique story with artistic excellence. With 1+ year of experience and 50+ satisfied clients, we ensure the highest standards of professional quality."
  }
  if (message.includes('book') || message.includes('appointment') || message.includes('schedule') || message.includes('session')) {
    return "Booking a session is easy! Fill out our booking form here: https://www.g-limitstudio.com/booking-form\n\nWe'll confirm your reservation within 24 hours. Every project begins with understanding your story — we're committed to making your session comfortable and memorable!"
  }
  if (message.includes('price') || message.includes('pricing') || message.includes('cost')) {
    return "Our pricing varies based on the type of session, duration, and deliverables. We offer flexible packages designed to suit different needs and budgets. Contact us for a detailed, personalized quote. Your satisfaction is our priority, and we're committed to exceeding your expectations."
  }
  if (message.includes('portfolio') || message.includes('work') || message.includes('examples') || message.includes('photos')) {
    return "We've preserved over 5,000+ moments for 50+ clients! Our portfolio showcases diverse photography styles across portraits, events, weddings, and commercial work. Check out our full portfolio here: https://www.g-limitstudio.com/portfolio"
  }
  if (message.includes('contact') || message.includes('reach') || message.includes('phone') || message.includes('email')) {
    return "Here's how you can reach us:\n\n📞 Contact No.: 09690537370\n📧 Email: g.limitstudio@gmail.com\n📸 Instagram: https://www.instagram.com/g.limitstudioph?igsh=MXA3YzhuaTFmNnNudA==\n🎵 TikTok: https://www.tiktok.com/@glimit.studio?_r=1&_t=ZS-942cxTHnfFd\n📘 Facebook: G-Limit Studio\n\nWe'd love to hear from you!"
  }
  if (message.includes('location') || message.includes('where') || message.includes('address') || message.includes('studio')) {
    return `The G-Limit Studio is located at ${studioInfo.studio.location}. Our thoughtfully designed creative space empowers creativity, precision, and artistic freedom. Visit us to experience our professional equipment, production capabilities, and inspiring creative environment.`
  }
  if (message.includes('about') || message.includes('who') || message.includes('values')) {
    return studioInfo.about + " Our values include Artistic Excellence, Professional Quality, Personal Connection, and Client Commitment."
  }
  if (message.includes('experience') || message.includes('years')) {
    return `With ${studioInfo.experience.years}, we've built ${studioInfo.experience.clients} and preserved ${studioInfo.experience.photos}. Our experience speaks to our commitment to excellence and our clients' trust in us.`
  }
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! Welcome to G-Limit Studio. ✦ How can we help you today? Feel free to ask about our services, pricing, or use the quick replies below!"
  }
  if (message.includes('thank')) {
    return "You're welcome! If you have any other questions about our photography services or would like to book a session, just let us know. We're here to help!"
  }
  return "Thank you for your message! I'd be happy to help you with information about our photography services, pricing, booking, or anything else. You can also use the quick reply buttons below for common questions!"
}

export default function Chatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! Welcome to G-Limit Studio. ✦ How can we help you capture your special moments today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isAdminPage = pathname?.startsWith('/admin')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isAdminPage) return null

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center shadow-2xl shadow-amber-200/20 transition-all duration-300 hover:scale-105 group"
          style={{
            background: "linear-gradient(135deg, #d4a843 0%, #f5e17a 100%)",
            border: "2px solid rgba(212,168,67,0.4)",
          }}
        >
          {/* Corner accents */}
          <span className="absolute top-1 left-1 w-2 h-2 border-l border-t border-black/20" />
          <span className="absolute top-1 right-1 w-2 h-2 border-r border-t border-black/20" />
          <span className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-black/20" />
          <span className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-black/20" />
          <MessageCircle className="w-6 h-6 text-black" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-[370px] h-[580px] flex flex-col z-50 shadow-2xl shadow-black/60"
          style={{
            background: "linear-gradient(135deg, #0d0a04 0%, #000000 100%)",
            border: "1px solid rgba(212,168,67,0.25)",
          }}
        >
          {/* Outer corner brackets */}
          <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-l-2 border-t-2 border-amber-200 pointer-events-none z-10" />
          <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-r-2 border-t-2 border-amber-200 pointer-events-none z-10" />
          <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-l-2 border-b-2 border-amber-200 pointer-events-none z-10" />
          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-r-2 border-b-2 border-amber-200 pointer-events-none z-10" />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
              borderBottom: "1px solid rgba(212,168,67,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #d4a843, #f5e17a)" }}
              >
                <Aperture className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <h3 className="text-amber-200 font-black tracking-widest text-xs uppercase">G-Limit Studio</h3>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="w-7 h-7 flex items-center justify-center border border-amber-200/20 text-amber-200/50 hover:text-amber-200 hover:border-amber-200/50 hover:bg-amber-200/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[82%] px-4 py-2.5"
                  style={
                    message.sender === 'user'
                      ? {
                          background: "linear-gradient(135deg, #d4a843 0%, #f5e17a 100%)",
                          color: "#000",
                        }
                      : {
                          background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)",
                          border: "1px solid rgba(212,168,67,0.2)",
                          color: "#e5e5e5",
                        }
                  }
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                      if (part.match(/^https?:\/\//)) {
                        return (
                          <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline ${message.sender === 'user' ? 'text-black/70 hover:text-black' : 'text-amber-200 hover:text-amber-100'}`}
                          >
                            {part}
                          </a>
                        )
                      }
                      return part
                    })}
                  </p>
                  <span className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-black/40' : 'text-gray-600'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div
            className="px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)", borderTop: "1px solid rgba(212,168,67,0.15)" }}
          >
            <p className="text-xs text-amber-200/40 font-bold tracking-widest uppercase mb-2">Quick replies</p>
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(reply.message)}
                  className="text-xs px-3 py-1.5 border border-amber-200/20 text-amber-200/60 hover:border-amber-200/60 hover:text-amber-200 hover:bg-amber-200/10 transition-all font-medium"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 flex-shrink-0 flex gap-2"
            style={{ background: "linear-gradient(135deg, #1a1208 0%, #0d0a04 100%)", borderTop: "1px solid rgba(212,168,67,0.15)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message…"
              className="flex-1 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(212,168,67,0.2)",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(212,168,67,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(212,168,67,0.2)")}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #d4a843 0%, #f5e17a 100%)" }}
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        </div>
      )}
    </>
  )
}
