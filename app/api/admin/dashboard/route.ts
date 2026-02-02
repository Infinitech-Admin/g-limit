import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
    console.log('Fetching from:', apiUrl) // Debug log

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const contentType = res.headers.get("content-type")
    const responseText = await res.text() // Get raw response first
    
    console.log('Response status:', res.status)
    console.log('Content-Type:', contentType)
    console.log('Response preview:', responseText.substring(0, 500))
    
    // Check if response is JSON
    if (contentType && contentType.includes("application/json")) {
      try {
        const data = JSON.parse(responseText)
        
        if (!res.ok) {
          console.error("Laravel dashboard error:", data)
          return NextResponse.json(
            { message: "Failed to fetch dashboard", error: data }, 
            { status: res.status }
          )
        }
        
        return NextResponse.json(data)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Raw response:", responseText)
        return NextResponse.json(
          { message: "Invalid JSON response", error: responseText.substring(0, 1000) },
          { status: 500 }
        )
      }
    } else {
      // Response is not JSON (HTML error page)
      console.error("Laravel returned non-JSON response:", responseText.substring(0, 1000))
      
      return NextResponse.json(
        { 
          message: "Server error - expected JSON but received HTML", 
          error: "Check your Laravel logs at storage/logs/laravel.log",
          preview: responseText.substring(0, 500)
        }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    )
  }
}
