import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Public GET endpoint - no authentication required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '10'

    const response = await fetch(
      `${API_URL}/blog-videos?page=${page}&perPage=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch videos' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch videos' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blog videos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Protected POST endpoint - authentication required
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/blog-videos`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
      return NextResponse.json(
        { error: errorData.error || 'Upload failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
