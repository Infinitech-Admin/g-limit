import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '10'
    const search = searchParams.get('search') || ''
    const wouldRecommend = searchParams.get('would_recommend') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.append('page', page)
    queryParams.append('perPage', perPage)
    if (search) queryParams.append('search', search)
    if (wouldRecommend) queryParams.append('would_recommend', wouldRecommend)
    queryParams.append('sortBy', sortBy)
    queryParams.append('sortOrder', sortOrder)
    
    const response = await fetch(
      `${API_URL}/survey-form?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Failed to fetch survey responses' 
      }))
      return NextResponse.json(error, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Survey API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the payload being sent
    console.log('Sending to backend:', JSON.stringify(body, null, 2))
    console.log('Backend URL:', `${API_URL}/survey-form`)
    
    const response = await fetch(`${API_URL}/survey-form`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    
    // Log response details
    console.log('Backend response status:', response.status)
    
    if (!response.ok) {
      let error
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        error = await response.json()
      } else {
        const text = await response.text()
        console.error('Backend error (non-JSON):', text)
        error = { error: 'Failed to submit survey', details: text }
      }
      
      console.error('Backend error response:', error)
      return NextResponse.json(error, { status: response.status })
    }
    
    const data = await response.json()
    console.log('Backend success response:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Survey POST error:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
