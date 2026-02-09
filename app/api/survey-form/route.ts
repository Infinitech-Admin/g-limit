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
      const error = await response.json().catch(() => ({ error: 'Failed to fetch survey responses' }))
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
